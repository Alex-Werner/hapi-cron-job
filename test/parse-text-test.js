var parseText = require('../index')._parseText;
var should = require('should');
var moment = require('moment');

var cl = console.log;

describe('Parse text ', function() {
    describe('Parse seconds', function(){
        it('every 1 s', function() {
            var parsed = parseText('every 1 s');
            // parsed.should.have.property('error',0);
            parsed.should.have.property('firstExec',1);
            parsed.should.have.property('nextExec',2);
            parsed.should.have.property('intervalInSec',1);
        });
        it('every 1 sec', function() {
            var parsed = parseText('every 1 sec');
            // parsed.should.have.property('error',0);
            parsed.should.have.property('firstExec',1);
            parsed.should.have.property('nextExec',2);
            parsed.should.have.property('intervalInSec',1);
        });
        it('every 1 second', function() {
            var parsed = parseText('every 1 second');
            // parsed.should.have.property('error',0);
            parsed.should.have.property('firstExec',1);
            parsed.should.have.property('nextExec',2);
            parsed.should.have.property('intervalInSec',1);
        });
        it('every 1 seconds', function() {
            var parsed = parseText('every 1 seconds');
            // parsed.should.have.property('error',0);
            parsed.should.have.property('firstExec',1);
            parsed.should.have.property('nextExec',2);
            parsed.should.have.property('intervalInSec',1);
        });
        it('every 99 seconds', function() {
            var parsed = parseText('every 99 seconds');
            // parsed.should.have.property('error',0);
            parsed.should.have.property('firstExec',99);
            parsed.should.have.property('nextExec',198);
            parsed.should.have.property('intervalInSec',99);
        });
    });
    describe('Parse minutes', function(){
        it('every 1 m', function() {
            var parsed = parseText('every 1 m');
            // parsed.should.have.property('error',0);
            parsed.should.have.property('firstExec',60);
            parsed.should.have.property('nextExec',120);
            parsed.should.have.property('intervalInSec',60);
        });
        it('every 1 min', function() {
            var parsed = parseText('every 1 min');
            // parsed.should.have.property('error',0);
            parsed.should.have.property('firstExec',60);
            parsed.should.have.property('nextExec',120);
            parsed.should.have.property('intervalInSec',60);
        });
        it('every 1 minute', function() {
            var parsed = parseText('every 1 minute');
            // parsed.should.have.property('error',0);
            parsed.should.have.property('firstExec',60);
            parsed.should.have.property('nextExec',120);
            parsed.should.have.property('intervalInSec',60);
        });
        it('every 1 minutes', function() {
            var parsed = parseText('every 1 minutes');
            // parsed.should.have.property('error',0);
            parsed.should.have.property('firstExec',60);
            parsed.should.have.property('nextExec',120);
            parsed.should.have.property('intervalInSec',60);
        });
        it('every 99 minutes', function() {
            var parsed = parseText('every 99 minutes');
            // parsed.should.have.property('error',0);
            parsed.should.have.property('firstExec',5940);
            parsed.should.have.property('nextExec',11880);
            parsed.should.have.property('intervalInSec',5940);
        });
    });
    describe('Parse hours', function(){
        it('every 1 h', function() {
            var parsed = parseText('every 1 h');
            // parsed.should.have.property('error',0);
            parsed.should.have.property('firstExec',3600);
            parsed.should.have.property('nextExec',7200);
            parsed.should.have.property('intervalInSec',3600);
        });
        it('every 1 hour', function() {
            var parsed = parseText('every 1 hour');
            // parsed.should.have.property('error',0);
            parsed.should.have.property('firstExec',3600);
            parsed.should.have.property('nextExec',7200);
            parsed.should.have.property('intervalInSec',3600);
        });
        it('every 1 hours', function() {
            var parsed = parseText('every 1 hours');
            // parsed.should.have.property('error',0);
            parsed.should.have.property('firstExec',3600);
            parsed.should.have.property('nextExec',7200);
            parsed.should.have.property('intervalInSec',3600);
        });
        
        it('every 99 hours', function() {
            var parsed = parseText('every 99 hours');
            // parsed.should.have.property('error',0);
            parsed.should.have.property('firstExec',356400);
            parsed.should.have.property('nextExec',712800);
            parsed.should.have.property('intervalInSec',356400);
        });
    });
    describe('Parse days', function(){
        it('every 1 d', function() {
            var parsed = parseText('every 1 d');
            // parsed.should.have.property('error',0);
            parsed.should.have.property('firstExec',86400);
            parsed.should.have.property('nextExec',172800);
            parsed.should.have.property('intervalInSec',86400);
        });
        it('every 1 day', function() {
            var parsed = parseText('every 1 day');
            // parsed.should.have.property('error',0);
            parsed.should.have.property('firstExec',86400);
            parsed.should.have.property('nextExec',172800);
            parsed.should.have.property('intervalInSec',86400);
        });
        it('every 1 days', function() {
            var parsed = parseText('every 1 days');
            // parsed.should.have.property('error',0);
            parsed.should.have.property('firstExec',86400);
            parsed.should.have.property('nextExec',172800);
            parsed.should.have.property('intervalInSec',86400);
        });

        it('every 99 days', function() {
            var parsed = parseText('every 99 days');
            // parsed.should.have.property('error',0);
            parsed.should.have.property('firstExec',8553600);
            parsed.should.have.property('nextExec',17107200);
            parsed.should.have.property('intervalInSec',8553600);
        });
    });
    describe('Parse weeks', function(){
        it('every 1 w', function() {
            var parsed = parseText('every 1 w');
            // parsed.should.have.property('error',0);
            parsed.should.have.property('firstExec',604800);
            parsed.should.have.property('nextExec',1209600);
            parsed.should.have.property('intervalInSec',604800);
        });
        it('every 1 week', function() {
            var parsed = parseText('every 1 week');
            // parsed.should.have.property('error',0);
            parsed.should.have.property('firstExec',604800);
            parsed.should.have.property('nextExec',1209600);
            parsed.should.have.property('intervalInSec',604800);
        });
        it('every 1 weeks', function() {
            var parsed = parseText('every 1 weeks');
            // parsed.should.have.property('error',0);
            parsed.should.have.property('firstExec',604800);
            parsed.should.have.property('nextExec',1209600);
            parsed.should.have.property('intervalInSec',604800);
        });

        it('every 99 weeks', function() {
            var parsed = parseText('every 99 weeks');
            // parsed.should.have.property('error',0);
            parsed.should.have.property('firstExec',59875200);
            parsed.should.have.property('nextExec',119750400);
            parsed.should.have.property('intervalInSec',59875200);
        });
    });
    describe('Parse at pm', function(){
        it('at 1:05 am', function() {
            var parsed = parseText('at 1:05 am');
            var now = moment();
            var firstExec = moment(now.format("YYYY-MM-DD")+" 01:05 AM");
            var nextExec = moment(now.format("YYYY-MM-DD")+" 01:05 AM").add(1,'day');
    
            if(firstExec.unix()-now.unix()<0){
                firstExec = moment(now.format("YYYY-MM-DD")+" 01:05 AM").add(1,'day');
                nextExec = moment(now.format("YYYY-MM-DD")+" 01:05 AM").add(2,'day');
            }
            // parsed.should.have.property('error',0);
            parsed.should.have.property('firstExec',firstExec.diff(now,'second'));
            parsed.should.have.property('nextExec',nextExec.diff(now,'second'));
            parsed.should.have.property('intervalInSec',86400);
        });
        it('at 02:55 am', function() {
            var parsed = parseText('at 02:55 am');
            var now = moment();
            var firstExec = moment(now.format("YYYY-MM-DD")+" 02:55 AM");
            var nextExec = moment(now.format("YYYY-MM-DD")+" 02:55 AM").add(1,'day');
            // parsed.should.have.property('error',0);
            parsed.should.have.property('firstExec',firstExec.diff(now,'second'));
            parsed.should.have.property('nextExec',nextExec.diff(now,'second'));
            parsed.should.have.property('intervalInSec',86400);
        });
        it('at 3:32 pm', function() {
            var parsed = parseText('at 3:32 am');
            var now = moment();
            var firstExec = moment(now.format("YYYY-MM-DD")+" 03:32 AM");
            var nextExec = moment(now.format("YYYY-MM-DD")+" 03:32 AM").add(1,'day');
            // parsed.should.have.property('error',0);
            parsed.should.have.property('firstExec',firstExec.diff(now,'second'));
            parsed.should.have.property('nextExec',nextExec.diff(now,'second'));
            parsed.should.have.property('intervalInSec',86400);
        });
        it('at 04:49 pm', function() {
            var parsed = parseText('at 04:49 am');
            var now = moment();
            var firstExec = moment(now.format("YYYY-MM-DD")+" 04:49 AM");
            var nextExec = moment(now.format("YYYY-MM-DD")+" 04:49 AM").add(1,'day');
            // parsed.should.have.property('error',0);
            parsed.should.have.property('firstExec',firstExec.diff(now,'second'));
            parsed.should.have.property('nextExec',nextExec.diff(now,'second'));
            parsed.should.have.property('intervalInSec',86400);
        });
    });
    describe('Parse plain text', function(){
        it('every plain min', function() {
            var parsed = parseText('every plain min');
            var now = moment();
            var firstExec = moment().add(1,'minute').startOf('minute');
            var nextExec = moment().add(2,'minute').startOf('minute');
            // parsed.should.have.property('error',0);
            parsed.should.have.property('firstExec',firstExec.diff(now,'second'));
            parsed.should.have.property('nextExec',nextExec.diff(now,'second'));
            parsed.should.have.property('intervalInSec',60);
        });
        it('every plain hour', function() {
            var parsed = parseText('every plain hour');
            var now = moment();
            var firstExec = moment().add(1,'hour').startOf('hour');
            var nextExec = moment().add(2,'hour').startOf('hour');
            // parsed.should.have.property('error',0);
            parsed.should.have.property('firstExec',firstExec.diff(now,'second'));
            parsed.should.have.property('nextExec',nextExec.diff(now,'second'));
            parsed.should.have.property('intervalInSec',3600);
        });
    });
});