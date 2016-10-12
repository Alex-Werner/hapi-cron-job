'use strict';
const cl = console.log;
const Package = require('./package');
const Joi = require('joi');
const Later = require('later');
const moment = require('moment');

const internals = {
    jobsArrayScheme: Joi.array({
        name: Joi.string(),
        enabled: Joi.boolean(),
        schedule: Joi.string(),
        execute: Joi.func(),
        immediate: Joi.boolean().optional(),
        environments: Joi.array(Joi.string())
    }),
    optionsScheme: Joi.object({
        jobs: Joi.array().items(),
        displayEnabledJobs: Joi.boolean().optional(),
        localTime: Joi.boolean().optional()
    })
};

var date = new Date();
var _GMTDate = {
    time: date.toISOString().substr(11, 8),
    date: date.toISOString().substr(0, 10),
    datetime: date.toISOString().substr(0, 10) + ' ' + date.toISOString().substr(11, 8)
};
var _LOCALDate = {
    time: date.toLocaleTimeString(),
    date: date.toLocaleDateString(),
    datetime: date.toLocaleString()
};
var _Date = _LOCALDate;

const _parseText = function (string) {
    const TYPES = {
        //
        every: /^every\b/,
        at: /^(at|@)\b/,
        //
        second: /^(s|sec(ond)?(s)?)\b/,
        minute: /^(m|min(ute)?(s)?)\b/,
        hour: /^(h|hour(s)?)\b/,
        day: /^(d|ay(s)?)\b/,
        week: /^(w|eek(s)?)\b/,
        //
        clockTime: /^(([0]?[1-9]|1[0-2]):[0-5]\d(\s)?(am|pm))\b/,
        time: /^(([0]?\d|1\d|2[0-3]):[0-5]\d)\b/
    };

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
            intervalInSec = 86400;//Seconds in a Day

        var splitText = str.split(' ');
        if (splitText.length != 3) {
            error = 1;//Date is not valid
        } else {
            if (TYPES['every'].test(splitText[0])) {
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
                else if (TYPES['time'].test(splitText[1])) {
                    error = 4;//This is not a valid time
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
                            var s = Number(splitText[1]);
                            firstExecSecRemaining = s;
                            nextExecSecRemaining = s + firstExecSecRemaining;
                            intervalInSec = s;
                            break;
                        case 'm':
                            var m = Number(splitText[1]) * 60;
                            firstExecSecRemaining = m;
                            nextExecSecRemaining = m + firstExecSecRemaining;
                            intervalInSec = m;
                            break;
                        case 'h':
                            var h = Number(splitText[1]) * 3600;
                            firstExecSecRemaining = h;
                            nextExecSecRemaining = h + firstExecSecRemaining;
                            intervalInSec = h;
                            break;
                        case 'd':
                            var d = Number(splitText[1]) * 86400;
                            firstExecSecRemaining = d;
                            nextExecSecRemaining = d + firstExecSecRemaining;
                            intervalInSec = d;
                            break;
                        case 'w':
                            var w = Number(splitText[1]) * 604800;
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
            if (TYPES['at'].test(splitText[0])) {
                if (!TYPES['clockTime'].test(splitText[1] + ' ' + splitText[2])) {
                    error = 2;//This is a wrong time (we expected a 12 hour clock time with a am/pm ending)
                } else {
                    var time = null;
                    if (splitText[2] == "am") {
                        time = (splitText[1].length != 5) ? "0" + splitText[1] : splitText[1];
                    }
                    if (splitText[2] == "pm") {
                        var h = (Number((splitText[1]).split(':')[0]) + 12).toString();
                        var m = (splitText[1]).split(':')[1];
                        time = h + ":" + m;
                    }
                    var diff = moment(_Date.datetime);
                    var momTime = moment(_Date.date + " " + time);
                    var diffInSec = null;
                    if (diff.diff(momTime, 'second') < 0) {
                        diffInSec = Math.abs(diff.diff(momTime, 'second'));
                    } else {
                        momTime.add(1, 'day');
                        diffInSec = Math.abs(diff.diff(momTime, 'second'));
                    }
                    firstExecSecRemaining = diffInSec;
                    nextExecSecRemaining = diffInSec + 86400;
                }
            }
        }
        if(!firstExecSecRemaining || !nextExecSecRemaining || !intervalInSec || error!==0){
            console.error('There is an error in parsingExpression'+error);
            //TODO: Throw error here ?
        }
        return {
            firstExec: firstExecSecRemaining,
            nextExec: nextExecSecRemaining,
            intervalInSec: intervalInSec,
            error: error
        }
    }
    return parseExpression(string.toLowerCase());
};
const _setTimeout = function(fn, second){    
  setTimeout(fn, second);
};

const _setInterval = function (fn, sched) {
    if(!fn || !sched){
        return false;
    }
    if(sched.hasOwnProperty('firstExec')){
        _setTimeout(fn, sched.firstExec*1000);
    }
    if(sched.hasOwnProperty('nextExec')){
        _setTimeout(fn, sched.nextExec*1000);
    }
    if(sched.hasOwnProperty('intervalInSec')){
        var intervaledFn = function(){
            fn();
            _setTimeout(intervaledFn,sched.intervalInSec*1000);
        };
        _setTimeout(intervaledFn, (sched.nextExec+sched.intervalInSec)*1000);
    }    
    return true;
};

exports.register = function (server, options, next) {
    var validateOptions = internals.optionsScheme.validate(options);
    var validateJobs = internals.jobsArrayScheme.validate(options.jobs);
    if (validateOptions.error) {
        return next(validateOptions.error);
    }
    if (validateJobs.error) {
        return next(validateJobs.error);
    }
    if (options.hasOwnProperty('localTime') && options.localTime === false) {
        _Date = _GMTDate;
    }

    var enabledJobs = [];
    var len = options.jobs.length;
    while (len--) {
        var job = options.jobs[len];

        //If we enabled the job and asked it to start on our environment
        if (job.enabled && job.environments.indexOf(process.env.NODE_ENV) > -1) {
            enabledJobs.push(job);
            var textSchedule = job.schedule;
            var scheduleParsed = Later.parse.text(textSchedule);
            var scheduleParsed = (_parseText(textSchedule));
            var fnToExec = job.execute;
            _setInterval(fnToExec, scheduleParsed);
            if(job.hasOwnProperty('immediate') && job.immediate){
                _setTimeout(fnToExec,0);
            }

            if (options.hasOwnProperty('displayEnabledJobs') && options.displayEnabledJobs) {
                console.log('Enabled job:', job.name, ".\n\t Scheduled:", job.schedule, '\n\t First Exec :'+scheduleParsed.firstExec+'\n\t Next exec:' + scheduleParsed.nextExec);
            }
        }
    }
    
    return next();
};

exports.register.attributes = {
    name: Package.name,
    version: Package.version
};