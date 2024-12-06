"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const zod_1 = require("zod");
const order_item_schema_1 = require("./order-item.schema");
exports.orderSchema = zod_1.z.object({
    orderItems: zod_1.z.array(order_item_schema_1.orderItemSchema).min(1, 'At least one order item is required'),
    shippingAddress1: zod_1.z.string().min(1, 'Shipping Address 1 is required'),
    shippingAddress2: zod_1.z.string().optional(), // Optional field
    city: zod_1.z.string().min(1, 'City is required'),
    zip: zod_1.z.string().min(1, 'ZIP is required'),
    country: zod_1.z.string().min(1, 'Country is required'),
    phone: zod_1.z.string().min(1, 'Phone number is required'),
    status: zod_1.z.enum(['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled']).optional().default('Pending'), // Optional with default
    totalPrice: zod_1.z.number().optional(),
    user: zod_1.z.string().refine((id) => mongoose_1.default.isValidObjectId(id), {
        message: 'Invalid user ID',
    }),
});
