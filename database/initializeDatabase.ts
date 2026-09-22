import sqlite from 'better-sqlite3'
import Debug from 'debug'

import { DEBUG_NAMESPACE } from '../debug.config.js'
import { sunriseDB as databasePath } from '../helpers/database.helpers.js'

const debug = Debug(`${DEBUG_NAMESPACE}:database:initializeDatabase`)

const sqlCreateStatements = [
  /* sql */ `
    CREATE TABLE IF NOT EXISTS OrderForms (
      orderFormId INTEGER PRIMARY KEY AUTOINCREMENT,
      orderFormKey CHAR(10) NOT NULL UNIQUE,
      orderFormData TEXT NOT NULL,
      recordCreate_ipAddress VARCHAR(45) NOT NULL,
      recordCreate_timeMillis INTEGER NOT NULL,
      recordProcess_username VARCHAR(30),
      recordProcess_timeMillis INTEGER,
      recordProcess_contractId INTEGER,
      recordDelete_username VARCHAR(30),
      recordDelete_timeMillis INTEGER
    )
  `
]

// eslint-disable-next-line unicorn/consistent-boolean-name
export function initializeDatabase(
  connectedDatabase?: sqlite.Database
): boolean {
  const sunriseDB = connectedDatabase ?? sqlite(databasePath)

  sunriseDB.pragma('journal_mode = WAL')

  const row = sunriseDB
    .prepare(/* sql */ `
      SELECT
        name
      FROM
        sqlite_master
      WHERE
        type = 'table'
        AND name = 'OrderForms'
    `)
    .get()

  if (row !== undefined) {
    return false
  }

  debug(`Creating ${databasePath} tables...`)

  for (const sql of sqlCreateStatements) {
    sunriseDB.prepare(sql).run()
  }

  debug(`Finished creating tables in ${databasePath}`)

  if (connectedDatabase === undefined) {
    sunriseDB.close()
  }

  return true
}
