import express from "express";
import CartController from "../controllers/CartController";
import AuthMiddleware from "../middleware/AuthMiddleware";


const auth = new AuthMiddleware();


const router = express.Router();


router.post("/items", auth.verifyToken.bind(auth), CartController.createCart);
router.get('/items', auth.verifyToken.bind(auth), CartController.getCart);
router.delete('/items', auth.verifyToken.bind(auth), CartController.createCart);
router.put('/items', auth.verifyToken.bind(auth), CartController.updateCartItem);
router.delete(
    '/items/:productId',
    auth.verifyToken.bind(auth),
    CartController.removeCartItem
);


export { router as CartRoutes };
