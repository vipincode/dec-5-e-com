import { z } from 'zod';
import mongoose from 'mongoose';

export const orderItemSchema = z.object({
  quantity: z.number().int().positive('Quantity must be a positive integer').min(1, 'Quantity must be at least 1'),
  product: z.string().refine((id) => mongoose.isValidObjectId(id), {
    message: 'Invalid product ID',
  }),
});

// TypeScript type inference
export type OrderItemData = z.infer<typeof orderItemSchema>;
