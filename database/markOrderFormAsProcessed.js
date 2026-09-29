import { DatabaseSync } from 'node:sqlite';
import { databasePath } from '../helpers/database.helpers.js';
export default function markOrderFormAsProcessed(orderFormId, contractId, username) {
    const database = new DatabaseSync(databasePath);
    const rightNowMillis = Date.now();
    const result = database
        .prepare(`
      UPDATE OrderForms
      SET
        recordProcess_username = ?,
        recordProcess_timeMillis = ?,
        recordProcess_contractId = ?
      WHERE
        orderFormId = ?
        AND recordProcess_timeMillis IS NULL
        AND recordDelete_timeMillis IS NULL
    `)
        .run(username, rightNowMillis, (contractId ?? '') === '' ? null : (contractId ?? ''), orderFormId);
    database.close();
    return result.changes > 0 ? rightNowMillis : undefined;
}
