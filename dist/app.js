"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const body_parser_1 = __importDefault(require("body-parser"));
const database_1 = __importDefault(require("@config/database"));
const error_middleware_1 = require("@middleware/error.middleware");
const jwt_middleware_1 = __importDefault(require("@middleware/jwt.middleware"));
const user_routes_1 = __importDefault(require("@routes/user.routes"));
const product_route_1 = __importDefault(require("@routes/product.route"));
const category_route_1 = __importDefault(require("@routes/category.route"));
const order_route_1 = __importDefault(require("@routes/order.route"));
dotenv_1.default.config();
const api = process.env.API_URL;
const app = (0, express_1.default)();
// Connect to MongoDB
(0, database_1.default)();
// Middleware
app.use((0, cors_1.default)());
app.options('*', (0, cors_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(body_parser_1.default.json());
app.get('/', (req, res) => {
    res.send('Hello, e-shop');
});
//Protect route [You can not pass without providing token]
app.use((0, jwt_middleware_1.default)());
// Public route [see how skip this jwt middleware]
app.use(api, user_routes_1.default);
// Routes
app.use(api, product_route_1.default);
app.use(api, category_route_1.default);
app.use(api, order_route_1.default);
// Global error handling middleware
app.use(error_middleware_1.errorHandler);
exports.default = app;
