import { IUser } from "../models/User"
import { Types } from "mongoose";

declare global {
    namespace Express {
        export interface Request {
            user?: { id: string };
        }
    }
}
