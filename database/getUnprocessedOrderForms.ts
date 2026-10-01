import { DatabaseSync } from 'node:sqlite'

import type { UnprocessedOrderForm } from 'sunrise-cms-shared/api/doGetUnprocessedOrderForms.endpoint.js'

import { databasePath } from '../helpers/database.helpers.js'

export default function getUnprocessedOrderForms(): UnprocessedOrderForm[] {
  const database = new DatabaseSync(databasePath)

  const rawUnprocessedOrderForms = database
    .prepare(/* sql */ `
      SELECT
        orderFormId,
        orderFormKey,
        orderFormData AS orderFormDataString,
        recordCreate_ipAddress,
        recordCreate_timeMillis
      FROM
        OrderForms
      WHERE
        recordSync_timeMillis IS NULL
        AND recordDelete_timeMillis IS NULL
    `)
    .all() as unknown as Array<
    Omit<UnprocessedOrderForm, 'orderFormData'> & {
      orderFormDataString: string
    }
  >

  database.close()

  return rawUnprocessedOrderForms.map(({ orderFormDataString, ...rest }) => ({
    ...rest,

    orderFormData: JSON.parse(orderFormDataString) as Record<string, string>
  }))
}
