import winston from 'winston';

export const productionLoggerConfig = {
  format: winston.format.json(),
  defaultMeta: { service: 'order-service' },
  transports: [
    new winston.transports.Console({
      format: winston.format.json(),
    }),
  ],
};

export const developmentLoggerConfig = {
  format: winston.format.combine(winston.format.timestamp(), winston.format.prettyPrint()),
  defaultMeta: { service: 'order-service' },
  transports: [new winston.transports.Console()],
};

let logger;

if (process.env.NODE_ENV == 'production') {
  logger = winston.createLogger(productionLoggerConfig);
} else {
  logger = winston.createLogger(developmentLoggerConfig);
}

export default logger;
