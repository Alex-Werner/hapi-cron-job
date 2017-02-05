const TYPES = require('../TYPES')
const stringTest = (type, string) => TYPES[type].test(string)

module.exports = stringTest
