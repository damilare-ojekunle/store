import { Types } from "mongoose";
import CartRepository from "../repositories/CartRepository";
import { ICart } from "../models/Cart";
import { MongoUtils } from "../utils/mongoUtils";

export default class CartService {
    /**
     * Gets user cart
     */
    static async getCart(userId: string | Types.ObjectId): Promise<ICart | null> {
        const validUserId = MongoUtils.toObjectId(userId);
        return CartRepository.getCart(validUserId);
    }

    /**
     * Adds product to cart (or updates quantity)
     */
    static async addToCart(
        userId: string | Types.ObjectId,
        productId: string,
        quantity: number
    ): Promise<ICart> {
        if (quantity <= 0) throw new Error("Quantity must be positive");

        const validUserId = MongoUtils.toObjectId(userId);
        const validProductId = MongoUtils.toObjectId(productId);

        return CartRepository.addToCart(validUserId, validProductId, quantity);
    }

    /**
     * Removes product from cart
     */
    static async removeFromCart(
        userId: string | Types.ObjectId,
        productId: string | Types.ObjectId
    ): Promise<ICart | null> {
        const validUserId = MongoUtils.toObjectId(userId);
        const validProductId = MongoUtils.toObjectId(productId);

        return CartRepository.removeFromCart(validUserId, validProductId);
    }

    /**
     * Clears the cart
     */
    static async clearCart(userId: string | Types.ObjectId): Promise<void> {
        const validUserId = MongoUtils.toObjectId(userId);
        await CartRepository.clearCart(validUserId);
    }
}