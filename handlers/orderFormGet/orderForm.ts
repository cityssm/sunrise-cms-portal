import { relationships } from '@cityssm/cemetery-utils'
import type { Request, Response } from 'express'

import DataCache from '../../helpers/dataCache.js'

const dataCache = new DataCache()

export default function handler(request: Request, response: Response): void {
  const data = dataCache.getData()

  response.render('orderForm', {
    headTitle: 'Order Form',

    ...data,
    relationships
  })
}
