import { Router } from 'express';
import { doDataSyncEndpoint } from 'sunrise-cms-shared';
import doDataSyncHandler from './handlers/doDataSync.js';
export default function getDashboardRouter() {
    const router = Router();
    router.get('/', (request, response) => {
        response.send({
            success: true,
            ip: request.ip ?? '',
            data: undefined
        });
    })
        .post(`/${doDataSyncEndpoint}`, doDataSyncHandler);
    return router;
}
