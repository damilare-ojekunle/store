import { Types } from "mongoose";
import Cart, { ICart } from "../models/Cart";

export default class CartRepository {
    /**
     * Gets user's cart with populated products
     */
    static async getCart(userId: Types.ObjectId): Promise<ICart | null> {
        return Cart.findOne({ userId }).populate("products.productId");
    }

    /**
     * Adds/updates a product in cart (upsert)
     */
    static async addToCart(
        userId: Types.ObjectId,
        productId: Types.ObjectId,
        quantity: number
    ): Promise<ICart> {
        return Cart.findOneAndUpdate(
            { userId, "products.productId": productId },
            { $set: { "products.$.quantity": quantity } },
            { new: true, upsert: true }
        ).populate("products.productId");
    }

    /**
     * Removes a product from cart
     */
    static async removeFromCart(
        userId: Types.ObjectId,
        productId: Types.ObjectId
    ): Promise<ICart | null> {
        return Cart.findOneAndUpdate(
            { userId },
            { $pull: { products: { productId } } },
            { new: true }
        ).populate("products.productId");
    }

    /**
     * Clears the entire cart
     */
    static async clearCart(userId: Types.ObjectId): Promise<void> {
        await Cart.deleteOne({ userId });
    }
}