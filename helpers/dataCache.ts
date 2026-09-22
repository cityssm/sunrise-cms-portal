import fs from 'node:fs'

import chokidar, { type FSWatcher } from 'chokidar'
import Debug from 'debug'
import exitHook from 'exit-hook'
import type { DoDataSyncRequest } from 'sunrise-cms-shared'

import { DEBUG_NAMESPACE, PROCESS_ID_MAX_DIGITS } from '../debug.config.js'

import { dataJsonPath } from './data.helpers.js'

const debug = Debug(
  `${DEBUG_NAMESPACE}:dataCache:${process.pid.toString().padEnd(PROCESS_ID_MAX_DIGITS)}`
)

export default class DataCache {
  #dataJson: DoDataSyncRequest | undefined

  readonly #exitHook: () => void
  readonly #watcher: FSWatcher

  constructor() {
    this.#reloadData()

    this.#watcher = chokidar.watch(dataJsonPath)

    this.#watcher.on('change', () => {
      debug('Data JSON file changed, reloading data...')
      this.#reloadData()
    })

    this.#exitHook = exitHook(() => {
      void this.#watcher.close()
    })
  }

  getData(): DoDataSyncRequest | undefined {
    return this.#dataJson
  }

  [Symbol.dispose](): void {
    this.#exitHook()
  }

  #reloadData(): void {
    try {
      this.#dataJson = JSON.parse(
        fs.readFileSync(dataJsonPath, 'utf8')
      ) as DoDataSyncRequest
    } catch {
      this.#dataJson = undefined
    }
  }
}
