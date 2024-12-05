import express from 'express';

import { createUser, getAllUser, getUser, userLogin } from '@controllers/user/user.controller';

const router = express.Router();

router.get('/user', getAllUser);

router.get('/user/:id', getUser);

router.put('/user', () => {});

router.delete('/user', () => {});

router.post('/register', createUser);
router.post('/login', userLogin);

export default router;
