import type { Request, Response } from 'express'
import type {
  ApiResponse,
  DoMarkOrderFormAsSyncedRequest,
  DoMarkOrderFormAsSyncedResponseData
} from 'sunrise-cms-shared'

import markOrderFormAsSynced from '../../database/markOrderFormAsSynced.js'

export default function doMarkOrderFormAsSynced(
  request: Request<
    unknown,
    unknown,
    DoMarkOrderFormAsSyncedRequest
  >,
  response: Response<ApiResponse<DoMarkOrderFormAsSyncedResponseData>>
): void {
  const { orderFormId } = request.body

  const result = markOrderFormAsSynced(orderFormId)

  if (result === undefined) {
    response.status(500).send({
      success: false,

      ip: request.ip ?? '',

      error: `Order form with ID ${orderFormId} not found or already processed.`
    })

    return
  }

  response.send({
    success: true,

    ip: request.ip ?? '',

    data: {
      recordSync_timeMillis: result
    }
  })
}
