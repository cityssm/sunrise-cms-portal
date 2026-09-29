import { DatabaseSync } from 'node:sqlite'

import { databasePath } from '../helpers/database.helpers.js'

export default function markOrderFormAsProcessed(
  orderFormId: number | string,
  contractId: number | string | undefined,
  username: string
): number | undefined {
  const database = new DatabaseSync(databasePath)

  const rightNowMillis = Date.now()

  const result = database
    .prepare(/* sql */ `
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
    .run(
      username,
      rightNowMillis,
      // eslint-disable-next-line unicorn/no-null
      (contractId ?? '') === '' ? null : (contractId ?? ''),
      orderFormId
    )

  database.close()

  return result.changes > 0 ? rightNowMillis : undefined
}
