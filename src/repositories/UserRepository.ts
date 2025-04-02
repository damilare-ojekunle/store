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
    static async getUserById(userId: string): Promise<IUser | null> {
        return await User.findById(userId);
    }
    static async deleteUser(userId: string): Promise<IUser | null> {
        return await User.findByIdAndDelete(userId);
    }


    static async updateUser(userId: string, updateUser: Partial<IUser>): Promise<IUser | null> {
        return await User.findByIdAndUpdate(userId, updateUser, { new: true, runValidators: true });
    }

    static async getAllUsers(): Promise<IUser[]> {
        return await User.find();
    }
}

