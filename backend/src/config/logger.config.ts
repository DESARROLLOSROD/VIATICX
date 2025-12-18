import { WinstonModuleOptions } from 'nest-winston';
import * as winston from 'winston';

/**
 * Winston Logger Configuration
 * Structured logging with different transports for development and production
 */
export const loggerConfig: WinstonModuleOptions = {
  transports: [
    // Console transport
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.errors({ stack: true }),
        winston.format.colorize({ all: true }),
        winston.format.printf(({ timestamp, level, message, context, ...meta }) => {
          let msg = `${timestamp} [${context || 'Application'}] ${level}: ${message}`;

          // Add metadata if exists
          if (Object.keys(meta).length > 0) {
            msg += ` ${JSON.stringify(meta)}`;
          }

          return msg;
        }),
      ),
    }),

    // File transport for errors
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json(),
      ),
    }),

    // File transport for all logs
    new winston.transports.File({
      filename: 'logs/combined.log',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json(),
      ),
    }),
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: 'logs/exceptions.log' }),
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: 'logs/rejections.log' }),
  ],
};

/**
 * Get log level from environment
 */
export function getLogLevel(): string {
  return process.env.LOG_LEVEL || 'info';
}

/**
 * Check if we should enable file logging
 */
export function shouldEnableFileLogging(): boolean {
  return process.env.NODE_ENV === 'production';
}
