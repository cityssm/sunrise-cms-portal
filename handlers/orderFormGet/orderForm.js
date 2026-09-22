import { relationships } from '@cityssm/cemetery-utils';
import DataCache from '../../helpers/dataCache.js';
const dataCache = new DataCache();
export default function handler(request, response) {
    const data = dataCache.getData();
    response.render('orderForm', {
        headTitle: 'Order Form',
        ...data,
        relationships
    });
}
