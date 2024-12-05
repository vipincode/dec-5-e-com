import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';
import { handleError } from '../utils/error-handlers';

export const validate = (schema: AnyZodObject) => async (req: Request, res: Response, next: NextFunction) => {
  try {
    await schema.parseAsync(req.body);
    next();
  } catch (error) {
    handleError(error, res);
  }
};
