import fs from 'node:fs'

import type { Request, Response } from 'express'
import type {
  ApiResponse,
  DoDataSyncRequest,
  DoDataSyncResponseData
} from 'sunrise-cms-shared'

import { dataJsonPath } from '../../helpers/data.helpers.js'

export default function doDataSyncHandler(
  request: Request<unknown, unknown, DoDataSyncRequest>,
  response: Response<ApiResponse<DoDataSyncResponseData>>
): void {
  const data = request.body

  try {
    fs.writeFileSync(dataJsonPath, JSON.stringify(data, undefined, 2))

    response.send({
      success: true,

      ip: request.ip ?? '',

      data
    })
  } catch {
    response.status(500).send({
      success: false,
      error: 'Failed to write data',
      ip: request.ip ?? ''
    })
  }
}
