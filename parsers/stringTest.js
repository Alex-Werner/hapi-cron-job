const types = require('../helpers/types')
const stringTest = (type, string) => types[type].test(string)

module.exports = stringTest
