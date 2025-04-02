import { Request, Response, NextFunction } from "express";
import HTTP_STATUS from "../utils/httpStatus";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
    user?: { id: string };
}

export default class AuthMiddleware {

    private getAccessToken(req: Request): string | null {
        const authorization = req.headers.authorization || null;

        if (!authorization || !authorization.startsWith("Bearer ")) {
            return null;
        }

        return authorization.substring(7).trim();
    }

    // Simplified without needing type assertions
    async verifyToken(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
        try {
            const token = this.getAccessToken(req);
            if (!token) {
                res.status(HTTP_STATUS.UNAUTHORIZED).json({
                    status: "error",
                    message: "Unauthorized"
                });
                return;
            }

            const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
            req.user = { id: decoded.id };
            next();
        } catch (error) {
            res.status(HTTP_STATUS.FORBIDDEN).json({
                status: "error",
                message: "Invalid token"
            });
            return;
        }
    }
}
