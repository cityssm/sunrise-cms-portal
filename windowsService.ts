import path from 'node:path'

import type { ServiceConfig } from 'node-windows'

const _dirname = '.'

export const serviceConfig: ServiceConfig = {
  name: 'Sunrise CMS Portal',

  description:
    'A portal for funeral homes and the general public to interface with the Sunrise CMS (Cemetery Management System).',

  script: path.join(_dirname, 'index.js')
}
