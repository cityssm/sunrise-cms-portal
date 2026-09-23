import saveOrderForm from '../../database/saveOrderForm.js';
const allowedFields = new Set([
    'submitterName',
    'submitterEmail',
    'contractTypeId',
    'contractTypeIdText',
    'funeralHomeId',
    'funeralHomeIdText',
    'funeralHomeName',
    'funeralHomeAddress1',
    'funeralHomeAddress2',
    'funeralHomeCity',
    'funeralHomeProvince',
    'funeralHomePostalCode',
    'funeralHomePhoneNumber',
    'funeralDirectorName',
    'purchaserName',
    'purchaserAddress1',
    'purchaserAddress2',
    'purchaserCity',
    'purchaserProvince',
    'purchaserPostalCode',
    'purchaserPhoneNumber',
    'purchaserEmail',
    'purchaserRelationship',
    'deceasedName',
    'deceasedAddress1',
    'deceasedAddress2',
    'deceasedCity',
    'deceasedProvince',
    'deceasedPostalCode',
    'birthDateString',
    'birthPlace',
    'deathDateString',
    'deathPlace',
    'funeralDateString',
    'funeralTimeString',
    'intermentContainerTypeId',
    'intermentContainerTypeIdText',
    'intermentDepthId',
    'intermentDepthIdText',
    'cemeteryId',
    'cemeteryIdText',
    'burialSiteNamePrefix',
    'burialSiteName',
    'directionOfArrival',
    'directionOfArrivalText',
    'committalTypeId',
    'committalTypeIdText',
    'comment'
]);
const serviceTypeIdRegex = /^serviceTypeId(?:Text)?-\d+$/v;
export default function handler(request, response) {
    const orderFormData = {};
    for (const [key, value] of Object.entries(request.body)) {
        if (allowedFields.has(key) || serviceTypeIdRegex.test(key)) {
            orderFormData[key] = value;
        }
    }
    const orderFormKey = saveOrderForm(orderFormData, request.ip ?? '');
    response.json({ orderFormKey, success: true });
}
