"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const order_controller_1 = require("@controllers/order/order.controller");
const router = (0, express_1.Router)();
router.post('/order', order_controller_1.createOrder);
router.get('/order', order_controller_1.getAllOrder);
router.get('/order/:id', order_controller_1.getOrder);
router.put('/order/:id', order_controller_1.updateOrder);
router.delete('/order/:id', order_controller_1.deleteOrder);
// Sales
router.get('/order/get/total-sales', order_controller_1.getTotalSales);
router.get('/order/get/count', order_controller_1.orderCount);
router.get('/order/get/user-order/:userid', order_controller_1.userOrder);
exports.default = router;
