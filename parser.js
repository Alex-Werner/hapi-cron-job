const {TYPES, PERIODS} = require('./constants.js');
const parser = {
    parseText: function (string) {
        function testMultiple(expr, testArr) {
            for (var i = 0; i < testArr.length; i++) {
                if (testArr[i].test(expr)) {
                    return true;
                }
            }
        }
        
        function parseExpression(str) {
            var error = 0;
            var firstExecSecRemaining = null,
                nextExecSecRemaining = null,
                intervalInSec = PERIODS.day;//Seconds in a Day
            
            var splitText = str.split(' ');
            if (splitText.length > 3 || splitText.length < 2) {
                error = 1;//Date is not valid
            } else {
                if (TYPES['every'].test(splitText[0])) {
                    // cl(TYPES['clockTime'].test(splitText[1]));
                    
                    if (!testMultiple(splitText[2],
                            [
                                TYPES['second'],
                                TYPES['minute'],
                                TYPES['hour'],
                                TYPES['day'],
                                TYPES['week']
                            ])) {
                        error = 3;//This is a wrong syntax
                    }
                    else if (!TYPES['anyNumber'].test(splitText[1])) {
                        if (TYPES['plain'].test(splitText[1])) {
                            var DETERMINED_TYPE = undefined;
                            if (TYPES['minute'].test(splitText[2])) DETERMINED_TYPE = 'm';
                            if (TYPES['hour'].test(splitText[2])) DETERMINED_TYPE = 'h';
                            if (TYPES['day'].test(splitText[2])) DETERMINED_TYPE = 'd';
                            
                            var now, fullTime, nowSeconds, nowMinute, nowHour;
                            switch (DETERMINED_TYPE) {
                                case 'm':
                                    var m = PERIODS.minute;
                                    now = new Date();
                                    fullTime = now.toTimeString().substr(0, 8);
                                    nowSeconds = Number(fullTime.substr(6, 2));
                                    firstExecSecRemaining = (PERIODS.minute - nowSeconds);//Get the diff between now and our period
                                    nextExecSecRemaining = ((2 * PERIODS.minute) - nowSeconds);
                                    intervalInSec = m;
                                    break;
                                case 'h':
                                    var h = PERIODS.hour;
                                    now = new Date();
                                    fullTime = now.toTimeString().substr(0, 8);
                                    nowSeconds = Number(fullTime.substr(6, 2));
                                    nowMinute = Number(fullTime.substr(3, 2));
                                    nowHour = Number(fullTime.substr(0, 2));
                                    
                                    firstExecSecRemaining = (PERIODS.hour - (nowMinute * PERIODS.minute)) - (nowSeconds);//Get the diff between now and our period
                                    nextExecSecRemaining = (2 * PERIODS.hour - (nowMinute * PERIODS.minute)) - (nowSeconds);
                                    intervalInSec = h;
                                    break;
                                default:
                                    throw Error("Duh, that's an error in testing types allowed");
                                    break;
                                
                            }
                        } else {
                            error = 4;//This is not a valid number
                        }
                    }
                    else {
                        var DETERMINED_TYPE = undefined;
                        if (TYPES['second'].test(splitText[2])) DETERMINED_TYPE = 's';
                        if (TYPES['minute'].test(splitText[2])) DETERMINED_TYPE = 'm';
                        if (TYPES['hour'].test(splitText[2])) DETERMINED_TYPE = 'h';
                        if (TYPES['day'].test(splitText[2])) DETERMINED_TYPE = 'd';
                        if (TYPES['week'].test(splitText[2])) DETERMINED_TYPE = 'w';
                        
                        switch (DETERMINED_TYPE) {
                            case 's':
                                var s = Number(splitText[1]) * PERIODS.second;
                                firstExecSecRemaining = s;
                                nextExecSecRemaining = s + firstExecSecRemaining;
                                intervalInSec = s;
                                break;
                            case 'm':
                                var m = Number(splitText[1]) * PERIODS.minute;
                                firstExecSecRemaining = m;
                                nextExecSecRemaining = m + firstExecSecRemaining;
                                intervalInSec = m;
                                break;
                            case 'h':
                                var h = Number(splitText[1]) * PERIODS.hour;
                                firstExecSecRemaining = h;
                                nextExecSecRemaining = h + firstExecSecRemaining;
                                intervalInSec = h;
                                break;
                            case 'd':
                                var d = Number(splitText[1]) * PERIODS.day;
                                firstExecSecRemaining = d;
                                nextExecSecRemaining = d + firstExecSecRemaining;
                                intervalInSec = d;
                                break;
                            case 'w':
                                var w = Number(splitText[1]) * PERIODS.week;
                                firstExecSecRemaining = w;
                                nextExecSecRemaining = w + firstExecSecRemaining;
                                intervalInSec = w;
                                break;
                            default:
                                throw Error("Duh, that's an error in testing types allowed");
                                break;
                            
                        }
                    }
                }
                var handleAt = function () {
                    var time = null;
                    
                    if (!TYPES['clockTime'].test(splitText[1] + ' ' + splitText[2])) {
                        if (TYPES['fullTime'].test(splitText[1])) {
                            time = splitText[1] + ':' + '00';
                        } else {
                            error = 2;//This is a wrong time (we expected a 12 hour clock time with a am/pm ending or a 24hr clock)
                            return false;
                        }
                    } else {
                        if (splitText[2] == "am") {
                            time = (splitText[1].length != 5) ? "0" + splitText[1] : splitText[1];
                        }
                        if (splitText[2] == "pm") {
                            var h = (Number((splitText[1]).split(':')[0]) + 12).toString();
                            var m = (splitText[1]).split(':')[1];
                            time = h + ":" + m + ':' + '00';
                        }
                    }
                    if (!time) {
                        error = 5; //Issue
                        return false;
                    }
                    
                    var diff = {
                        s: 0,
                        m: 0,
                        h: 0,
                        d: 0
                    };
                    var actualTime = require('./timeData')().time;
                    console.log("=>", actualTime);
                    diff.h = time.substr(0, 2) - actualTime.substr(0, 2);
                    diff.m = time.substr(3, 2) - actualTime.substr(3, 2);
                    diff.s = time.substr(6, 2) - actualTime.substr(6, 2);
                    
                    diff = diff.s + diff.m * PERIODS.minute + diff.h * PERIODS.hour;
                    if (diff < 0) {
                        diff = diff + PERIODS.day;
                    }
                    
                    firstExecSecRemaining = diff;
                    nextExecSecRemaining = diff + PERIODS.day;
                    intervalInSec = PERIODS.day;
                    
                };
                if (TYPES['at'].test(splitText[0])) {
                    handleAt();
                }
                
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
        return parseExpression(string.toLowerCase());
    }
};

module.exports = {
    parseText: parser.parseText
};