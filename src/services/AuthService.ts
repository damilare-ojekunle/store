import UserRepository from "../repositories/UserRepository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { BadRequestError } from "../utils/errors";
import { IUser } from "../models/User";


export default class AuthService {

    private static generateToken(userId: string): string {
        return jwt.sign({ id: userId }, process.env.JWT_SECRET as string, { expiresIn: "1h" });
    }
    static async register(name: string, email: string, password: string) {
        const existingUser = await UserRepository.findByEmail(email);
        if (existingUser) {
            throw new BadRequestError("User already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await UserRepository.createUser({ name, email, password: hashedPassword });
        console.log("newUser", newUser)
        return { success: true, message: "User registered successfully" };


    }

    static async login(email: string, password: string) {
        const user = await UserRepository.findByEmail(email);
        if (!user) {
            throw new BadRequestError("Invalid email or password");
        }


        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) throw new BadRequestError("Invalid email or password");
        const token = this.generateToken(user?.id)
        const userObject = user.toObject()


        // Exclude password from the response
        delete userObject.password;
        return {
            success: true,
            message: "Login Successfully",
            data: {
                user: userObject,
                token,
            }
        };
    }


    static async getUserById(id: string) {
        return await UserRepository.getUserById(id);
    }
    static async updateUser(id: string, updateUser: Partial<IUser>): Promise<IUser | null> {

        return await UserRepository.updateUser(id, updateUser);
    }
    static async deleteUser(id: string): Promise<IUser | null> {
        return await UserRepository.deleteUser(id);
    }
    static async getAllUsers(): Promise<IUser[]> {
        return await UserRepository.getAllUsers();
    }



}
