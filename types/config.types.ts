export interface Config {
  application: ConfigApp

  /**
   * Reverse Proxy Configuration
   */
  reverseProxy: {
    /**
     * Disable Compression
     */
    disableCompression?: boolean

    /**
     * Disable ETag
     */
    disableEtag?: boolean

    /**
     * Disable Rate Limiting
     */
    disableRateLimit?: boolean

    /**
     * Is traffic forwarded by a reverse proxy
     */
    trafficIsForwarded?: boolean

    /**
     * URL Prefix, should start with a slash, but have no trailing slash
     */
    urlPrefix?: string
  }

  api: {
    httpPort: number

    apiKey: string

    ipAllowList: '*' | string[]
  }

  features?: {
    orderForm?: {
      isEnabled?: boolean

      hasDashboardLink?: boolean

      route?: string
    }
  }
}

interface ConfigApp {
  applicationName?: string
  httpPort?: number

  /**
   * The base, public facing URL of the application, including the protocol (http or https), and any URL prefixes
   */
  appUrl?: string

  backgroundUrl?: string
  logoUrl?: string

  /**
   * The maximum number of concurrent processes
   */
  maximumProcesses?: number
}
