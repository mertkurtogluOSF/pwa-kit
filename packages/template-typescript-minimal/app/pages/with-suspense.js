if (typeof WEBPACK_TARGET !== 'undefined' && WEBPACK_TARGET === 'web') {
    module.exports = require('./with-suspense.client.js')
  } else {
    console.log('serving suspense version')
    module.exports = require('./with-suspense.server.js')
  }