import express from "express";
import ProductController from "../controllers/ProductController";
import { productSchema, updateSchema } from "../validations/product.validation"
import { validateRequest } from "../middleware/ValidateRequest";
import AuthMiddleware from "../middleware/AuthMiddleware";

const router = express.Router();
const auth = new AuthMiddleware()

// Product routes
router.get("/", ProductController.getAllProducts);
router.get("/:id", ProductController.getProductById);
router.post("/", auth.verifyToken.bind(auth), validateRequest(productSchema), ProductController.createProduct);
router.put("/:id", auth.verifyToken.bind(auth), validateRequest(updateSchema), ProductController.updateProduct);
router.delete("/:id", auth.verifyToken.bind(auth), ProductController.deleteProduct);

export { router as ProductRoutes };
