const log4j = require('log4js');
log4j.configure({
    appenders: { logger: { type: 'file', filename: 'log.log' },
                 errorlogger: { type: 'file', filename: 'errorlog.log' } },
    categories: { default: { appenders: ['logger','errorlogger'], level: 'info' } }
  });

module.exports = log4j;