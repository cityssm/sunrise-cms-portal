import type { Request, Response } from 'express'
import type {
  ApiResponse,
  DoMarkOrderFormAsProcessedRequest,
  DoMarkOrderFormAsProcessedResponseData
} from 'sunrise-cms-shared'

import markOrderFormAsProcessed from '../../database/markOrderFormAsProcessed.js'

export default function doMarkOrderFormAsProcessed(
  request: Request<
    unknown,
    unknown,
    DoMarkOrderFormAsProcessedRequest
  >,
  response: Response<ApiResponse<DoMarkOrderFormAsProcessedResponseData>>
): void {
  const { contractId, orderFormId, username } = request.body

  const result = markOrderFormAsProcessed(orderFormId, contractId, username)

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
      recordUpdate_timeMillis: result
    }
  })
}
