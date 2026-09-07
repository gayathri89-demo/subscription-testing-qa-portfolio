const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    env: {
      apiUrl: 'http://127.0.0.1:3000'
    },
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