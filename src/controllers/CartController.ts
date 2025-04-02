import { Request, Response } from 'express';
import CartService from '../services/CartService';
import { AddToCartDTO, CartResponseDTO, UpdateCartItemDTO } from '../dtos/CartDTO';
import { AsyncHandler } from "../utils/AsyncHandler";
import { AuthRequest } from "../middleware/AuthMiddleware";
import HTTP_STATUS from "../utils/httpStatus"

export interface RemoveCartItemDTO {
    productId: string;
}


export default class CartController {
    static getCart = AsyncHandler(async (req: AuthRequest, res: Response) => {
        if (!req.user) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Unauthorized" });
        }

        const cart = await CartService.getCart(req.user.id.toString()); // Convert to string
        if (!cart) return res.status(HTTP_STATUS.NOT_FOUND).json({ message: "Cart not found" });

        const response: CartResponseDTO = {
            userId: cart.userId.toString(),
            items: cart.items.map(item => ({
                productId: item.productId.toString(),
                quantity: item.quantity,
                title: item.title,
                price: item.price,
                totalPrice: item.price * item.quantity,
                description: item.description,
                category: item.category,
                image: item.image
            })),
            totalPrice: cart.items.reduce((total, item) => total + (item.price * item.quantity), 0),
            createdAt: cart.createdAt,
            updatedAt: cart.updatedAt
        };

        res.json(response);
    }
    )
    static createCart = AsyncHandler(async (req: AuthRequest, res: Response) => {
        console.log("req", req.user)
        if (!req.user) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Unauthorized" });
        }

        const dto: AddToCartDTO = {
            productId: req.body.productId,
            quantity: req.body.quantity || 1
        };

        const cart = await CartService.createCart(req.user.id, dto);
        res.status(HTTP_STATUS.CREATED).json(cart);

    })
    static updateCartItem = AsyncHandler(async (req: AuthRequest, res: Response) => {
        if (!req.user) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({ message: "Unauthorized" });
        }

        const dto: UpdateCartItemDTO = {
            productId: req.params.productId,
            quantity: req.body.quantity
        };

        const cart = await CartService.updateCartItem(req.user.id.toString(), dto);
        res.json(cart);
    })


    static clearCart = AsyncHandler(async (req: AuthRequest, res: Response) => {
        if (!req.user?.id) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                success: false,
                message: "Unauthorized"
            });
        }

        try {
            await CartService.clearCart(req.user.id.toString());
            res.json({
                success: true,
                message: "Cart cleared successfully"
            });
        } catch (error: any) {
            res.status(error.message.includes('not found') ? HTTP_STATUS.NOT_FOUND : HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message
            });
        }
    });
    static removeCartItem = AsyncHandler(async (req: AuthRequest, res: Response) => {
        if (!req.user?.id) {
            return res.status(HTTP_STATUS.UNAUTHORIZED).json({
                success: false,
                message: "Unauthorized"
            });
        }

        const dto: RemoveCartItemDTO = {
            productId: req.params.productId
        };

        try {
            const updatedCart = await CartService.removeCartItem(
                req.user.id.toString(),
                dto.productId
            );

            if (!updatedCart) {
                return res.status(HTTP_STATUS.NOT_FOUND).json({
                    success: false,
                    message: "Cart not found"
                });
            }

            res.json({
                success: true,
                data: updatedCart,
                message: "Item removed successfully"
            });
        } catch (error: any) {
            res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({
                success: false,
                message: error.message
            });
        }
    });

}