import { Router } from 'express'

import handler_orderForm from '../handlers/orderFormGet/orderForm.js'

export default function getOrderFormRouter(): Router {
  const router = Router()

  router.get('/', handler_orderForm)

  return router
}
