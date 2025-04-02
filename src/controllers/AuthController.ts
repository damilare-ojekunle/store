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

    static getUserById = AsyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const user = await AuthService.getUserById(id);
        if (!user) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: "User not found" });
        }
        res.status(HTTP_STATUS.OK).json({ success: true, data: user });

    })
    static updateUser = AsyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const updatedUser = await AuthService.updateUser(id, req.body);
        if (!updatedUser) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: "User not found" });
        }
        res.status(HTTP_STATUS.OK).json({ success: true, data: updatedUser });

    })

    static deleteUser = AsyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const deleted = await AuthService.deleteUser(id);
        if (!deleted) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: "User not found" });
        }
        res.status(HTTP_STATUS.OK).json({ success: true, message: "User deleted successfully" });

    })
}
