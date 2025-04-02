import HTTP_STATUS from "./httpStatus";

class AppError extends Error {
    public statusCode: number;
    public isOperational: boolean;

    constructor(message: string, statusCode: number, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
}

class BadRequestError extends AppError {
    constructor(message = "Bad Request") {
        super(message, HTTP_STATUS.BAD_REQUEST);
    }
}

class UnauthorizedError extends AppError {
    constructor(message = "Unauthorized") {
        super(message, HTTP_STATUS.UNAUTHORIZED);
    }
}

class NotFoundError extends AppError {
    constructor(message = "Not Found") {
        super(message, HTTP_STATUS.NOT_FOUND);
    }
}

export { AppError, BadRequestError, UnauthorizedError, NotFoundError };
