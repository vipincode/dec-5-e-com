"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const product_controller_1 = require("@controllers/product/product.controller");
const router = (0, express_1.Router)();
router.post('/product', product_controller_1.createProduct);
router.get('/product', product_controller_1.getAllProduct);
router.get('/product/count', product_controller_1.getProductCount);
router.get('/product/featured/:count', product_controller_1.getFeaturedProduct);
router.get('/product/:id', product_controller_1.getProduct);
router.put('/product/:id', product_controller_1.updateProduct);
router.delete('/product/:id', product_controller_1.deleteProduct);
// use like this to prevent route conflict with /:id
// router.get('/product/get/count', getProductCount);
exports.default = router;
