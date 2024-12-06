"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.profileSchema = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const zod_1 = require("zod");
exports.profileSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, 'Name is required').max(100, 'Name is too long'),
    email: zod_1.z.string().email('Invalid email address'),
    age: zod_1.z.number().min(18, 'Age must be a positive number'),
    user: zod_1.z.string().refine((id) => mongoose_1.default.isValidObjectId(id), {
        message: 'Invalid user ID',
    }),
});
