const handleAt = require('./handleAt')
const handleError = require('./handleError')
const stringTest = require('./stringTest')
const PERIODS = require('../PERIODS')
const TYPES = require('../TYPES')

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

  const intervalInit = { intervalInSec: PERIODS.day }

  const textLength = splitText.length
  
  // Date is not valid    
  if (textLength > 3 || textLength < 2) return handleError(1)
  
  if (TYPES['every'].test(splitText[0])) {
      
    if (!testMultiple(text, timeRanges.map(range => TYPES[range])))
      return handleError(1) //This is a wrong syntax
    else if (!TYPES['anyNumber'].test(splitedSchedule)) {
      if (TYPES['plain'].test(splitedSchedule)) {
        timeRanges.filter(value => value === 'minute' || value === 'hour')
          .reverse()
          .reduce((acc, value) => {
            if (TYPES[value].test(text)) {
              const fullTime = (new Date()).toTimeString().substr(0, 8)
              const nowSeconds = Number(fullTime.substr(6, 2))
              const minutes = value === 'minute'
                ? nowSeconds
                : Number(fullTime.substr(3, 2)) * PERIODS.minute - nowSeconds
              acc.intervalInSec = PERIODS[value]
              acc.firstExecSecRemaining = PERIODS[value] - minutes
              acc.nextExecSecRemaining = 2 * PERIODS[value] - minutes
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
            if (TYPES[value].test(text)) {
                const time = Number(splitText[1]) * PERIODS[value]
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