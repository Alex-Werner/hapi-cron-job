var cl = console.log;
var Hapi = require('hapi');//Server Framework for Node.js
var Routes = require('./routes.js');
var osHelper = require('./helpers/osHelper.js');
var moment = require('moment');

var httpV4Server = new Hapi.Server();
httpV4Server.connection({
    host: osHelper.getServerIP(),
    port: 80,
    routes: {
        cors: true//Set to true to allow to be joined from web client
    }
});

var Server = httpV4Server;

/*
 * We want to have some cron job
 */
var enabledCallback = function (job, scheduleParsed) {
    console.log('Enabled:', job.name, "\n\t Scheduled:", job.schedule, '\n\t First Exec :' + scheduleParsed.firstExec + '\n\t Second exec:' + scheduleParsed.nextExec, '\n\t Then every:'+scheduleParsed.intervalInSec,'\n');
};

Server.register([{
        register: require('../'),//Replace with require('hapi-cron-job')
        options: {
            localTime: true,//Default is true, set False to GMT time TODO: default should be GTM time, and we allow to specify a timezone offset
            jobs: [
                {
                    name: "Backup",
                    enabled: false,
                    enabledCallback: enabledCallback,
                    schedule: "every 1 hour",
                    execute: require('./cron-jobs/backup.js').execute,
                    environments: ['development', 'staging']
                },
                {
                    name: "diplay time",
                    enabled: true,
                    enabledCallback: enabledCallback,
                    immediate: true,
                    schedule: "every 1 s",
                    execute: require('./cron-jobs/displayTime.js').execute,
                    // environments: ['development', 'staging']
                },
                {
                    name: "diplay text",
                    enabled: true,
                    enabledCallback: enabledCallback,
                    immediate: true,//Ask to an immediate execution of the fn
                    schedule: "at 3:48 am",
                    execute: require('./cron-jobs/displayText.js').execute,
                    // environments: ['development']
                },
                {
                    name: "diplay foo minutely",
                    enabled: true,
                    enabledCallback: enabledCallback,
                    schedule: "every plain min",
                    execute: function () {
                        var nowFormated = moment().format('YYYY-MM-DD HH:mm:ss');
                        console.log(nowFormated + '-> stuff')
                    },
                    // environments:['development','staging']
                },
                {
                    name: "diplay stuff hourly",
                    enabled: true,
                    enabledCallback: enabledCallback,
                    schedule: "every plain hour",
                    execute: function () {
                        var nowFormated = moment().format('YYYY-MM-DD HH:mm:ss');
                        console.log(nowFormated + '-> stuff')
                    },
                    // environments:['development','staging']
                }
            ],
            callback: function (enabledJobs) {
                console.log(moment().format('YYYY-MM-DD HH:mm:ss'));
                console.log('Enabled Jobs', enabledJobs);
            }
        }
    }], (err)=> {
        if (err) {
            console.error('Bad plugin implementation');
            throw err;
        }
        Server.route(Routes.endpoints);
        Server.start(function (err) {
            if (err) {
                if (err.code == "EADDRINUSE" || err.code == "EACCES") {
                    console.error(err); //As we handle this, we won't throw the error, so we might want to log it
                    closeServer();
                }
                throw err;//Hapi will handle this (by displaying it)
            }
            cl('Started', Server.info.id, 'on', Server.info.protocol + '://' + Server.info.host + ':' + Server.info.port, 'Environment:' + process.env.NODE_ENV);
        });
    }
);

var closeServer = function () {
    console.log('Good bye');
    //Here I usually handle closing connection to database, doing stuff, send an email etc... 
    process.exit(0);
};
process.on('SIGINT', function () {
    closeServer();
});