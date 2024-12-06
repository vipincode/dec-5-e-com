"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.orderItemSchema = void 0;
const zod_1 = require("zod");
const mongoose_1 = __importDefault(require("mongoose"));
exports.orderItemSchema = zod_1.z.object({
    quantity: zod_1.z.number().int().positive('Quantity must be a positive integer').min(1, 'Quantity must be at least 1'),
    product: zod_1.z.string().refine((id) => mongoose_1.default.isValidObjectId(id), {
        message: 'Invalid product ID',
    }),
});
