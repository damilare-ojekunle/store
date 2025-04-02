import { Request, Response, NextFunction } from "express";
import AuthService from "../services/AuthService";
import { AsyncHandler } from "../utils/AsyncHandler";
import HTTP_STATUS from "../utils/httpStatus"

export default class AuthController {
    static register = AsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { name, email, password } = req.body;
        const response = await AuthService.register(name, email, password);
        return res.status(HTTP_STATUS.CREATED).json(response);

    });

    static login = AsyncHandler(async (req: Request, res: Response) => {
        const { email, password } = req.body;

        const response = await AuthService.login(email, password);
        return res.status(HTTP_STATUS.OK).json(response);

    });
}
