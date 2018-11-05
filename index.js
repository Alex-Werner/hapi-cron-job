const parsers = require('./parsers/parseExpression');
const register = require('./register');
const Package = require('./package');

exports.plugin = {
    register: register,
    name: Package.name,
    version: Package.version
}

exports._parseText = parsers;