import User, { IUser } from "../models/User";
import { BadRequestError } from "../utils/errors";

export default class UserRepository {
    static async findByEmail(email: string): Promise<IUser | null> {
        return User.findOne({ email: email.toLowerCase() }).exec();
    }

    static async createUser(user: Partial<IUser>): Promise<IUser> {
        try {
            user.email = user.email?.toLowerCase();
            return await User.create(user);
        } catch (error: any) {
            if (error.code === 11000) {
                throw new BadRequestError("User already exists");
            }
            throw error;
        }
    }
}
