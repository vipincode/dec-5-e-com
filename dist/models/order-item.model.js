"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const orderItemSchema = new mongoose_1.default.Schema({
    quantity: {
        type: Number,
        required: true,
    },
    product: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Product',
    },
});
const OrderItem = mongoose_1.default.model('OrderItem', orderItemSchema);
exports.default = OrderItem;
