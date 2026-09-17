import fs from 'node:fs';
import chokidar from 'chokidar';
import Debug from 'debug';
import exitHook from 'exit-hook';
import { DEBUG_NAMESPACE, PROCESS_ID_MAX_DIGITS } from '../debug.config.js';
import { dataJsonPath } from './data.helpers.js';
const debug = Debug(`${DEBUG_NAMESPACE}:dataCache:${process.pid.toString().padEnd(PROCESS_ID_MAX_DIGITS)}`);
export default class DataCache {
    #dataJson;
    #exitHook;
    #watcher;
    constructor() {
        this.#reloadData();
        this.#watcher = chokidar.watch(dataJsonPath);
        this.#watcher.on('change', () => {
            debug('Data JSON file changed, reloading data...');
            this.#reloadData();
        });
        this.#exitHook = exitHook(() => {
            void this.#watcher.close();
        });
    }
    getData() {
        return this.#dataJson;
    }
    [Symbol.dispose]() {
        this.#exitHook();
    }
    #reloadData() {
        try {
            this.#dataJson = JSON.parse(fs.readFileSync(dataJsonPath, 'utf8'));
        }
        catch {
            this.#dataJson = undefined;
        }
    }
}
