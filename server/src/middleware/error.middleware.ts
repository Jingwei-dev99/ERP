import { Request, Response, NextFunction } from 'express';
import { BaseError } from '../utils/errors';
import { Logger } from '../utils/logger';

const logger = new Logger('ErrorMiddleware');

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof BaseError) {
    logger.error(`${err.name}: ${err.message}`, {
      code: err.code,
      status: err.status,
      path: req.path,
      method: req.method
    });

    res.status(err.status).json({
      error: {
        code: err.code,
        message: err.message
      }
    });
  } else {
    logger.error('Unhandled Error:', err);
    
    res.status(500).json({
      error: {
        code: 'INTERNAL_SERVER_ERROR',
        message: 'An unexpected error occurred'
      }
    });
  }
};

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  res.status(404).json({
    error: {
      code: 'NOT_FOUND',
      message: `Cannot ${req.method} ${req.path}`
    }
  });
}; 