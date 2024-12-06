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
exports.userLogin = exports.createUser = exports.getUser = exports.getAllUser = void 0;
const user_model_1 = __importDefault(require("@models/user.model"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const error_handlers_1 = require("@utils/error-handlers");
const getAllUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_model_1.default.find().select('-passwordHash');
        if (!users || users.length === 0) {
            throw new error_handlers_1.NotFoundError('No users found');
        }
        res.status(200).json({ success: true, data: users });
    }
    catch (error) {
        (0, error_handlers_1.handleError)(error, res);
    }
});
exports.getAllUser = getAllUser;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_model_1.default.findById(req.params.id).select('-passwordHash');
        if (!user) {
            throw new error_handlers_1.NotFoundError('No users found');
        }
        res.status(200).send({ data: user });
    }
    catch (error) {
        (0, error_handlers_1.handleError)(error, res);
    }
});
exports.getUser = getUser;
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userData = req.body;
        // Check if user data is provided
        if (!userData || !userData.email || !userData.password) {
            throw new error_handlers_1.ValidationError('Required user data is missing', {
                missingFields: ['email', 'password'],
            });
        }
        // Check if a user with the same email already exists
        const existingUser = yield user_model_1.default.findOne({ email: userData.email });
        if (existingUser) {
            throw new error_handlers_1.DuplicateError('A user with this email already exists');
        }
        // Create the new user
        const user = yield user_model_1.default.create({
            name: userData.name,
            email: userData.email,
            passwordHash: bcryptjs_1.default.hashSync(userData.password, 10),
            phone: userData.phone,
            isAdmin: userData.isAdmin || false,
            street: userData.street,
            apartment: userData.apartment,
            zip: userData.zip,
            city: userData.city,
            country: userData.country,
        });
        // Check if user creation was successful
        if (!user) {
            throw new Error('User creation failed due to an unknown error');
        }
        // Send the response
        res.status(201).json({ success: true, data: user });
    }
    catch (error) {
        (0, error_handlers_1.handleError)(error, res);
    }
});
exports.createUser = createUser;
const userLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        // Validate input
        if (!email || !password) {
            throw new error_handlers_1.ValidationError('Email and password are required', {
                missingFields: ['email', 'password'],
            });
        }
        // Find user by email
        const user = yield user_model_1.default.findOne({ email });
        if (!user) {
            throw new error_handlers_1.NotFoundError('User not found!');
        }
        // Check password
        const isPasswordValid = bcryptjs_1.default.compareSync(password, user.passwordHash);
        if (!isPasswordValid) {
            throw new error_handlers_1.ValidationError('Invalid email or password');
        }
        // Generate JWT
        const token = jsonwebtoken_1.default.sign({ userId: user.id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '1d' });
        // Respond with token and user details
        res.status(200).json({ success: true, user: { email: user.email }, token });
    }
    catch (error) {
        (0, error_handlers_1.handleError)(error, res);
        next(error); // Pass unexpected errors to the Express error handler
    }
});
exports.userLogin = userLogin;
