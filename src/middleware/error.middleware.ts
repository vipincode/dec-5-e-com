import { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
  status?: number;
  message: string;
  name: string;
}

// Error handler middleware
export const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);

  // Default error response
  const status = err.status || 500;
  const errName = err.name || 'Error';
  const message = err.message || 'Something went wrong!';

  // Send a descriptive error response to the user
  res.status(status).json({ name: errName, error: message });
};
