import { DatabaseSync } from 'node:sqlite'

import { databasePath } from '../helpers/database.helpers.js'

export default function deleteOrderForm(
  orderFormId: number | string,
  username: string
): number | undefined {
  const database = new DatabaseSync(databasePath)

  const rightNowMillis = Date.now()

  const result = database
    .prepare(/* sql */ `
      UPDATE OrderForms
      SET
        recordDelete_username = ?,
        recordDelete_timeMillis = ?
      WHERE
        orderFormId = ?
        AND recordDelete_timeMillis IS NULL
    `)
    .run(username, rightNowMillis, orderFormId)

  database.close()

  return result.changes > 0 ? rightNowMillis : undefined
}
