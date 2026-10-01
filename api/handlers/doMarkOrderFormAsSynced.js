import markOrderFormAsSynced from '../../database/markOrderFormAsSynced.js';
export default function doMarkOrderFormAsSynced(request, response) {
    const { orderFormId, username } = request.body;
    const result = markOrderFormAsSynced(orderFormId, username);
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
            recordSync_timeMillis: result
        }
    });
}
