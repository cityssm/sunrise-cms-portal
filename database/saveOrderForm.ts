import crypto from 'node:crypto'

import sqlite from 'better-sqlite3'

import { sunriseDB as databasePath } from '../helpers/database.helpers.js'

function generateOrderFormKey(): string {
  const currentDate = new Date()

  return `${currentDate.getFullYear().toString().slice(-2)}${(
    currentDate.getMonth() + 1
  )
    .toString()
    .padStart(2, '0')}${crypto.randomUUID().slice(0, 6)}`
}

export default function saveOrderForm(
  orderFormData: Record<string, string>,
  requestIp: string
): string {
  const database = sqlite(databasePath)

  let orderFormKey = generateOrderFormKey()

  for (;;) {
    const existingOrderForm = database
      .prepare('SELECT 1 FROM OrderForms WHERE orderFormKey = ?')
      .get(orderFormKey)

    if (existingOrderForm === undefined) {
      break
    }

    orderFormKey = generateOrderFormKey()
  }

  database
    .prepare(/* sql */ `
      INSERT INTO
        OrderForms (
          orderFormKey,
          orderFormData,
          recordCreate_ipAddress,
          recordCreate_timeMillis
        )
      VALUES
        (?, ?, ?, ?)
    `)
    .run(orderFormKey, JSON.stringify(orderFormData), requestIp, Date.now())

  database.close()

  return orderFormKey
}
