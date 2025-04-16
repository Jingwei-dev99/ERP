import { DatabaseError as PgDatabaseError } from 'pg';
import { Logger } from './logger';

/**
 * Base error class for application errors
 */
export class AppError extends Error {
  constructor(
    public message: string,
    public readonly statusCode: number = 500,
    public code?: string
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error class for database-related errors
 */
export class DatabaseError extends AppError {
  constructor(message: string) {
    super(message, 500);
    this.name = 'DatabaseError';
  }
}

/**
 * Error class for validation errors
 */
export class ValidationError extends AppError {
  constructor(message: string) {
    super(message, 400);
    this.name = 'ValidationError';
  }
}

/**
 * Error class for not found errors
 */
export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404);
    this.name = 'NotFoundError';
  }
}

/**
 * Type guard for PostgreSQL errors
 */
interface PostgresError extends Error {
  code: string;
}

export function isPostgresError(error: unknown): error is PostgresError {
  return error instanceof Error && 'code' in error;
}

export class AuthenticationError extends AppError {
  constructor(message: string) {
    super(message, 401);
    this.name = 'AuthenticationError';
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string) {
    super(message, 403);
    this.name = 'AuthorizationError';
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, 409, 'CONFLICT_ERROR');
    this.name = 'ConflictError';
    Object.setPrototypeOf(this, ConflictError.prototype);
  }
}

export class RateLimitError extends AppError {
  constructor(message: string) {
    super(message, 429, 'RATE_LIMIT_ERROR');
    this.name = 'RateLimitError';
    Object.setPrototypeOf(this, RateLimitError.prototype);
  }
}

// PostgreSQL error codes
export const PG_ERROR_CODES = {
  UNIQUE_VIOLATION: '23505',
  FOREIGN_KEY_VIOLATION: '23503',
  NOT_NULL_VIOLATION: '23502',
  CHECK_VIOLATION: '23514',
} as const;

// Helper function to get a user-friendly error message based on PostgreSQL error code
export function getDbErrorMessage(error: PgDatabaseError): string {
  switch (error.code) {
    case PG_ERROR_CODES.UNIQUE_VIOLATION:
      return 'A record with this unique identifier already exists';
    case PG_ERROR_CODES.FOREIGN_KEY_VIOLATION:
      return 'Referenced record does not exist';
    case PG_ERROR_CODES.NOT_NULL_VIOLATION:
      return 'Required field is missing';
    case PG_ERROR_CODES.CHECK_VIOLATION:
      return 'Value violates check constraint';
    default:
      return 'An unexpected database error occurred';
  }
}

// Helper function to wrap database operations with error handling
export async function withErrorHandling<T>(
  logger: Logger,
  operationName: string,
  operation: () => Promise<T>
): Promise<T> {
  try {
    return await operation();
  } catch (error: unknown) {
    logger.error(`${operationName}:`, error);

    if (error instanceof AppError) {
      throw error;
    }

    if (isPostgresError(error)) {
      switch (error.code) {
        case PG_ERROR_CODES.UNIQUE_VIOLATION:
          throw new ValidationError('Duplicate entry');
        case PG_ERROR_CODES.FOREIGN_KEY_VIOLATION:
          throw new ValidationError('Referenced record not found');
        case PG_ERROR_CODES.NOT_NULL_VIOLATION:
          throw new ValidationError('Required field missing');
        default:
          throw new DatabaseError(`Database error: ${error.message}`);
      }
    }

    const message = error instanceof Error ? error.message : 'An unknown error occurred';
    throw new AppError(message);
  }
} 