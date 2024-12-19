import express from 'express';
import dotenv from 'dotenv';
import morgan from 'morgan';
import cors from 'cors';
import bodyParser from 'body-parser';

import connectDB from '@config/database';
import { errorHandler } from '@middleware/error.middleware';
import authJwt from '@middleware/jwt.middleware';

import userRouter from '@routes/user.routes';
import productRouter from '@routes/product.route';
import categoryRouter from '@routes/category.route';
import orderRouter from '@routes/order.route';

dotenv.config();

const api = process.env.API_URL as string;

const app = express();

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.options('*', cors());

app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use('/public/uploads', express.static(__dirname + '/public/uploads'));

app.get('/', (req, res) => {
  res.send('Hello, e-shop'!);
});

//Protect route [You can not pass without providing token]
app.use(authJwt());

// Public route [see how skip this jwt middleware]
app.use(api, userRouter);

// Routes
app.use(api, productRouter);
app.use(api, categoryRouter);
app.use(api, orderRouter);

// Global error handling middleware
app.use(errorHandler);

export default app;
