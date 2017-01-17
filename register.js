const parseText = require('./parseText')

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
}

const register = (server, options, next) => {
    const validateOptions = internals.optionsScheme.validate(options)
    const validateJobs = internals.jobsArrayScheme.validate(options.jobs)

    if (validateOptions.error) {
        return next(validateOptions.error)
    }
    if (validateJobs.error) {
        return next(validateJobs.error)
    }
    if (options.hasOwnProperty('localTime') && !options.localTime) {
        config.timezone = "GMT"
    }
    
    const enabledJobs = options.jobs.reduce((acc, job) => {
        if (job.enabled) {
            const jobEnvs = job.environments
            if (jobEnvs && jobEnvs.includes(process.env.NODE_ENV)) {
                console.error(job.name + " has been skipped as env asked are",
                    job.environments,
                    'and actual process.env.NODE_ENV is',
                    process.env.NODE_ENV,
                    '.')
                return acc
            }
            acc.push(job)
            const scheduleParsed = (_parseText(job.schedule))
        }
        return acc
    }, [])
    


    let len = options.jobs.length
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
            var scheduleParsed = (_parseText(textSchedule));
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

exports.register = register 