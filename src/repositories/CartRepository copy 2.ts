import CartModel, { ICart } from "../models/Cart";
import mongoose, { Types } from "mongoose";

class CartRepository {
    static async createCart(userId: Types.ObjectId, cartData: Partial<ICart>): Promise<ICart> {
        const newCartData = { ...cartData, userId };
        const cart = new CartModel(newCartData);
        return await cart.save();
    }

    static async getCartByUserId(userId: Types.ObjectId): Promise<ICart | null> {
        return await CartModel.findOne({ userId }).populate("products.productId").lean();
    }

    static async getCart(userId: string): Promise<ICart | null> {
        return await CartModel.findOne({ userId: new Types.ObjectId(userId) }).populate("products.productId").lean();
    }

    static async addToCart(userId: Types.ObjectId, productId: Types.ObjectId, quantity: number): Promise<ICart | null> {
        const cart = await CartModel.findOne({ userId });

        if (!cart) {
            return await this.createCart(userId, { products: [{ productId, quantity }] });
        }

        const existingProduct = cart.products.find(p => p.productId.toString() === productId.toString());

        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.products.push({ productId, quantity });
        }

        return await cart.save();
    }

    static async removeFromCart(userId: Types.ObjectId, productId: Types.ObjectId): Promise<ICart | null> {
        return await CartModel.findOneAndUpdate(
            { userId },
            { $pull: { products: { productId } } },
            { new: true }
        );
    }

    static async clearCart(userId: Types.ObjectId): Promise<ICart | null> {
        return await CartModel.findOneAndDelete({ userId });
    }


}

export default CartRepository;
