export const configDefaultValues = {
  'application.applicationName': 'Sunrise CMS Portal',
  'application.appUrl': undefined as string | undefined,
  'application.backgroundUrl': '/images/cemetery-background.jpg',
  'application.httpPort': 9001,
  'application.logoUrl': '/images/sunrise-cms.svg',
  'application.maximumProcesses': 4,

  'reverseProxy.disableCompression': false,
  'reverseProxy.disableEtag': false,
  'reverseProxy.disableRateLimit': false,
  'reverseProxy.trafficIsForwarded': false,
  'reverseProxy.urlPrefix': '',

  'api.apiKey': '',
  'api.httpPort': 9002,
  'api.ipAllowList': [] as '*' | string[],

  'features.orderForm.hasDashboardLink': true,
  'features.orderForm.isEnabled': false,
  'features.orderForm.route': 'orderForm',

  'features.orderForm.defaultCity': '',
  'features.orderForm.defaultProvince': '',
}

export default configDefaultValues
