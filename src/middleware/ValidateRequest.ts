import { Request, Response, NextFunction } from "express";
import { AnySchema } from "yup";
import { BadRequestError } from "../utils/errors";

export const validateRequest = (schema: AnySchema) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Validate req.body against the provided schema
        req.body = await schema.validate(req.body, { abortEarly: false, stripUnknown: true });
        next();
    } catch (error: any) {
        // Combine all validation errors into one message string
        const errorMessage = error.errors ? error.errors.join(", ") : "Invalid request data";
        next(new BadRequestError(errorMessage));
    }
};
