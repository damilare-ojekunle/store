import { Types } from "mongoose";
import Cart, { ICart } from "../models/Cart";

export default class CartRepository {
    static async createCart(userId: string, cartData: Partial<ICart>): Promise<ICart> {
        const newCartData = { userId, products: cartData.products };

        const cart = new Cart(newCartData);
        return await cart.save();
    }
}