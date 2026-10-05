import { DatabaseSync } from 'node:sqlite'

import { databasePath } from '../helpers/database.helpers.js'

export default function markOrderFormAsSynced(
  orderFormId: number | string
): number | undefined {
  const database = new DatabaseSync(databasePath)

  const rightNowMillis = Date.now()

  const result = database
    .prepare(/* sql */ `
      UPDATE OrderForms
      SET
        recordSync_timeMillis = ?
      WHERE
        orderFormId = ?
        AND recordSync_timeMillis IS NULL
        AND recordDelete_timeMillis IS NULL
    `)
    .run(rightNowMillis, orderFormId)

  database.close()

  return result.changes > 0 ? rightNowMillis : undefined
}
