var os = require('os');

//Require the server network interface to be named "eth0"
//Already by default on linux, but windows network need to be renamed to eth0 (In network windows, just press F2 to rename).
var getServerIP = function(_family){
    var family = (_family)?_family:"IPv4";
    var network = null; var i =0;
    //First try to find a eth on (from 1 to 10)
    while(!network && i<10){
        network = os.networkInterfaces()["eth"+i];
        i++;
    }
    if(!network){
        //If not found, try to find wlan
        i = 0;
        while(!network && i<10){
            network = os.networkInterfaces()["wlan"+i];
            i++;
        }
    }
    //If still not found, then we select first item in network
    if(!network){
        var netIter = os.networkInterfaces();
        network = netIter[Object.keys(netIter)[0]];
    }
    
    var iter = network.filter(function (iter) {
        return iter.family == family;
    })[0];
    var serverIP = iter.address;
    return serverIP;

};
module.exports = {
    getServerIP:getServerIP
};
