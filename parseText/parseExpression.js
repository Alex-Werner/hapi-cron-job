const testMultiple = (expr, testArr) => testArr.some(value => value.test(expr))

const handleError = error =>
    throw new Error('There is an error in parsingExpression, err:' + error)

const timeRanges = [
    'second',
    'minute',
    'hour',
    'day',
    'week'
]

const getTime = (range, obj) => {
  const fullTime = (new Date()).toTimeString().substr(0, 8)
  const nowSeconds = Number(fullTime.substr(6, 2))
  const modifier = range === 'minute'
    ? 0
    : Number(fullTime.substr(3, 2)) * PERIODS.minute
  return 
  const intervalInSec = PERIODS[range]
  const firstExecSecRemaining = PERIODS[range] - nowSeconds - modifier
  const nextExecSecRemaining = 2 * PERIODS[range] - nowSeconds - modifier
}

const parseExpression = str => {
  const error = 0
  
  const splitText = str.split(' ')
  const text = splitText[2]

  const intervalInit = { intervalInSec: PERIODS.day }

  const textLength = splitText.length
  
  // Date is not valid    
  if (textLength > 3 || textLength < 2) return handleError(1)
  
  if (TYPES['every'].test(splitText[0])) {
      
    if (!testMultiple(text, timeRanges.map(range => TYPES[range])))
      return handleError(1) //This is a wrong syntax
    else if (!TYPES['anyNumber'].test(splitText[1])) {
      if (TYPES['plain'].test(splitText[1])) {
        timeRanges.filter(value => value === 'minute' || value === 'hour')
          .reverse()
          .reduce((acc, value) => {
            if (TYPES[value].test(text)) {
              const fullTime = (new Date()).toTimeString().substr(0, 8)
              const nowSeconds = Number(fullTime.substr(6, 2))
              const minutes = range === 'minute'
                ? nowSeconds
                : Number(fullTime.substr(3, 2)) * PERIODS.minute - nowSeconds
              acc.intervalInSec = PERIODS[range]
              acc.firstExecSecRemaining = PERIODS[range] - minutes
              acc.nextExecSecRemaining = 2 * PERIODS[range] - minutes
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
                const time = number(splitText[1]) * PERIODS[value]
                acc.firstExecSecRemaining = time
                acc.nextExecSecRemaining = time*2 // Fix me pls
                acc.intervalInSec = time
            }
            return acc
        }, intervalInit)
    }
  }
  var handleAt = function () {
      var time = null;
      
      if (!TYPES['clockTime'].test(splitText[1] + ' ' + text)) {
          if (TYPES['fullTime'].test(splitText[1])) {
              time = splitText[1]+':'+'00';
          } else {
              error = 2;//This is a wrong time (we expected a 12 hour clock time with a am/pm ending or a 24hr clock)
              return false;
          }
      } else {
          if (text == "am") {
              time = (splitText[1].length != 5) ? "0" + splitText[1] : splitText[1];
          }
          if (text == "pm") {
              var h = (Number((splitText[1]).split(':')[0]) + 12).toString();
              var m = (splitText[1]).split(':')[1];
              time = h + ":" + m+':'+'00';
          }
      }
      if (!time) {
          error = 5; //Issue
          return false;
      }
      
      var diff = {
          s:0,
          m:0,
          h:0,
          d:0
      };
      var actualTime = getTimeData().time;
      diff.h = time.substr(0,2)-actualTime.substr(0,2);
      diff.m = time.substr(3,2)-actualTime.substr(3,2);
      diff.s = time.substr(6,2)-actualTime.substr(6,2);
      
      diff = diff.s+diff.m*PERIODS.minute+diff.h*PERIODS.hour;
      if(diff<0){
          diff = diff+PERIODS.day;
      }
      
      firstExecSecRemaining = diff;
      nextExecSecRemaining = diff + PERIODS.day;
      intervalInSec = PERIODS.day;
      
  };
  if (TYPES['at'].test(splitText[0])) {
      handleAt();
  }
      
  if (!firstExecSecRemaining || !nextExecSecRemaining || !intervalInSec || error !== 0) {
      throw new Error('There is an error in parsingExpression, err:' + error);
  }
  return {
      firstExec: firstExecSecRemaining,
      nextExec: nextExecSecRemaining,
      intervalInSec: intervalInSec,
      error: error
  }
    
}

module.exports = parseExpression