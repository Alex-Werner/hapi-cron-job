const handleError = error => {
    throw new Error('There is an error in parsingExpression, err:' + error)
}

module.exports = handleError