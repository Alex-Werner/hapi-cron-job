var os = require('os');

//Require the server network interface to be named "eth0"
//Already by default on linux, but windows network need to be renamed to eth0 (In network windows, just press F2 to rename).
var getServerIP = function(_family){

    var family = (_family)?_family:"IPv4";
    var eth0 = os.networkInterfaces().eth0;
    var iter = eth0.filter(function (iter) {
        return iter.family == family;
    })[0];
    var serverIP = iter.address;
    return serverIP;

};
module.exports = {
    getServerIP:getServerIP
};
