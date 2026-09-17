import { millisecondsInOneMinute } from '@cityssm/to-millis';
import * as dateTimeFunctions from '@cityssm/utils-datetime';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import Debug from 'debug';
import express from 'express';
import rateLimit from 'express-rate-limit';
import createError from 'http-errors';
import { DEBUG_NAMESPACE, PROCESS_ID_MAX_DIGITS } from '../debug.config.js';
import * as configFunctions from '../helpers/config.helpers.js';
import packageJson from '../package.json' with { type: 'json' };
import routerDashboard from '../routes/dashboard.js';
import routerOrderForm from '../routes/orderForm.js';
export const version = packageJson.version;
const debug = Debug(`${DEBUG_NAMESPACE}:app:${process.pid.toString().padEnd(PROCESS_ID_MAX_DIGITS)}`);
export default function getApp() {
    const app = express();
    app.use((request, _response, next) => {
        debug(`${request.method} ${request.url}`);
        next();
    });
    app.set('views', 'views').set('view engine', 'ejs');
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
    const urlPrefix = configFunctions.getConfigProperty('reverseProxy.urlPrefix');
    if (urlPrefix !== '') {
        debug(`urlPrefix = ${urlPrefix}`);
        app.all('', (_request, response) => {
            response.redirect(urlPrefix);
        });
    }
    if (!configFunctions.getConfigProperty('reverseProxy.disableRateLimit')) {
        app.use(rateLimit({
            limit: 2000,
            windowMs: millisecondsInOneMinute
        }));
    }
    app
        .use(urlPrefix, express.static('public'))
        .use(`${urlPrefix}/lib/bulma`, express.static('node_modules/bulma/css'))
        .use(`${urlPrefix}/lib/cityssm-bulma-js/bulma-js.js`, express.static('node_modules/@cityssm/bulma-js/dist/bulma-js.js'))
        .use(`${urlPrefix}/lib/cityssm-fa-glow/fa-glow.min.css`, express.static('node_modules/@cityssm/fa-glow/fa-glow.min.css'))
        .use(`${urlPrefix}/lib/cityssm-bulma-webapp-js/cityssm.js`, express.static('node_modules/@cityssm/bulma-webapp-js/dist/cityssm.js'))
        .use(`${urlPrefix}/lib/fa/js/all.min.js`, express.static('node_modules/@fortawesome/fontawesome-free/js/all.min.js'))
        .use(`${urlPrefix}/lib/fa/css/all.min.css`, express.static('node_modules/@fortawesome/fontawesome-free/css/all.min.css'));
    app.use((request, response, next) => {
        response.locals.buildNumber = version;
        response.locals.configFunctions = configFunctions;
        response.locals.dateTimeFunctions = dateTimeFunctions;
        response.locals.urlPrefix = urlPrefix;
        next();
    });
    app.get(`${urlPrefix}/`, (_request, response) => {
        response.redirect(`${urlPrefix}/dashboard`);
    });
    app.use(`${urlPrefix}/dashboard`, routerDashboard());
    if (configFunctions.getConfigProperty('features.orderForm.isEnabled')) {
        app.use(`${urlPrefix}/${configFunctions.getConfigProperty('features.orderForm.route')}`, routerOrderForm());
    }
    app.use((_request, _response, next) => {
        next(createError(404));
    });
    app.use((error, request, response, _next) => {
        response.locals.message = error.message;
        response.locals.error =
            request.app.get('env') === 'development' ? error : {};
        response.locals.configFunctions = configFunctions;
        response.locals.urlPrefix = configFunctions.getConfigProperty('reverseProxy.urlPrefix');
        response.status(error.status ?? 500);
        response.render('error');
    });
    return app;
}
