import mongoose from 'mongoose';
import { z } from 'zod';
import { orderItemSchema } from './order-item.schema';

export const orderSchema = z.object({
  orderItems: z.array(orderItemSchema).min(1, 'At least one order item is required'),
  shippingAddress1: z.string().min(1, 'Shipping Address 1 is required'),
  shippingAddress2: z.string().optional(), // Optional field
  city: z.string().min(1, 'City is required'),
  zip: z.string().min(1, 'ZIP is required'),
  country: z.string().min(1, 'Country is required'),
  phone: z.string().min(1, 'Phone number is required'),
  status: z.enum(['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']).optional().default('Pending'), // Optional with default
  totalPrice: z.number().optional(),
  user: z.string().refine((id) => mongoose.isValidObjectId(id), {
    message: 'Invalid user ID',
  }),
});

// TypeScript type from the Zod schema
export type OrderData = z.infer<typeof orderSchema>;
