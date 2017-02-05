const handleError = require('./handleError')
const stringTest = require('./stringTest')
const getTimeData = require('../getTimeData')
const PERIODS = require('../periods')


const clockTime = {
  am: (text, splitedSchedule) =>
    (splitedSchedule.length != 5) ? ("0" + splitedSchedule) : splitedSchedule,
  pm: (text, splitedSchedule) =>
    (Number((splitedSchedule).split(':')[0]) + 12).toString()
    + ":"
    + (splitedSchedule).split(':')[1]
    + ':00'
}

const setTime = splitedSchedule => stringTest('fullTime', splitedSchedule)
  ? (splitedSchedule + ':' + '00')
  : undefined

const handleAt = (splitedSchedule, text) => {
  const time = clockTime[text](splitedSchedule)
    || setTime(splitedSchedule)
    || handleError(2)
  
  const actualTime = getTimeData().time
  const diff = {
    s: time.substr(6,2)-actualTime.substr(6,2),
    m: time.substr(3,2)-actualTime.substr(3,2),
    h: time.substr(0,2)-actualTime.substr(0,2)
  }

  const diffSec = (calcDiff => calcDiff < 0
    ? calcDiff + PERIODS.day
    : calcDiff)(diff.s + diff.m * PERIODS.minute + diff.h * PERIODS.hour)

  return {
    firstExec: diffSec,
    nextExec: diffSec + PERIODS.day,
    intervalInSec: PERIODS.day
  }    
}

module.exports = handleAt
