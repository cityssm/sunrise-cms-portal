import { DatabaseSync } from 'node:sqlite';
import { databasePath } from '../helpers/database.helpers.js';
export default function getUnprocessedOrderForms() {
    const database = new DatabaseSync(databasePath);
    const rawUnprocessedOrderForms = database
        .prepare(`
      SELECT
        orderFormId,
        orderFormKey,
        orderFormData AS orderFormDataString,
        recordCreate_ipAddress,
        recordCreate_timeMillis
      FROM
        OrderForms
      WHERE
        recordProcess_timeMillis IS NULL
        AND recordDelete_timeMillis IS NULL
    `)
        .all();
    database.close();
    return rawUnprocessedOrderForms.map(({ orderFormDataString, ...rest }) => ({
        ...rest,
        orderFormData: JSON.parse(orderFormDataString)
    }));
}
