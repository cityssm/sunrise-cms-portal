import { Router } from 'express';
import { doDataSyncEndpoint, doDeleteOrderFormEndpoint, doGetUnprocessedOrderFormsEndpoint, doMarkOrderFormAsProcessedEndpoint } from 'sunrise-cms-shared';
import doDataSyncHandler from './handlers/doDataSync.js';
import doDeleteOrderFormHandler from './handlers/doDeleteOrderForm.js';
import doGetUnprocessedOrderFormsHandler from './handlers/doGetUnprocessedOrderForms.js';
import doMarkOrderFormAsProcessedHandler from './handlers/doMarkOrderFormAsProcessed.js';
export default function getApiRouter() {
    const router = Router();
    router
        .get('/', (request, response) => {
        response.send({
            success: true,
            ip: request.ip ?? '',
            data: undefined
        });
    })
        .post(`/${doDataSyncEndpoint}`, doDataSyncHandler)
        .post(`/${doGetUnprocessedOrderFormsEndpoint}`, doGetUnprocessedOrderFormsHandler)
        .post(`/${doMarkOrderFormAsProcessedEndpoint}`, doMarkOrderFormAsProcessedHandler)
        .post(`/${doDeleteOrderFormEndpoint}`, doDeleteOrderFormHandler);
    return router;
}
