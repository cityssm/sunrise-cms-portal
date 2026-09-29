import markOrderFormAsProcessed from '../../database/markOrderFormAsProcessed.js';
export default function doMarkOrderFormAsProcessed(request, response) {
    const { contractId, orderFormId, username } = request.body;
    const result = markOrderFormAsProcessed(orderFormId, contractId, username);
    if (result === undefined) {
        response.status(500).send({
            success: false,
            ip: request.ip ?? '',
            error: `Order form with ID ${orderFormId} not found or already processed.`
        });
        return;
    }
    response.send({
        success: true,
        ip: request.ip ?? '',
        data: {
            recordUpdate_timeMillis: result
        }
    });
}
