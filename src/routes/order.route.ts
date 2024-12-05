import { Router } from 'express';

import {
  createOrder,
  deleteOrder,
  getAllOrder,
  getOrder,
  getTotalSales,
  orderCount,
  updateOrder,
  userOrder,
} from '@controllers/order/order.controller';

const router = Router();

router.post('/order', createOrder);

router.get('/order', getAllOrder);

router.get('/order/:id', getOrder);

router.put('/order/:id', updateOrder);

router.delete('/order/:id', deleteOrder);

// Sales
router.get('/order/get/total-sales', getTotalSales);

router.get('/order/get/count', orderCount);

router.get('/order/get/user-order/:userid', userOrder);

export default router;
