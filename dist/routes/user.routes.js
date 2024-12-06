"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("@controllers/user/user.controller");
const router = express_1.default.Router();
router.get('/user', user_controller_1.getAllUser);
router.get('/user/:id', user_controller_1.getUser);
router.put('/user', () => { });
router.delete('/user', () => { });
router.post('/register', user_controller_1.createUser);
router.post('/login', user_controller_1.userLogin);
exports.default = router;
