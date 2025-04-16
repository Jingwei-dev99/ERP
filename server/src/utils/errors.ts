import { DatabaseError as PgDatabaseError } from 'pg';
import { Logger } from './logger';

/**
 * Base error class for application errors
 */
export class BaseError extends Error {
  code: string;
  status: number;

  constructor(message: string, code: string = 'INTERNAL_ERROR', status: number = 500) {
    super(message);
    this.code = code;
    this.status = status;
    Object.setPrototypeOf(this, BaseError.prototype);
  }
}

/**
 * Error class for database-related errors
 */
export class DatabaseError extends BaseError {
  constructor(message: string) {
    super(message, 'DATABASE_ERROR', 500);
  }
}

/**
 * Error class for validation errors
 */
export class ValidationError extends BaseError {
  constructor(message: string) {
    super(message, 'VALIDATION_ERROR', 400);
  }
}

/**
 * Error class for not found errors
 */
export class NotFoundError extends BaseError {
  constructor(message: string) {
    super(message, 'NOT_FOUND', 404);
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

/**
 * Error class for authentication errors
 */
export class AuthenticationError extends BaseError {
  constructor(message: string) {
    super(message, 'AUTHENTICATION_ERROR', 401);
  }
}

/**
 * Error class for authorization errors
 */
export class AuthorizationError extends BaseError {
  constructor(message: string) {
    super(message, 'AUTHORIZATION_ERROR', 403);
  }
}

/**
 * Error class for conflict errors
 */
export class ConflictError extends BaseError {
  constructor(message: string) {
    super(message, 'CONFLICT', 409);
  }
}

export class RateLimitError extends BaseError {
  constructor(message: string) {
    super(message, 'RATE_LIMIT_ERROR', 429);
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

    if (error instanceof BaseError) {
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
    throw new BaseError(message);
  }
} 