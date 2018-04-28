const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;

// Setting up the logging format
const myFormat = printf(info => {
    return `${info.timestamp} [${info.label}] ${info.level}: ${info.message}`;
});

// Creating the Winston logger for the whole application
const logger = createLogger({
    format: combine(
        label({ label: 'DEBUG' }),
        timestamp(),
        myFormat
    ),
    transports: [new transports.Console()]
});

module.exports = logger;