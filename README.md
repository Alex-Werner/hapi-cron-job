# hapi-cron-job

## Current State

V 1.2.0

Please, do not hesitate to submit any [issues](https://github.com/Alex-Werner/hapi-cron-job/issues), raises any [questions](https://github.com/Alex-Werner/hapi-cron-job/issues), submit any [PR](https://github.com/Alex-Werner/hapi-cron-job/pulls) or anything else (critism, stuff that need to be improved).

## Overview

hapi-cron-job, is a plugin for hapi to do cron job at a specified time (eg: every 2 hour, at 8:00 pm)

## Installation
Using npm:

    npm install hapi-cron-job
    
## How to:  
[See example](https://github.com/Alex-Werner/hapi-cron-job/tree/master/example)

```
var displayTime = function(){
    var ymd = new Date().toISOString().slice(0,new Date().toISOString().indexOf("T"));
    var hms = new Date().toISOString().substr(11, 8);
    console.log(ymd+" "+hms);
};
var callback = function(enabledJobs){
    //Do something with enabledJobs
}
var enabledCallback = function(job, scheduleParsed){
    //Do something with job and scheduleParsed
}
Server.register({
    register:require('hapi-cron-job'),
    options:{
        jobs:[
             {
                name:"diplay time",
                enabled:true,
                enabledCallback:enabledCallback,//Executed at end of import of the job, just before immediate Callback
                immediate:true,//Will execute function on starting
                schedule:"every 1 s",
                execute:displayTime,
                environments:['development','staging']//using env (process.env.NODE_ENV)
             }
        ],
        callback:callback//Executed at end of process and return enabledJobs
    }
},function(err){
     if(err){throw err;}
 });
```

## Options 

* ```jobs``` : An array of jobs
    * ```name```: (String) Name of your cron job
    * ```enabled```: (Bool) Do we want to enable our cron job
    * ```enabledCallback```: (Function, optional) Function to execute at end of import of the job, before call (if immediate is true)
    * ```schedule```: (String) See allowed Schedule, example or use.
    * ```execute```: (Function) Function to execute at schedule
    * ```immediate```: (Bool, optional, default:false)
    * ```environments```:(Array(String), optional) Use process.env.NODE_ENV to set your environments. If no environments set consider as active.
    
* ```localTime```: (default: true, optional), If false, use GMT instead of local server time
* ```callback```: (optional), A callback function that will be executed at the end of the import process, {return: enabledJobs(Array)}

## Allowed schedule
 
You can specify any schedule format that look like : 

- every : can be :
    * ```every 1 hour```, ```every 1 hours```, ```every 1 h```. (Works with seconds, minutes, hours, days)
    * ```every plain hour```, ```every plain minutes```. (Works with min, hours, days)

Mind that every X PERIOD, is absolute, if you started your server at 10:44 pm and set to 1 h, it will be executed at 11:44pm, 0:44am and so on...
If you need to be executed at a plain hour/min/day, use ```every plain hour```

- at : can be ```at 01:00 pm```, ```01:00 am```, ```1:00am``` etc... (will be called daily at specified time).
    
## Definitions 

- Period : ```s```, ```m```, ```h```, ```d```, ```seconds```, ```second```, ....
- Number : ```1```, ```2```, ...
- Times : ```8:00 pm```, ```08:00 pm```
- Ordinal Number : ```first```, ```second```, ```thenth```,...

## Next : 

- Parse : ``` after NUMBER PERIOD```
- Parse : ``` every DAYS at TIMES```

- Parse : ``` every PERIOD on the ORDINALNUMBER PERIOD of the PERIOD``` 
eg : ```every minutes on the first day of the month```
- Parse : ```every ORDINALNUMBER PERIOD of PERIOD```   
eg: ```every first day of the month```
- Handle 24-hour times
- Handle days
- handle months
- Handle years

## Versioning

Releases will be numbered with the following format:

`<major>.<minor>.<patch>`

## Inspired by 
 - [Later](http://bunkat.github.io/later/)