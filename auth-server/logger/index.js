const winston = require('winston');

const { combine, timestamp, label, printf, colorize } = winston.format;

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const logger = winston.createLogger({
  level: 'info',
  format: combine(
    label({ label: 'auth server' }),
    timestamp({ format: 'HH:mm:ss' }),
    colorize({ all: true }),  
    myFormat
  ),
  transports: [
    new winston.transports.Console(),
  ],
});

module.exports = logger;
