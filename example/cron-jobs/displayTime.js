var moment = require('moment');

var displayTime = {
    execute: function () {
        console.log(moment().format('YYYY-MM-DD HH:mm:ss'));
    }
};
module.exports = displayTime;