import Cart from '../models/Cart';
import Product from '../models/Product';
import { AddToCartDTO, UpdateCartItemDTO } from '../dtos/CartDTO';
import { Types } from 'mongoose';
import { ensureObjectId, ensureString } from '../utils/mongoUtils';

export default class CartService {
    static async getCart(userId: string) {
        return Cart.findOne({ userId: new Types.ObjectId(userId) })
            .lean()
            .exec();
    }

    static async createCart(userId: string, item: AddToCartDTO): Promise<any> {
        // Fetch product details
        const product = await Product.findById(item.productId);
        if (!product) throw new Error('Product not found');

        // Find or create cart
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({
                userId,
                items: []
            });
        }

        // Check if product already exists in cart
        const existingItemIndex = cart.items.findIndex(item =>
            item.productId.toString() === product.id.toString()
        );

        if (existingItemIndex >= 0) {
            // Update quantity if exists
            cart.items[existingItemIndex].quantity += item.quantity;
        } else {
            // Add new item
            cart.items.push({
                productId: product.id,
                quantity: item.quantity,
                title: product.title,
                price: product.price,
                description: product.description,
                category: product.category,
                image: product.image
            });
        }

        return cart.save();
    }

    static async updateCartItem(userId: string, item: UpdateCartItemDTO): Promise<any> {
        const cart = await Cart.findOne({ userId });
        if (!cart) throw new Error('Cart not found');

        const itemIndex = cart.items.findIndex(i =>
            i.productId.toString() === item.productId
        );

        if (itemIndex < 0) throw new Error('Item not found in cart');

        if (item.quantity <= 0) {
            // Remove if quantity is 0 or less
            cart.items.splice(itemIndex, 1);
        } else {
            // Update quantity
            cart.items[itemIndex].quantity = item.quantity;
        }

        return cart.save();
    }

    // static async clearCart(userId: string): Promise<any> {
    //     return Cart.deleteOne({ userId })
    // }

    static async clearCart(userId: string): Promise<{ deletedCount: number }> {
        try {
            const result = await Cart.deleteOne({
                userId: new Types.ObjectId(userId)
            }).exec();

            if (result.deletedCount === 0) {
                throw new Error('Cart not found or already empty');
            }

            return result;
        } catch (error) {
            console.error('Error clearing cart:', error);
            throw new Error('Failed to clear cart');
        }
    }
    static async removeCartItem(
        userId: string,
        productId: string
    ): Promise<any> {
        try {
            return await Cart.findOneAndUpdate(
                { userId: new Types.ObjectId(userId) },
                { $pull: { items: { productId: new Types.ObjectId(productId) } } },
                { new: true }
            ).exec();
        } catch (error) {
            console.error('Error removing item:', error);
            throw new Error('Failed to remove item from cart');
        }
    }
}