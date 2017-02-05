'use strict'

const parsers = require('./parsers')
const register = require('./register')

var date = new Date();
var unixTime = Math.floor(new Date().getTime() / 1000);

var config = {
    timezone: "local"
};

const MAX_INT_32 = 2147483647;

const _setTimeout = function (fn, second) {
    if (second > MAX_INT_32) {
        console.error("Couldn't execute Function. Max allowable value for setTimeout has to be no more than 2147483648 (Int32).")
    } else {
        setTimeout(fn, second);
    }
};

const _setInterval = function (fn, sched) {
    if (!fn || !sched) {
        return false;
    }
    if (sched.hasOwnProperty('firstExec')) {
        _setTimeout(fn, sched.firstExec * 1000);
    }
    if (sched.hasOwnProperty('nextExec')) {
        _setTimeout(fn, sched.nextExec * 1000);
    }
    if (sched.hasOwnProperty('intervalInSec')) {
        var intervaledFn = function () {
            fn();
            _setTimeout(intervaledFn, sched.intervalInSec * 1000);
        };
        _setTimeout(intervaledFn, (sched.nextExec + sched.intervalInSec) * 1000);
    }
    return true;
};


exports._parseText = parsers.parseExpression;