"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
// Error handler middleware
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    // Default error response
    const status = err.status || 500;
    const errName = err.name || 'Error';
    const message = err.message || 'Something went wrong!';
    // Send a descriptive error response to the user
    res.status(status).json({ name: errName, error: message });
};
exports.errorHandler = errorHandler;
