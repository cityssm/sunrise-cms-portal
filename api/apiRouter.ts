import { Router } from 'express'
import { type ApiSuccessResponse, doDataSyncEndpoint } from 'sunrise-cms-shared'

import doDataSyncHandler from './handlers/doDataSync.js'

export default function getDashboardRouter(): Router {
  const router = Router()

  router.get('/', (request, response) => {
    response.send({
      success: true,

      ip: request.ip ?? '',

      data: undefined
    } satisfies ApiSuccessResponse<undefined>)
  })
  .post(`/${doDataSyncEndpoint}`, doDataSyncHandler)

  return router
}
