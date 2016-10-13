'use strict';
const Package = require('./package');
const Joi = require('joi');
const moment = require('moment');
const cl = console.log;

const internals = {
    jobsArrayScheme: Joi.array({
        name: Joi.string(),
        enabled: Joi.boolean(),
        schedule: Joi.string(),
        execute: Joi.func(),
        enabledCallback:Joi.func().optional(),
        immediate: Joi.boolean().optional(),
        environments: Joi.array(Joi.string()).optional()
    }),
    optionsScheme: Joi.object({
        jobs: Joi.array().items(),
        displayEnabledJobs: Joi.boolean().optional(),//Todo : Delete this in next major version
        localTime: Joi.boolean().optional(),
        callback:Joi.func().optional()
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
        hour: /^(h(our)?(s)?)\b/,
        day: /^(d(ay)?(s)?)\b/,
        week: /^(w(eek)?(s)?)\b/,
        //
        clockTime: /^(([0]?[1-9]|1[0-2]):[0-5]\d(\s)?(am|pm))\b/,
        fullTime: /^([0]?\d|[1]\d|2[0-3]):([0-5]\d)\b/,
        anyNumber:/^([0-9]+)\b/,
        plain:/^((plain))\b/,
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
                    if(TYPES['plain'].test(splitText[1])){
                        var DETERMINED_TYPE = undefined;
                        if (TYPES['minute'].test(splitText[2])) DETERMINED_TYPE = 'm';
                        if (TYPES['hour'].test(splitText[2])) DETERMINED_TYPE = 'h';
                        if (TYPES['day'].test(splitText[2])) DETERMINED_TYPE = 'd';
    
                        var now;
                        switch (DETERMINED_TYPE) {
                            case 'm':
                                var m = 60;
                                now = moment();
                                firstExecSecRemaining = moment().add(1,'minute').startOf('minute').diff(now, 'second');
                                nextExecSecRemaining = moment().add(2,'minute').startOf('minute').diff(now, 'second');
                                intervalInSec = m;
                                break;
                            case 'h':
                                var h = 3600;
                                now = moment();
                                firstExecSecRemaining = moment().add(1,'hour').startOf('hour').diff(now, 'second');
                                nextExecSecRemaining = moment().add(2,'hour').startOf('hour').diff(now, 'second');
                                intervalInSec = h;
                                break;
                            case 'd':
                                var d = 86400;
                                now = moment();
                                firstExecSecRemaining = moment().add(1,'day').startOf('day').diff(now, 'second');
                                nextExecSecRemaining = moment().add(2,'day').startOf('day').diff(now, 'second');
                                intervalInSec = d;
                                break;
                            default:
                                throw Error("Duh, that's an error in testing types allowed");
                                break;
        
                        }
                    }else{
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
            var handleAt=function(){
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
            };
            if (TYPES['at'].test(splitText[0])) {
                handleAt();
            }
           
        }
        if(!firstExecSecRemaining || !nextExecSecRemaining || !intervalInSec || error!==0){
            throw new Error('There is an error in parsingExpression, err:'+error);
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
        //If we enabled the job
        if (job.enabled) {
            //If we ask to start on our environment, but we aren't in this env, skip it
            if(job.environments && job.environments.indexOf(process.env.NODE_ENV) == -1){
                continue;
            }
            enabledJobs.push(job);
            var textSchedule = job.schedule;
            var scheduleParsed = (_parseText(textSchedule));
            if(scheduleParsed && scheduleParsed.firstExec && scheduleParsed.nextExec && scheduleParsed.intervalInSec){
                var fnToExec = job.execute;
                _setInterval(fnToExec, scheduleParsed);
                if(job.hasOwnProperty('immediate') && job.immediate){
                    _setTimeout(fnToExec,0);
                }
                if(job.hasOwnProperty('enabledCallback')){
                    job.enabledCallback(job, scheduleParsed);
                }


                //Todo : Delete this in next major version
                if (options.hasOwnProperty('displayEnabledJobs') && options.displayEnabledJobs) {
                    // console.log('Enabled job:', job.name, ".\n\t Scheduled:", job.schedule, '\n\t First Exec :'+scheduleParsed.firstExec+'\n\t Next exec:' + scheduleParsed.nextExec);
                }
            }else{
                var debugErr={
                    message:"Issue on parseText",
                    isScheduleParsed:!!scheduleParsed,
                    isFirstExec:!!scheduleParsed.firstExec,
                    isNextExec:!!scheduleParsed.nextExec,
                    isIntervalInSec:!!scheduleParsed.intervalInSec
                };
                console.error(debugErr);
            }
        }
    }
    if(options.hasOwnProperty('callback')){
        options.callback(enabledJobs);
    }
    return next();
};
exports._parseText = _parseText;
exports.register.attributes = {
    name: Package.name,
    version: Package.version
};