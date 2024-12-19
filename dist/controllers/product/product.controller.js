"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFeaturedProduct = exports.getProductCount = exports.deleteProduct = exports.updateProduct = exports.getProduct = exports.getAllProduct = exports.createProduct = void 0;
const category_model_1 = __importDefault(require("@models/category.model"));
const product_model_1 = __importDefault(require("@models/product.model"));
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productData = req.body;
    const category = yield category_model_1.default.findById(productData.category);
    if (!category) {
        res.status(400).json('Invalid Category!');
        return;
    }
    // Check if the file was uploaded
    const file = req.file;
    if (!file) {
        res.status(400).json({ message: 'Image is required!' });
        return;
    }
    const product = new product_model_1.default({
        name: productData.name,
        description: productData.description,
        richDescription: productData.richDescription,
        image: file.path.replace(/\\/g, '/'), // Normalize file path for different OS
        brand: productData.brand,
        price: productData.price,
        category: productData.category,
        countInStock: productData.countInStock,
        rating: productData.rating,
        numReviews: productData.numReviews,
        isFeatured: productData.isFeatured,
    });
    yield product.save();
    if (!product) {
        res.status(400).send('Product cannot be created!');
    }
    res.status(201).send({ data: product });
});
exports.createProduct = createProduct;
const getAllProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // http://localhost:5000/api/v1/product?categories=123,466,787
    let filter = {}; // if no category id pass it show all data
    if (typeof req.query.categories === 'string') {
        filter = { category: req.query.categories.split(',') };
    }
    const productList = yield product_model_1.default.find(filter).populate('category');
    if (!productList) {
        res.status(500).json({ success: false });
    }
    res.send({ data: productList });
});
exports.getAllProduct = getAllProduct;
const getProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield product_model_1.default.findById(req.params.id).populate('category');
    if (!product) {
        res.status(500).json({ message: 'No product available with this Id.' });
    }
    res.send({ data: product });
});
exports.getProduct = getProduct;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productData = req.body;
    const category = yield category_model_1.default.findById(productData.category);
    if (!category) {
        res.status(400).json('Invalid Category!');
    }
    const product = yield product_model_1.default.findByIdAndUpdate(req.params.id, {
        name: productData.name,
        description: productData.description,
        richDescription: productData.richDescription,
        image: productData.image,
        brand: productData.brand,
        price: productData.price,
        category: productData.category,
        countInStock: productData.countInStock,
        rating: productData.rating,
        numReviews: productData.numReviews,
        isFeatured: productData.isFeatured,
    }, {
        new: true,
    });
    if (!product) {
        res.status(400).send('Product cannot be updated!');
    }
    res.status(201).send({ data: product });
});
exports.updateProduct = updateProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const product = yield product_model_1.default.findByIdAndDelete(req.params.id);
    if (!product) {
        res.status(500).send({ success: false });
    }
    res.send({ message: 'Product deleted!' });
});
exports.deleteProduct = deleteProduct;
const getProductCount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const productCount = yield product_model_1.default.countDocuments({});
    if (!productCount) {
        res.status(500).json({ success: false });
    }
    res.send({
        productCount: productCount,
    });
});
exports.getProductCount = getProductCount;
const getFeaturedProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const count = req.params.count ? req.params.count : 0;
    const products = yield product_model_1.default.find({ isFeatured: true }).limit(+count);
    if (!products) {
        res.status(500).json({ success: false });
    }
    res.send({
        products: products,
    });
});
exports.getFeaturedProduct = getFeaturedProduct;
