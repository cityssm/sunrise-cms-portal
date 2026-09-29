import getUnprocessedOrderForms from '../../database/getUnprocessedOrderForms.js';
export default function doGetUnprocessedOrderForms(request, response) {
    const unprocessedOrderForms = getUnprocessedOrderForms();
    response.json({
        success: true,
        ip: request.ip ?? '',
        data: {
            orderForms: unprocessedOrderForms
        }
    });
}
