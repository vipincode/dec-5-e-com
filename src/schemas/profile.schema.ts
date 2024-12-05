import mongoose from 'mongoose';
import { z } from 'zod';

export const profileSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  email: z.string().email('Invalid email address'),
  age: z.number().min(18, 'Age must be a positive number'),
  user: z.string().refine((id) => mongoose.isValidObjectId(id), {
    message: 'Invalid user ID',
  }),
});

export type ProfileInput = z.infer<typeof profileSchema>;
