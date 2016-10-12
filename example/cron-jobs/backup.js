var moment = require('moment');

var BackupJob = {
    performWindowsBackup: function () {
        return true;
    },
    performLinuxBackup: function () {
        // var shellFile =   
        //   const exec = require('child_process').exec;
        //   exec(shellFile, function(err, stdout, stderr){
        //       if(err){
        //           console.log(stderr);
        //           console.error(err);
        //           return false;
        //       }
        //       console.log(stdout);
        //       return true;
        //   });
        return true;
    },
    performBackup: function () {
        var isWin = /^win/.test(process.platform);
        return (isWin) ? BackupJob.performWindowsBackup() : BackupJob.performLinuxBackup();
    },
    execute: function () {
        var performedBackup = BackupJob.performBackup();
        if (performedBackup) {
            console.log('EXECUTED backup @ ' + moment().format('YYYY-MM-DD HH:mm:ss'));
        } else {
            console.log('FAILED : backup @ ' + moment().format('YYYY-MM-DD HH:mm:ss'));
        }
    }
};
module.exports = BackupJob;