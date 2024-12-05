"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const productModel = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    richDescription: {
        type: String,
        default: '',
    },
    image: {
        type: String,
        default: '',
    },
    images: [
        {
            type: String,
        },
    ],
    brand: {
        type: String,
        default: '',
    },
    price: {
        type: Number,
        default: 0,
    },
    category: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Category',
        required: true,
    },
    countInStock: {
        type: Number,
        required: true,
        min: 0,
        max: 255,
    },
    rating: {
        type: Number,
        default: 0,
    },
    numReviews: {
        type: Number,
        default: 0,
    },
    isFeatured: {
        type: Boolean,
        default: false,
    },
    dateCreated: {
        type: Date,
        default: Date.now,
    },
});
productModel.virtual('id').get(function () {
    return this._id.toHexString();
});
productModel.set('toJSON', {
    virtuals: true,
});
const Product = mongoose_1.default.model('Product', productModel);
exports.default = Product;
