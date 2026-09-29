import deleteOrderForm from '../../database/deleteOrderForm.js';
export default function doDeleteOrderFormHandler(request, response) {
    const { orderFormId, username } = request.body;
    const result = deleteOrderForm(orderFormId, username);
    if (result === undefined) {
        response.status(500).send({
            success: false,
            ip: request.ip ?? '',
            error: `Order form with ID ${orderFormId} not found or already deleted.`
        });
        return;
    }
    response.send({
        success: true,
        ip: request.ip ?? '',
        data: {
            recordDelete_timeMillis: result
        }
    });
}
