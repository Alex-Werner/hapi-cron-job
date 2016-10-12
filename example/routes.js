var PageHandler = require('./handlers/pageHandler.js');

exports.endpoints = [
    {method:'GET', path:'/', config:PageHandler.helloWorld}
];