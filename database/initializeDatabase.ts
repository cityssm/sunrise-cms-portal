/* eslint-disable @typescript-eslint/no-magic-numbers, max-lines */

import sqlite from 'better-sqlite3'
import Debug from 'debug'

import { DEBUG_NAMESPACE } from '../debug.config.js'
import { sunriseDB as databasePath } from '../helpers/database.helpers.js'

const debug = Debug(`${DEBUG_NAMESPACE}:database:initializeDatabase`)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const recordColumns = /* sql */ `
  recordCreate_username VARCHAR(30) NOT NULL,
  recordCreate_timeMillis INTEGER NOT NULL,
  recordUpdate_username VARCHAR(30) NOT NULL,
  recordUpdate_timeMillis INTEGER NOT NULL,
  recordDelete_username VARCHAR(30),
  recordDelete_timeMillis INTEGER
`

const sqlCreateStatements = []

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
        AND name = 'AuditLog'
    `)
    .get()

  if (row !== undefined) {
    return false
  }

  debug(`Creating ${databasePath} tables...`)

  // eslint-disable-next-line sonarjs/no-empty-collection
  for (const sql of sqlCreateStatements) {
    sunriseDB.prepare(sql).run()
  }

  debug(`Finished creating tables in ${databasePath}`)

  if (connectedDatabase === undefined) {
    sunriseDB.close()
  }

  return true
}
