const nothing = str => str

const painter = {
  dim: nothing,
  red: nothing,
  white: nothing,
  blue: nothing,
  green: nothing,
  yellow: nothing,
  magenta: nothing,
  cyan: nothing,
}

// If chalk is available, then use it
try { module.exports = require('chalk') } catch (e) {}

// module.exports = require('chalk')