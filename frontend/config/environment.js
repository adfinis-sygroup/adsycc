/* eslint-env node */
'use strict'

module.exports = function(environment) {
  let ENV = {
    modulePrefix: 'adsycc',
    environment,
    rootURL: '/',
    locationType: 'auto',
    EmberENV: {
      FEATURES: {
        // Here you can enable experimental features on an ember canary build
        // e.g. 'with-controller': true
      },
      EXTEND_PROTOTYPES: {
        // Prevent Ember Data from overriding Date.parse.
        Date: false
      }
    },
    contentSecurityPolicy: {
      'style-src': "'self' 'unsafe-inline'"
    },

    APP: {
      // Here you can pass flags/options to your application instance
      // when it is created
      rt: {
        host: 'rt.sygroup.ch',
        mail: 'support@adfinis-sygroup.ch'
      },
      // Services : redmine, mon, sysupport, wiki, rt, vault
      enabledServices: ['vault', 'subscription']
    },

    i18n: {
      defaultLocale: 'en'
    }
  }

  if (environment === 'development') {
    // ENV.APP.LOG_RESOLVER = true;
    // ENV.APP.LOG_ACTIVE_GENERATION = true;
    // ENV.APP.LOG_TRANSITIONS = true;
    // ENV.APP.LOG_TRANSITIONS_INTERNAL = true;
    // ENV.APP.LOG_VIEW_LOOKUPS = true;
  }

  if (environment === 'test') {
    // Testem prefers this...
    ENV.baseURL = '/'
    ENV.locationType = 'none'

    // keep test console output quieter
    ENV.APP.LOG_ACTIVE_GENERATION = false
    ENV.APP.LOG_VIEW_LOOKUPS = false

    ENV.APP.rootElement = '#ember-testing'
  }

  if (environment === 'production') {
  }

  return ENV
}
