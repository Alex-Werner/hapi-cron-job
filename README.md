# hapi-cron-job

![cron_jobs](https://cloud.githubusercontent.com/assets/5849920/19414322/1f99f12c-9349-11e6-923a-bbe2f0683d10.jpg)

## Overview

hapi-cron-job, is a plugin for hapi that will allows you to execute cron job at a specified time (eg: every 2 hour, at 8:00 pm, every monday at 11:00 am, every first day of the month).

## Installation
Using npm:

    npm install hapi-cron-job
    
## How to:  
[See pratical example](https://github.com/Alex-Werner/hapi-cron-job/tree/master/example)

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
    
* ```localTime```: (default: true, optional), If false, use GMT Zone(UTC Time) instead of local server time (local Zone)
* ```callback```: (optional), A callback function that will be executed at the end of the import process, {return: enabledJobs(Array)}

## Allowed schedule
 
You can specify any schedule format that look like : 

- at : can be 
    * ```at 01:00 pm```, ```01:00 am```, ```1:00am``` etc... (will be called daily at specified time).
    * ```at 15:00```
- every : can be :
    * ```every 1 hour```, ```every 1 hours```, ```every 1 h```. (Works with seconds, minutes, hours, days)
    * ```every plain hour```, ```every plain minutes```. (Works with min, hours)

Mind that every X PERIOD, is absolute, if you started your server at 10:44 pm and set to every 1 h, it will be executed at 11:44pm, 0:44am and so on...  
You can have your cron executed at the next plain hour and every next hour then.  
  
Use ```every plain hour``` for that. (eg:If started at 3:46, next exec will be 4:00 then 5:00...)  
Same can be done with minutes with ```every plain minute``` (eg: Started at 3:46, next exec will be 3:50,4:00,..)  

    
## Definitions 

- Period : ```s```, ```m```, ```h```, ```d```, ```seconds```, ```second```, ....
- Number : ```1```, ```2```, ...
- Times : ```8:00 pm```, ```08:00 pm```
- Ordinal Number : ```first```, ```second```, ```thenth```,...

## Next : 

- Handle leap year
- Handle daylight saving time (so, notice that we actually don't handle this)
- Parse : ``` after NUMBER PERIOD```
- Parse : ``` every DAYS at TIMES```
- Parse : ``` every PERIOD on the ORDINALNUMBER PERIOD of the PERIOD``` 
eg : ```every minutes on the first day of the month```
- Parse : ```every ORDINALNUMBER PERIOD of PERIOD```   
eg: ```every first day of the month```  
- ~~Handle 24-hour times (at 01:00 will be 01:00am, at 16:00 will be 4:00pm) : ~~ DONE
- Handle days
- handle months
- Handle years

## About you 

If this can help even one person, I would be hapi enough (see what I did here ? :D).   
I will work on that project till I will be confident enought that it will answer perfectly to the need to at least one person.  
If you are that person, please, do not hesitate to : 

- submit any [issues](https://github.com/Alex-Werner/hapi-cron-job/issues),
- raises any [questions](https://github.com/Alex-Werner/hapi-cron-job/issues),
- submit any [PR](https://github.com/Alex-Werner/hapi-cron-job/pulls)
- or anything else (critism, stuff that need to be improved).


You could also drop me a word on twitter : [@obusco](https://twitter.com/obusco).  

I would like to have any feedback that you use it, may be even for what and how I could help improving this package to fit your needs.  

## About stuff

* **Limitations** :  
1) About max_time : For now (till I get smart and find a way to handle that), you can't plan something over 68 years.   
I was stuck at 24 days initially (INT 32 limit on setTimeout), but I excess that limit by forcing me to work in seconds instead of milliseconds. 
I will, probably, I think, may be, move that limit away.  
But for now, if you want to code an IA that plan to nuke the world in 69 years. Mind about setting up to 67/68 years instead.  

## Versioning  

Releases will be numbered with the following format (semver):

`<major>.<minor>.<patch>`

The reason we doing that, is that, far from marketing or stuff. You will know easily if a breaking change occurs by
just looking the first number. Mind that some major version (breaking changes) can be absolutely necessary (bugfix). 
But at least it won't break your code  

## Inspired by 
 - [Later](http://bunkat.github.io/later/)