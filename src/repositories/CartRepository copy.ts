import CartModel, { ICart } from "../models/Cart"; // Import Cart schema
import { Types } from "mongoose";

class CartRepository {
    /**
     * Create a new cart for a user
     * @param userId - ID of the user
     * @param cartData - Cart details (products)
     * @returns Created cart document
     */
    static async createCart(userId: Types.ObjectId, cartData: Partial<ICart>): Promise<ICart> {
        cartData.userId = userId;
        const cart = new CartModel(cartData);
        return await cart.save();
    }

    /**
     * Get a user's cart by userId
     * @param userId - ID of the user
     * @returns Cart object or null if not found
     */
    static async getCartByUserId(userId: string): Promise<ICart | null> {
        return await CartModel.findById(userId);
    }

    /**
     * Add a product to the cart
     * @param userId - ID of the user
     * @param productId - ID of the product
     * @param quantity - Number of items
     * @returns Updated cart
     */
    static async addToCart(userId: Types.ObjectId, productId: Types.ObjectId, quantity: number): Promise<ICart | null> {
        const cart = await CartModel.findOne({ userId });

        if (!cart) {
            // Create a new cart if it doesn't exist
            return await this.createCart(userId, { products: [{ productId, quantity }] });
        }

        const existingProduct = cart.products.find(p => p.productId.equals(productId));

        if (existingProduct) {
            existingProduct.quantity += quantity; // Update quantity if product exists
        } else {
            cart.products.push({ productId, quantity }); // Add new product
        }

        return await cart.save();
    }

    /**
     * Remove a product from the cart
     * @param userId - ID of the user
     * @param productId - ID of the product to remove
     * @returns Updated cart or null if not found
     */
    static async removeFromCart(userId: Types.ObjectId, productId: Types.ObjectId): Promise<ICart | null> {
        const cart = await CartModel.findOneAndUpdate(
            { userId },
            { $pull: { products: { productId } } }, // Remove product from array
            { new: true }
        );

        return cart;
    }

    /**
     * Clear all items from a user's cart
     * @param userId - ID of the user
     * @returns Deleted cart or null if not found
     */
    static async clearCart(userId: Types.ObjectId): Promise<ICart | null> {
        return await CartModel.findOneAndDelete({ userId });
    }

    /**
    * Get cart by user ID
    * @param userId - The ID of the user
    * @returns The cart document or null
    */
    static async getCart(userId: string): Promise<ICart | null> {
        return await CartModel.findOne(userId);
    }
}

export default CartRepository;
