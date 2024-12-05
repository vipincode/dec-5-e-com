import { Router } from 'express';

import {
  createProduct,
  deleteProduct,
  getProduct,
  getAllProduct,
  updateProduct,
  getProductCount,
  getFeaturedProduct,
} from '@controllers/product/product.controller';

const router = Router();

router.post('/product', createProduct);

router.get('/product', getAllProduct);

router.get('/product/count', getProductCount);

router.get('/product/featured/:count', getFeaturedProduct);

router.get('/product/:id', getProduct);

router.put('/product/:id', updateProduct);

router.delete('/product/:id', deleteProduct);

// use like this to prevent route conflict with /:id
// router.get('/product/get/count', getProductCount);

export default router;
