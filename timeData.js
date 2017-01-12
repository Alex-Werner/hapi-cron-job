const timeData = function (timezone='local') {
    const date = new Date();
    const UTCEpochMS = date.getTime();
    
    if (timezone == "local") {
        const localEpochMS = UTCEpochMS + (date.getTimezoneOffset() * 60);
        return {
            time: date.toLocaleTimeString('en-US', { hour12: false }),
            date: date.toLocaleDateString(),
            datetime: date.toLocaleString(),
            UTCEpochMS,
            UTCEpoch: Math.floor(UTCEpochMS / 1000),
            localEpochMS,
            localEpoch: Math.floor(localEpochMS/ 1000)
        }
    }
    if (timezone == "GMT") {
        const dateISOStr = date.toISOString();
        const UTCEpoch = Math.floor(UTCEpochMS / 1000);
        return {
            time: dateISOStr.substr(11, 8),
            date: dateISOStr.substr(0, 10),
            datetime: dateISOStr.substr(0, 10) + ' ' + dateISOStr.substr(11, 8),
            UTCEpochMS,
            UTCEpoch,
            localEpochMS: UTCEpochMS,
            localEpoch: UTCEpoch
        }
    }
    throw new Error('ISSUE ON TIMEZONE PARAMS');
};
module.exports = timeData;