const handleAt = require('./handleAt')
const handleError = require('./handleError')
const stringTest = require('./stringTest')
const periods = require('../helpers/periods')
const types = require('../helpers/types')

const testMultiple = (expr, testArr) => testArr.some(value => value.test(expr))

const timeRanges = [
    'second',
    'minute',
    'hour',
    'day',
    'week'
]

const parseExpression = str => {
    str = str.toLowerCase()
  const splitText = str.split(' ')
  const text = splitText[2]
  const splitedSchedule = splitText[1]

  const intervalInit = { intervalInSec: periods.day }

  const textLength = splitText.length
  
  // Date is not valid    
  if (textLength > 3 || textLength < 2) return handleError(1)
  
  if (types['every'].test(splitText[0])) {
      
    if (!testMultiple(text, timeRanges.map(range => types[range])))
      return handleError(1) //This is a wrong syntax
    else if (!types['anyNumber'].test(splitedSchedule)) {
      if (types['plain'].test(splitedSchedule)) {
        timeRanges.filter(value => value === 'minute' || value === 'hour')
          .reverse()
          .reduce((acc, value) => {
            if (types[value].test(text)) {
              const fullTime = (new Date()).toTimeString().substr(0, 8)
              const nowSeconds = Number(fullTime.substr(6, 2))
              const minutes = value === 'minute'
                ? nowSeconds
                : Number(fullTime.substr(3, 2)) * periods.minute - nowSeconds
              acc.intervalInSec = periods[value]
              acc.firstExecSecRemaining = periods[value] - minutes
              acc.nextExecSecRemaining = 2 * periods[value] - minutes
            }
            return acc
          }, intervalInit)

          if (!intervalInit.firstExecSecRemaining)
            throw Error("Duh, that's an error in testing types allowed")

      } else {
        return handleError(4) //This is not a valid number
      }
    }
    else {
        timeRanges.reverse().reduce((acc, value) => {
            if (types[value].test(text)) {
                const time = Number(splitText[1]) * periods[value]
                acc.firstExecSecRemaining = time
                acc.nextExecSecRemaining = time*2 // Fix me pls
                acc.intervalInSec = time
            }
            return acc
        }, intervalInit)
    }
  }
    console.log(splitedSchedule);
  return stringTest('at', splitText[0])
    ? handleAt(splitedSchedule, text)
    : {
      firstExec: intervalInit.firstExecSecRemaining,
      nextExec: intervalInit.nextExecSecRemaining,
      intervalInSec: intervalInit.intervalInSec,
  }
    
}

module.exports = parseExpression