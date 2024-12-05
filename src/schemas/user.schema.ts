import { z } from 'zod';
import mongoose from 'mongoose';

const UserSchema = z.object({
  username: z.string().min(3, 'Username must be at least 3 characters').max(50, 'Username too long'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['user', 'admin', 'super-admin']).default('user'),
  permissions: z.array(z.string()).default(['read']),
  profile: z
    .string()
    .optional()
    .refine((id) => mongoose.isValidObjectId(id), {
      message: 'Invalid profile ID',
    }),
});
export type UserInput = z.infer<typeof UserSchema>;
