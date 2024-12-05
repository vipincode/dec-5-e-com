import { Response } from 'express';
import { Error as MongooseError } from 'mongoose';
import { ZodError } from 'zod';

// Define a consistent error response structure

interface ErrorResponse {
  message: string;
  code: string;
  details?: unknown;
  name?: string;
}

export class AppError extends Error {
  constructor(public message: string, public statusCode: number = 500, public code: string = 'INTERNAL_SERVER_ERROR') {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public details?: unknown) {
    super(message, 400, 'VALIDATION_ERROR');
  }
}

export class DuplicateError extends AppError {
  constructor(message: string) {
    super(message, 400, 'DUPLICATE_ERROR');
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super(message, 404, 'NOT_FOUND');
  }
}

export const handleError = (error: unknown, res: Response): void => {
  console.error('Error:', error);

  let appError: AppError;

  switch (true) {
    case error instanceof MongooseError:
      appError = handleMongooseError(error as MongooseError);
      break;
    case error instanceof ZodError:
      appError = new ValidationError('Validation failed', (error as ZodError).errors);
      break;
    case error instanceof AppError:
      appError = error;
      break;
    default:
      appError = new AppError('An unexpected error occurred');
  }

  const errorResponse: ErrorResponse = {
    name: appError.name,
    message: appError.message,
    code: appError.code,
    ...(appError instanceof ValidationError && appError.details ? { details: appError.details } : {}),
  };

  res.status(appError.statusCode).json(errorResponse);
};

const handleMongooseError = (error: MongooseError): AppError => {
  if ('code' in error && error.code === 11000) {
    return new DuplicateError('Duplicate key error');
  }
  if (error.name === 'ValidationError') {
    const details = Object.values((error as any).errors).map((e: any) => ({
      path: e.path,
      message: e.message,
    }));
    return new ValidationError('Validation failed', details);
  }
  return new AppError(error.message);
};
