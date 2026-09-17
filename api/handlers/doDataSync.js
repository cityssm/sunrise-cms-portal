import fs from 'node:fs';
import { dataJsonPath } from '../../helpers/data.helpers.js';
export default function doDataSyncHandler(request, response) {
    const data = request.body;
    try {
        fs.writeFileSync(dataJsonPath, JSON.stringify(data, undefined, 2));
        response.send({
            success: true,
            ip: request.ip ?? '',
            data
        });
    }
    catch {
        response.status(500).send({
            success: false,
            error: 'Failed to write data',
            ip: request.ip ?? ''
        });
    }
}
