import { Router } from 'express'

import handler_orderForm from '../handlers/orderFormGet/orderForm.js'
import handler_doSubmitOrderForm from '../handlers/orderFormPost/doSubmitOrderForm.js'

export default function getOrderFormRouter(): Router {
  const router = Router()

  router
    .get('/', handler_orderForm)
    .post('/doSubmitOrderForm', handler_doSubmitOrderForm)

  return router
}
