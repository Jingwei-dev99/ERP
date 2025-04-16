import winston from 'winston';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

const logFilePath = process.env.LOG_FILE_PATH || 'logs/app.log';
const logLevel = process.env.LOG_LEVEL || 'info';

const logger = winston.createLogger({
  level: logLevel,
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    new winston.transports.File({ 
      filename: path.join(process.cwd(), logFilePath),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
  ],
});

export default logger;

export class Logger {
  private context: string;

  constructor(context: string) {
    this.context = context;
  }

  info(message: string, ...args: any[]) {
    console.log(`[${this.context}] INFO:`, message, ...args);
  }

  error(message: string, ...args: any[]) {
    console.error(`[${this.context}] ERROR:`, message, ...args);
  }

  warn(message: string, ...args: any[]) {
    console.warn(`[${this.context}] WARN:`, message, ...args);
  }

  debug(message: string, ...args: any[]) {
    console.debug(`[${this.context}] DEBUG:`, message, ...args);
  }
} 