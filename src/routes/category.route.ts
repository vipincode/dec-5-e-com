import { Router } from 'express';

import {
  createCategory,
  deleteCategory,
  getAllCategory,
  getCategory,
  updateCategory,
} from '@controllers/category/category.controller';

const router = Router();

router.post('/category', createCategory);

router.get('/category', getAllCategory);

router.get('/category/:id', getCategory);

router.put('/category/:id', updateCategory);

router.delete('/category/:id', deleteCategory);

export default router;
