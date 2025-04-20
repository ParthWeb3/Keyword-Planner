const winston = require('winston');

const logger = winston.createLogger({
  transports: [
    new winston.transports.Console()
  ]
});

logger.info('Winston test successful'); 