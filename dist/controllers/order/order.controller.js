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
exports.userOrder = exports.orderCount = exports.getTotalSales = exports.deleteOrder = exports.updateOrder = exports.getOrder = exports.getAllOrder = exports.createOrder = void 0;
const error_handlers_1 = require("@utils/error-handlers");
const order_schema_1 = require("@schemas/order.schema");
const order_modal_1 = __importDefault(require("@models/order.modal"));
const order_item_model_1 = __importDefault(require("@models/order-item.model"));
const mongoose_1 = require("mongoose");
const createOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Validate incoming request data
        const orderData = order_schema_1.orderSchema.parse(req.body);
        // Create order items and collect their IDs
        const orderItemIds = yield Promise.all(orderData.orderItems.map((orderItem) => __awaiter(void 0, void 0, void 0, function* () {
            const newOrderItem = new order_item_model_1.default({
                quantity: orderItem.quantity,
                product: orderItem.product,
            });
            const savedOrderItem = yield newOrderItem.save();
            return savedOrderItem._id; // return ObjectId after saving
        })));
        // Calculate the total price for each order item
        const totalPrices = yield Promise.all(orderItemIds.map((orderItemId) => __awaiter(void 0, void 0, void 0, function* () {
            const orderItem = yield order_item_model_1.default.findById(orderItemId).populate('product', 'price');
            // Ensure orderItem and product are found
            if (!orderItem || !orderItem.product) {
                throw new error_handlers_1.AppError('Order item or product not found', 404, 'ORDER_ITEM_NOT_FOUND');
            }
            // Calculate total price for this order item
            const totalPrice = orderItem.product.price * orderItem.quantity;
            return totalPrice;
        })));
        const totalOrderPrice = totalPrices.reduce((acc, price) => acc + price, 0);
        // Create the order with the order item IDs
        const order = yield order_modal_1.default.create({
            orderItems: orderItemIds,
            shippingAddress1: orderData.shippingAddress1,
            shippingAddress2: orderData.shippingAddress2,
            city: orderData.city,
            zip: orderData.zip,
            country: orderData.country,
            phone: orderData.phone,
            status: orderData.status || 'Pending',
            totalPrice: totalOrderPrice,
            user: orderData.user,
        });
        if (!order) {
            throw new error_handlers_1.AppError('Failed to create order', 500, 'ORDER_CREATION_FAILED');
        }
        // Return the created order
        res.status(201).send({ success: true, data: order });
    }
    catch (error) {
        (0, error_handlers_1.handleError)(error, res);
    }
});
exports.createOrder = createOrder;
const getAllOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Here I want populate only user : name
        // const orderList = await Order.find().populate('user', 'name email');
        // or
        const orderList = yield order_modal_1.default.find()
            .populate({
            path: 'user',
            select: 'name email', // Include only name and email
        })
            .sort({ dateOrdered: -1 });
        // const orderList = await Order.find().populate('user');
        if (!orderList) {
            throw new error_handlers_1.NotFoundError('Product not found.');
        }
        res.status(200).send({ success: true, data: orderList });
    }
    catch (error) {
        (0, error_handlers_1.handleError)(error, res);
    }
});
exports.getAllOrder = getAllOrder;
const getOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.params;
        // Validate ObjectId
        if (!mongoose_1.Types.ObjectId.isValid(id)) {
            throw new error_handlers_1.NotFoundError('Invalid order ID.');
        }
        const order = yield order_modal_1.default.findById(id)
            .populate({
            path: 'user',
            select: 'name email',
        })
            // this is field name orderItems like - orderItems:[{product:{.., category: {...}}}]
            // so this orderItems, product & category is path, also use in populate
            .populate({ path: 'orderItems', populate: { path: 'product', populate: 'category' } });
        if (!order) {
            throw new error_handlers_1.NotFoundError('Order not found.');
        }
        res.status(200).send({ success: true, data: order });
    }
    catch (error) {
        (0, error_handlers_1.handleError)(error, res);
    }
});
exports.getOrder = getOrder;
const updateOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Check if the request body contains the required fields
        if (!req.body.status) {
            throw new error_handlers_1.ValidationError('Status are required fields.');
        }
        // Update the order
        const order = yield order_modal_1.default.findByIdAndUpdate(req.params.id, {
            status: req.body.status,
        }, { new: true });
        // If no order found, throw a NotFoundError
        if (!order) {
            throw new error_handlers_1.NotFoundError('Order not found.');
        }
        // Respond with the updated order
        res.status(200).send({ success: true, data: order });
    }
    catch (error) {
        // Use the handleError function to catch and handle errors
        (0, error_handlers_1.handleError)(error, res);
    }
});
exports.updateOrder = updateOrder;
const deleteOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Attempt to find and delete the order
        const order = yield order_modal_1.default.findById(req.params.id);
        if (!order) {
            // If no order is found, throw a NotFoundError
            throw new error_handlers_1.NotFoundError('Order not found.');
        }
        // Delete related order items concurrently
        const deleteOrderItemsPromises = order.orderItems.map((orderItemId) => __awaiter(void 0, void 0, void 0, function* () {
            yield order_item_model_1.default.findByIdAndDelete(orderItemId);
        }));
        // Wait for all order items to be deleted
        yield Promise.all(deleteOrderItemsPromises);
        // Now delete the order itself
        yield order.deleteOne();
        // Send response indicating success
        res.status(200).send({ success: true, message: 'Order and associated order items deleted!' });
    }
    catch (error) {
        (0, error_handlers_1.handleError)(error, res); // Handle errors using the custom error handler
    }
});
exports.deleteOrder = deleteOrder;
const getTotalSales = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const totalSales = yield order_modal_1.default.aggregate([{ $group: { _id: null, totalSales: { $sum: '$totalPrice' } } }]);
        if (!totalSales) {
            throw new error_handlers_1.NotFoundError('The orders sales cannot be generated.');
        }
        res.status(200).send({ success: true, totalSales: totalSales });
    }
    catch (error) {
        (0, error_handlers_1.handleError)(error, res);
    }
});
exports.getTotalSales = getTotalSales;
const orderCount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const orderCount = yield order_modal_1.default.countDocuments({});
        if (!orderCount) {
            throw new error_handlers_1.NotFoundError('No order counted.');
        }
        res.status(200).send({ success: true, orderCount: orderCount });
    }
    catch (error) {
        (0, error_handlers_1.handleError)(error, res);
    }
});
exports.orderCount = orderCount;
const userOrder = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userOrderList = yield order_modal_1.default.find({ user: req.params.userid })
            .populate({
            path: 'orderItems',
            populate: { path: 'product', populate: 'category' },
        })
            .sort({ dateOrdered: -1 });
        if (!userOrderList) {
            throw new error_handlers_1.NotFoundError('No order list founded.');
        }
        res.status(200).send({ success: true, userOrderList: userOrderList });
    }
    catch (error) {
        (0, error_handlers_1.handleError)(error, res);
    }
});
exports.userOrder = userOrder;
