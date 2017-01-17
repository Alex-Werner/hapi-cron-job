'use strict'

const Package = require('./package')
const Joi = require('joi');

var date = new Date();
var unixTime = Math.floor(new Date().getTime() / 1000);

var config = {
    timezone: "local"
};
var getTimeData = function (timezone) {
    if (!timezone) {
        timezone = config.timezone || 'local';
    }
    var date = new Date();
    if (timezone == "local") {
        return {
            time: date.toLocaleTimeString('en-US', { hour12: false }),
            date: date.toLocaleDateString(),
            datetime: date.toLocaleString(),
            UTCEpochMS: date.getTime(),
            UTCEpoch: Math.floor(date.getTime() / 1000),
            localEpochMS: date.getTime() + (date.getTimezoneOffset() * 60000),
            localEpoch: Math.floor((date.getTime() + (date.getTimezoneOffset() * 60)) / 1000)
        }
    } else if (timezone == "GMT") {
        return {
            time: date.toISOString().substr(11, 8),
            date: date.toISOString().substr(0, 10),
            datetime: date.toISOString().substr(0, 10) + ' ' + date.toISOString().substr(11, 8),
            UTCEpochMS: date.getTime(),
            UTCEpoch: Math.floor(date.getTime() / 1000),
            localEpochMS: date.getTime(),
            localEpoch: Math.floor(date.getTime() / 1000)
        }
    } else {
        throw new Error('ISSUE ON TIMEZONE PARAMS');
    }
};

const MAX_INT_32 = 2147483647;
const PERIODS = {
    leap_year: 31622400,
    year: 31536000,
    month: 262800,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1
    
};
const TYPES = {
    //
    every: /^every\b/,
    at: /^(at|@)\b/,
    //
    second: /^(s|sec(ond)?(s)?)\b/,
    minute: /^(m|min(ute)?(s)?)\b/,
    hour: /^(h(our)?(s)?)\b/,
    day: /^(d(ay)?(s)?)\b/,
    week: /^(w(eek)?(s)?)\b/,
    //
    clockTime: /^(([0]?[1-9]|1[0-2]):[0-5]\d(\s)?(am|pm))\b/,
    fullTime: /^(([0]?\d|[1]\d|2[0-3]):([0-5]\d))\b/,
    anyNumber: /^([0-9]+)\b/,
    plain: /^((plain))\b/,
};

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


exports._parseText = _parseText;
exports.register.attributes = {
    name: Package.name,
    version: Package.version
};
