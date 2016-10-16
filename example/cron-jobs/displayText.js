var moment = require('moment');
var displayText = {
    execute: function () {
        console.log(moment().format('YYYY-MM-DD HH:mm:ss')+" This is a text");
    } 
};
module.exports = displayText;