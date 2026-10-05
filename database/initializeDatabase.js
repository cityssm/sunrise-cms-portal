import { DatabaseSync } from 'node:sqlite';
import Debug from 'debug';
import { DEBUG_NAMESPACE } from '../debug.config.js';
import { databasePath } from '../helpers/database.helpers.js';
const debug = Debug(`${DEBUG_NAMESPACE}:database:initializeDatabase`);
const sqlCreateStatements = [
    `
    CREATE TABLE IF NOT EXISTS OrderForms (
      orderFormId INTEGER PRIMARY KEY AUTOINCREMENT,
      orderFormKey CHAR(10) NOT NULL UNIQUE,
      orderFormData TEXT NOT NULL,
      recordCreate_ipAddress VARCHAR(45) NOT NULL,
      recordCreate_timeMillis INTEGER NOT NULL,
      recordSync_timeMillis INTEGER,
      recordDelete_username VARCHAR(30),
      recordDelete_timeMillis INTEGER
    )
  `
];
export function initializeDatabase(connectedDatabase) {
    const sunriseDB = connectedDatabase ?? new DatabaseSync(databasePath);
    sunriseDB.exec('PRAGMA journal_mode = WAL');
    const row = sunriseDB
        .prepare(`
      SELECT
        name
      FROM
        sqlite_master
      WHERE
        type = 'table'
        AND name = 'OrderForms'
    `)
        .get();
    if (row !== undefined) {
        return false;
    }
    debug(`Creating ${databasePath} tables...`);
    for (const sql of sqlCreateStatements) {
        sunriseDB.prepare(sql).run();
    }
    debug(`Finished creating tables in ${databasePath}`);
    if (connectedDatabase === undefined) {
        sunriseDB.close();
    }
    return true;
}
