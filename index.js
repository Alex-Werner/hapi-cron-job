'use strict';
const Package = require('./package');
const Joi = require('joi');
const {parseText} = require('./parser.js');
const {MAX_INT_32} = require('./constants.js');

const internals = {
    jobsArrayScheme: Joi.array({
        name: Joi.string(),
        enabled: Joi.boolean(),
        schedule: Joi.string(),
        execute: Joi.func(),
        enabledCallback: Joi.func().optional(),
        immediate: Joi.boolean().optional(),
        environments: Joi.array(Joi.string()).optional()
    }),
    optionsScheme: Joi.object({
        jobs: Joi.array().items(),
        localTime: Joi.boolean().optional(),
        callback: Joi.func().optional()
    })
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
        config.timezone = "GMT";
    }
    
    var enabledJobs = [];
    var len = options.jobs.length;
    while (len--) {
        var job = options.jobs[len];
        //If we enabled the job
        if (job.enabled) {
            //If we ask to start on our environment, but we aren't in this env, skip it
            if (job.environments && job.environments.indexOf(process.env.NODE_ENV) == -1) {
                console.error(job.name + " has been skipped as env asked are", job.environments, 'and actual process.env.NODE_ENV is', process.env.NODE_ENV + '.');
                continue;
            }
            enabledJobs.push(job);
            var textSchedule = job.schedule;
            var scheduleParsed = (parseText(textSchedule));
            if (scheduleParsed && scheduleParsed.firstExec && scheduleParsed.nextExec && scheduleParsed.intervalInSec) {
                var fnToExec = job.execute;
                _setInterval(fnToExec, scheduleParsed);
                
                //We want this to be before immediate execute
                if (job.hasOwnProperty('enabledCallback')) {
                    job.enabledCallback(job, scheduleParsed);
                }
                if (job.hasOwnProperty('immediate') && job.immediate) {
                    _setTimeout(fnToExec, 0);
                }
                
            } else {
                var debugErr = {
                    message: "Issue on parseText",
                    isScheduleParsed: !!scheduleParsed,
                    isFirstExec: !!scheduleParsed.firstExec,
                    isNextExec: !!scheduleParsed.nextExec,
                    isIntervalInSec: !!scheduleParsed.intervalInSec
                };
                console.error(debugErr);
            }
        }
    }
    if (options.hasOwnProperty('callback')) {
        options.callback(enabledJobs);
    }
    return next();
};

exports.register.attributes = {
    name: Package.name,
    version: Package.version
};
