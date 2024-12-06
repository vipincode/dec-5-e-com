"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleError = exports.NotFoundError = exports.DuplicateError = exports.ValidationError = exports.AppError = void 0;
const mongoose_1 = require("mongoose");
const zod_1 = require("zod");
class AppError extends Error {
    constructor(message, statusCode = 500, code = 'INTERNAL_SERVER_ERROR') {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.code = code;
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.AppError = AppError;
class ValidationError extends AppError {
    constructor(message, details) {
        super(message, 400, 'VALIDATION_ERROR');
        this.details = details;
    }
}
exports.ValidationError = ValidationError;
class DuplicateError extends AppError {
    constructor(message) {
        super(message, 400, 'DUPLICATE_ERROR');
    }
}
exports.DuplicateError = DuplicateError;
class NotFoundError extends AppError {
    constructor(message) {
        super(message, 404, 'NOT_FOUND');
    }
}
exports.NotFoundError = NotFoundError;
const handleError = (error, res) => {
    console.error('Error:', error);
    let appError;
    switch (true) {
        case error instanceof mongoose_1.Error:
            appError = handleMongooseError(error);
            break;
        case error instanceof zod_1.ZodError:
            appError = new ValidationError('Validation failed', error.errors);
            break;
        case error instanceof AppError:
            appError = error;
            break;
        default:
            appError = new AppError('An unexpected error occurred');
    }
    const errorResponse = Object.assign({ name: appError.name, message: appError.message, code: appError.code }, (appError instanceof ValidationError && appError.details ? { details: appError.details } : {}));
    res.status(appError.statusCode).json(errorResponse);
};
exports.handleError = handleError;
const handleMongooseError = (error) => {
    if ('code' in error && error.code === 11000) {
        return new DuplicateError('Duplicate key error');
    }
    if (error.name === 'ValidationError') {
        const details = Object.values(error.errors).map((e) => ({
            path: e.path,
            message: e.message,
        }));
        return new ValidationError('Validation failed', details);
    }
    return new AppError(error.message);
};
