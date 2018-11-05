const config = require('../config')

const getTimeData = timezone => {
    if (!timezone) {
        timezone = config.timezone || 'local'
    }
    const date = new Date()

    return (timezone == "GMT")
        ? {
            time: date.toISOString().substr(11, 8),
            date: date.toISOString().substr(0, 10),
            datetime: date.toISOString().substr(0, 10) + ' ' + date.toISOString().substr(11, 8),
            UTCEpochMS: date.getTime(),
            UTCEpoch: Math.floor(date.getTime() / 1000),
            localEpochMS: date.getTime(),
            localEpoch: Math.floor(date.getTime() / 1000)
        } : {
            time: date.toLocaleTimeString('en-US', { hour12: false }),
            date: date.toLocaleDateString(),
            datetime: date.toLocaleString(),
            UTCEpochMS: date.getTime(),
            UTCEpoch: Math.floor(date.getTime() / 1000),
            localEpochMS: date.getTime() + (date.getTimezoneOffset() * 60000),
            localEpoch: Math.floor((date.getTime() + (date.getTimezoneOffset() * 60)) / 1000)
        }
}

module.exports = getTimeData