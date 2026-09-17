import { millisecondsInOneMinute } from '@cityssm/to-millis';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import Debug from 'debug';
import express from 'express';
import rateLimit from 'express-rate-limit';
import createError from 'http-errors';
import { DEBUG_NAMESPACE, PROCESS_ID_MAX_DIGITS } from '../debug.config.js';
import * as configFunctions from '../helpers/config.helpers.js';
import routerApi from './apiRouter.js';
const debug = Debug(`${DEBUG_NAMESPACE}:apiApp:${process.pid.toString().padEnd(PROCESS_ID_MAX_DIGITS)}`);
export default function getApp() {
    const app = express();
    app.use((request, _response, next) => {
        debug(`${request.method} ${request.url}`);
        next();
    });
    app.disable('x-powered-by');
    if (configFunctions.getConfigProperty('reverseProxy.disableEtag')) {
        app.set('etag', false);
    }
    if (!configFunctions.getConfigProperty('reverseProxy.disableCompression')) {
        app.use(compression());
    }
    app.use(express.json());
    app.use(express.urlencoded({
        extended: false
    }));
    app.use(cookieParser());
    if (!configFunctions.getConfigProperty('reverseProxy.disableRateLimit')) {
        app.use(rateLimit({
            limit: 2000,
            windowMs: millisecondsInOneMinute
        }));
    }
    const urlPrefix = configFunctions.getConfigProperty('api.apiKey');
    const ipAllowList = configFunctions.getConfigProperty('api.ipAllowList');
    app.use(`/${urlPrefix}`, (request, response, next) => {
        const requestIp = request.ip;
        const forbiddenResponse = {
            success: false,
            error: 'Forbidden',
            ip: requestIp ?? ''
        };
        if (ipAllowList === '*' || ipAllowList.includes(requestIp ?? '')) {
            next();
            return;
        }
        response.status(403).send(forbiddenResponse);
    }, routerApi());
    app.use((_request, _response, next) => {
        next(createError(404));
    });
    app.use((error, _request, response, _next) => {
        const errorResponse = {
            success: false,
            error: error.message ?? 'An unknown error occurred',
            ip: _request.ip ?? ''
        };
        response.status(error.status ?? 500).send(errorResponse);
    });
    return app;
}
