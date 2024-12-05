import { Request, Response } from 'express';

import { AppError, handleError, NotFoundError, ValidationError } from '@utils/error-handlers';
import { OrderData, orderSchema } from '@schemas/order.schema';

import Order from '@models/order.modal';
import OrderItem from '@models/order-item.model';
import { OrderItemData } from '@schemas/order-item.schema';
import { Types } from 'mongoose';

export const createOrder = async (req: Request, res: Response) => {
  try {
    // Validate incoming request data
    const orderData: OrderData = orderSchema.parse(req.body);

    // Create order items and collect their IDs
    const orderItemIds: Types.ObjectId[] = await Promise.all(
      orderData.orderItems.map(async (orderItem: OrderItemData) => {
        const newOrderItem = new OrderItem({
          quantity: orderItem.quantity,
          product: orderItem.product,
        });
        const savedOrderItem = await newOrderItem.save();
        return savedOrderItem._id; // return ObjectId after saving
      }),
    );

    // Calculate the total price for each order item
    const totalPrices = await Promise.all(
      orderItemIds.map(async (orderItemId) => {
        const orderItem: any = await OrderItem.findById(orderItemId).populate('product', 'price');

        // Ensure orderItem and product are found
        if (!orderItem || !orderItem.product) {
          throw new AppError('Order item or product not found', 404, 'ORDER_ITEM_NOT_FOUND');
        }

        // Calculate total price for this order item
        const totalPrice = orderItem.product.price * orderItem.quantity;
        return totalPrice;
      }),
    );

    const totalOrderPrice = totalPrices.reduce((acc, price) => acc + price, 0);

    // Create the order with the order item IDs
    const order = await Order.create({
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
      throw new AppError('Failed to create order', 500, 'ORDER_CREATION_FAILED');
    }

    // Return the created order
    res.status(201).send({ success: true, data: order });
  } catch (error) {
    handleError(error, res);
  }
};

export const getAllOrder = async (req: Request, res: Response) => {
  try {
    // Here I want populate only user : name
    // const orderList = await Order.find().populate('user', 'name email');
    // or
    const orderList = await Order.find()
      .populate({
        path: 'user',
        select: 'name email', // Include only name and email
      })
      .sort({ dateOrdered: -1 });
    // const orderList = await Order.find().populate('user');

    if (!orderList) {
      throw new NotFoundError('Product not found.');
    }

    res.status(200).send({ success: true, data: orderList });
  } catch (error) {
    handleError(error, res);
  }
};

export const getOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundError('Invalid order ID.');
    }

    const order = await Order.findById(id)
      .populate({
        path: 'user',
        select: 'name email',
      })
      // this is field name orderItems like - orderItems:[{product:{.., category: {...}}}]
      // so this orderItems, product & category is path, also use in populate
      .populate({ path: 'orderItems', populate: { path: 'product', populate: 'category' } });

    if (!order) {
      throw new NotFoundError('Order not found.');
    }

    res.status(200).send({ success: true, data: order });
  } catch (error) {
    handleError(error, res);
  }
};

export const updateOrder = async (req: Request, res: Response) => {
  try {
    // Check if the request body contains the required fields
    if (!req.body.status) {
      throw new ValidationError('Status are required fields.');
    }

    // Update the order
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        status: req.body.status,
      },
      { new: true }, // return the updated order data
    );

    // If no order found, throw a NotFoundError
    if (!order) {
      throw new NotFoundError('Order not found.');
    }

    // Respond with the updated order
    res.status(200).send({ success: true, data: order });
  } catch (error) {
    // Use the handleError function to catch and handle errors
    handleError(error, res);
  }
};

export const deleteOrder = async (req: Request, res: Response) => {
  try {
    // Attempt to find and delete the order
    const order = await Order.findById(req.params.id);

    if (!order) {
      // If no order is found, throw a NotFoundError
      throw new NotFoundError('Order not found.');
    }

    // Delete related order items concurrently
    const deleteOrderItemsPromises = order.orderItems.map(async (orderItemId) => {
      await OrderItem.findByIdAndDelete(orderItemId);
    });

    // Wait for all order items to be deleted
    await Promise.all(deleteOrderItemsPromises);

    // Now delete the order itself
    await order.deleteOne();

    // Send response indicating success
    res.status(200).send({ success: true, message: 'Order and associated order items deleted!' });
  } catch (error) {
    handleError(error, res); // Handle errors using the custom error handler
  }
};

export const getTotalSales = async (req: Request, res: Response) => {
  try {
    const totalSales = await Order.aggregate([{ $group: { _id: null, totalSales: { $sum: '$totalPrice' } } }]);

    if (!totalSales) {
      throw new NotFoundError('The orders sales cannot be generated.');
    }

    res.status(200).send({ success: true, totalSales: totalSales });
  } catch (error) {
    handleError(error, res);
  }
};

export const orderCount = async (req: Request, res: Response) => {
  try {
    const orderCount = await Order.countDocuments({});

    if (!orderCount) {
      throw new NotFoundError('No order counted.');
    }

    res.status(200).send({ success: true, orderCount: orderCount });
  } catch (error) {
    handleError(error, res);
  }
};

export const userOrder = async (req: Request, res: Response) => {
  try {
    const userOrderList = await Order.find({ user: req.params.userid })
      .populate({
        path: 'orderItems',
        populate: { path: 'product', populate: 'category' },
      })
      .sort({ dateOrdered: -1 });

    if (!userOrderList) {
      throw new NotFoundError('No order list founded.');
    }

    res.status(200).send({ success: true, userOrderList: userOrderList });
  } catch (error) {
    handleError(error, res);
  }
};
