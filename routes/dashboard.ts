import { Router } from 'express'

import handler_dashboard from '../handlers/dashboardGet/dashboard.js'

export default function getDashboardRouter(): Router {
  const router = Router()

  router.get('/', handler_dashboard)

  return router
}
