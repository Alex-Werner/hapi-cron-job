const parseExpression = require('./parseExpression')

const parseText = string => parseExpression(string.toLowerCase())

module.exports = parseText