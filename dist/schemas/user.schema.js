"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = zod_1.z.object({
    username: zod_1.z.string().min(3, 'Username must be at least 3 characters').max(50, 'Username too long'),
    password: zod_1.z.string().min(6, 'Password must be at least 6 characters'),
    role: zod_1.z.enum(['user', 'admin', 'super-admin']).default('user'),
    permissions: zod_1.z.array(zod_1.z.string()).default(['read']),
    profile: zod_1.z
        .string()
        .optional()
        .refine((id) => mongoose_1.default.isValidObjectId(id), {
        message: 'Invalid profile ID',
    }),
});
