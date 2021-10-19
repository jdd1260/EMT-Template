import * as winston from 'winston';

const getOptions = () => {
  // add logger configuration by environment here
  return {
    level: 'debug',
    handleExceptions: true,
    format: winston.format.cli(),
  };
};

const logger: winston.Logger = winston.createLogger({
  transports: [new winston.transports.Console(getOptions())],
  exitOnError: false, // do not exit on handled exceptions
});

logger.on('finish', () => {
  // eslint-disable-next-line no-console
  console.log('logger done');
});

export class LoggerStream {
  write = (message: string): void => {
    logger.info(message.substring(0, message.lastIndexOf('\n')));
  };
}

export default logger;
