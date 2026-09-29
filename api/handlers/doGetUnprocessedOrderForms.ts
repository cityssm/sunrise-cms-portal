import type { Request, Response } from 'express'
import type {
  ApiResponse,
  DoGetUnprocessedOrderFormsResponseData
} from 'sunrise-cms-shared'

import getUnprocessedOrderForms from '../../database/getUnprocessedOrderForms.js'

export default function doGetUnprocessedOrderForms(
  request: Request,
  response: Response<ApiResponse<DoGetUnprocessedOrderFormsResponseData>>
): void {
  const unprocessedOrderForms = getUnprocessedOrderForms()

  response.json({
    success: true,

    ip: request.ip ?? '',

    data: {
      orderForms: unprocessedOrderForms
    }
  })
}
