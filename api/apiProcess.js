import http from 'node:http';
import Debug from 'debug';
import exitHook, { gracefulExit } from 'exit-hook';
import { DEBUG_NAMESPACE, PROCESS_ID_MAX_DIGITS } from '../debug.config.js';
import { getConfigProperty } from '../helpers/config.helpers.js';
import apiApp from './apiApp.js';
const debug = Debug(`${DEBUG_NAMESPACE}:apiProcess:${process.pid.toString().padEnd(PROCESS_ID_MAX_DIGITS)}`);
function onError(error) {
    if (error.syscall !== 'listen') {
        throw error;
    }
    switch (error.code) {
        case 'EACCES': {
            debug('Requires elevated privileges');
            gracefulExit(1);
            break;
        }
        case 'EADDRINUSE': {
            debug('Port is already in use.');
            gracefulExit(1);
            break;
        }
        default: {
            throw error;
        }
    }
}
function onListening(server) {
    const addr = server.address();
    if (addr !== null) {
        const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr.port.toString()}`;
        debug(`API HTTP Listening on ${bind}`);
    }
}
process.title = `${getConfigProperty('application.applicationName')} (API)`;
const httpPort = getConfigProperty('api.httpPort');
const httpServer = http.createServer(apiApp());
httpServer
    .listen(httpPort)
    .on('error', onError)
    .on('listening', () => {
    onListening(httpServer);
});
exitHook(() => {
    debug('Closing HTTP');
    httpServer.close();
    httpServer.closeAllConnections();
});
