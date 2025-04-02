import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errors";
import HTTP_STATUS from "../utils/httpStatus";


export const errorHandler = (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
): void => {

    if (err instanceof AppError) {
        res.status(err.statusCode).json({
            success: false,
            message: err.message,
        });
        return;
    }

    console.error("Unexpected Error: ", err);

    res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
        success: false,
        message: "Internal Server Error",
    });
};


// export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction): void => {
//     if (err instanceof AppError) {
//         return res.status(err.statusCode).json({
//             success: false,
//             message: err.message,
//         });
//     }

//     console.error("Unexpected Error: ", err);

//     return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
//         success: false,
//         message: "Internal Server Error",
//     });
// };
