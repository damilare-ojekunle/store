import { Request, Response } from "express";
import HTTP_STATUS from "../utils/httpStatus";
import { AsyncHandler } from "../utils/AsyncHandler";
import CartService from "../services/CartService";
import { AddToCartRequest } from "../interfaces";
import { MongoUtils } from "../utils/mongoUtils";
import { Types } from "mongoose";

// Extend Express Request to include user
interface AuthRequest extends Request {
    user?: { id: string; email: string };
}

export default class CartController {
    /**
     * Get user's cart
     */
    // static getCart = AsyncHandler(async (req: AuthRequest, res: Response) => {
    //     const userId = req.user?.id;
    //     if (!userId || !MongoUtils.toObjectId(userId)) {
    //         return res.status(HTTP_STATUS.UNAUTHORIZED).json({
    //             success: false,
    //             message: "Invalid user ID",
    //         });
    //     }

    //     const cart = await CartService.getCart(userId);
    //     res.status(HTTP_STATUS.OK).json({ success: true, data: cart });
    // });

    static getCart = AsyncHandler(async (req: AuthRequest, res: Response) => {
        // 1. Validate user existence and ID format
        if (!req.user?.id) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                success: false,
                message: "Authentication required"
            });
        }

        // 2. Safely convert to ObjectId
        let userId: Types.ObjectId;
        try {
            userId = MongoUtils.toObjectId(req.user.id);
        } catch (error) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                message: "Invalid user ID format"
            });
        }

        // 3. Fetch and return cart
        try {
            const cart = await CartService.getCart(userId);
            if (!cart) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({
                    success: false,
                    message: "Cart not found"
                });
            }

            return res.status(HTTP_STATUS.OK).json({
                success: true,
                data: cart
            });
        } catch (error) {
            // 4. Handle service errors
            return res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: "Failed to fetch cart",
                error: error instanceof Error ? error.message : "Unknown error"
            });
        }
    });

    /**
     * Add product to cart
     */
    static addToCart = AsyncHandler(async (req: AuthRequest, res: Response) => {
        const userId = req.user?.id;
        const { productId, quantity } = req.body as AddToCartRequest;

        // Validate input
        if (!userId || !MongoUtils.toObjectId(userId)) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                success: false,
                message: "Invalid user ID",
            });
        }

        if (!productId || !MongoUtils.toObjectId(productId)) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                message: "Invalid product ID",
            });
        }

        if (!quantity || quantity <= 0) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                message: "Quantity must be positive",
            });
        }

        // Process request
        try {
            const cart = await CartService.addToCart(userId, productId, quantity);
            res.status(HTTP_STATUS.OK).json({ success: true, data: cart });
        } catch (error) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                message: error instanceof Error ? error.message : "Failed to add to cart",
            });
        }
    });

    /**
     * Remove product from cart
     */
    static removeFromCart = AsyncHandler(async (req: AuthRequest, res: Response) => {
        const userId = req.user?.id;
        const { productId } = req.body;

        if (!userId || !MongoUtils.toObjectId(userId)) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                success: false,
                message: "Invalid user ID",
            });
        }

        if (!productId || !MongoUtils.toObjectId(productId)) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                message: "Invalid product ID",
            });
        }

        try {
            const cart = await CartService.removeFromCart(userId, productId);
            res.status(HTTP_STATUS.OK).json({ success: true, data: cart });
        } catch (error) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                message: error instanceof Error ? error.message : "Failed to remove item",
            });
        }
    });

    /**
     * Clear cart
     */
    static clearCart = AsyncHandler(async (req: AuthRequest, res: Response) => {
        const userId = req.user?.id;

        if (!userId || !MongoUtils.toObjectId(userId)) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                success: false,
                message: "Invalid user ID",
            });
        }

        try {
            await CartService.clearCart(userId);
            res.status(HTTP_STATUS.OK).json({ success: true, message: "Cart cleared" });
        } catch (error) {
            res.status(HTTP_STATUS.BAD_REQUEST).json({
                success: false,
                message: error instanceof Error ? error.message : "Failed to clear cart",
            });
        }
    });
}