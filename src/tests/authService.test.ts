import AuthService from "../services/AuthService";
import UserRepository from "../repositories/UserRepository";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { BadRequestError } from "../utils/errors";

// Mock Dependencies
jest.mock("../repositories/UserRepository");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("AuthService Unit Tests", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    //  Test User Registration
    it("should register a new user", async () => {
        const mockUser = { id: "123", name: "John Doe", email: "john@example.com", password: "hashedPassword" };

        (UserRepository.findByEmail as jest.Mock).mockResolvedValue(null);
        (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");
        (UserRepository.createUser as jest.Mock).mockResolvedValue(mockUser);
        (jwt.sign as jest.Mock).mockReturnValue("fake-jwt-token");

        const result = await AuthService.register("John Doe", "john@example.com", "password123");

        expect(result).toHaveProperty("success", true);
        expect(result).toHaveProperty("token", "fake-jwt-token");
        expect(UserRepository.createUser).toHaveBeenCalledTimes(1);
    });

    // ❌ Test Registering with Existing Email
    it("should throw an error if email is already in use", async () => {
        (UserRepository.findByEmail as jest.Mock).mockResolvedValue({ email: "john@example.com" });

        await expect(AuthService.register("John Doe", "john@example.com", "password123"))
            .rejects.toThrow(BadRequestError);

        expect(UserRepository.createUser).not.toHaveBeenCalled();
    });

    it("should log in an existing user", async () => {
        const mockUser = {
            id: "123",
            name: "John Doe",
            email: "john@example.com",
            password: "hashedPassword",
            toObject: function () {
                return { id: this.id, name: this.name, email: this.email, password: this.password };
            },
        };

        (UserRepository.findByEmail as jest.Mock).mockResolvedValue(mockUser);
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);
        (jwt.sign as jest.Mock).mockReturnValue("fake-jwt-token");

        const result = await AuthService.login("john@example.com", "password123");

        expect(result.success).toBe(true);
        expect(result.data.token).toBe("fake-jwt-token");
        // Optionally check that password is removed from the user object
        expect(result.data.user.password).toBeUndefined();
    });

    // ✅ Test User Login
    // it("should log in an existing user", async () => {
    //     const mockUser = { id: "123", name: "John Doe", email: "john@example.com", password: "hashedPassword" };

    //     (UserRepository.findByEmail as jest.Mock).mockResolvedValue(mockUser);
    //     (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    //     (jwt.sign as jest.Mock).mockReturnValue("fake-jwt-token");

    //     const result = await AuthService.login("john@example.com", "password123");

    //     expect(result).toHaveProperty("success", true);
    //     expect(result).toHaveProperty("token", "fake-jwt-token");
    // });

    // ❌ Test Login with Incorrect Password
    it("should throw an error if password is incorrect", async () => {
        const mockUser = { id: "123", name: "John Doe", email: "john@example.com", password: "hashedPassword" };

        (UserRepository.findByEmail as jest.Mock).mockResolvedValue(mockUser);
        (bcrypt.compare as jest.Mock).mockResolvedValue(false);

        await expect(AuthService.login("john@example.com", "wrongpassword"))
            .rejects.toThrow("Invalid email or password");

        expect(jwt.sign).not.toHaveBeenCalled();
    });

    // ❌ Test Login for Non-existent User
    it("should throw an error if user does not exist", async () => {
        (UserRepository.findByEmail as jest.Mock).mockResolvedValue(null);

        await expect(AuthService.login("unknown@example.com", "password123"))
            .rejects.toThrow("Invalid email or password");

        expect(jwt.sign).not.toHaveBeenCalled();
    });
});
