const { defineConfig } = require('cypress')

module.exports = defineConfig({
  expose: {
    apiUrl: 'http://127.0.0.1:3000'
  },

  e2e: {
    setupNodeEvents(on, config) {
      return config
    }
  },

  video: true,
  screenshotOnRunFailure: true,

  retries: {
    runMode: 1,
    openMode: 0
  }
})