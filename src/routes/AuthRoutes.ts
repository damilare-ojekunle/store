import { Router } from "express";
import AuthController from "../controllers/AuthController";
import { userSchema, updateUserSchema } from "../validations/auth.validation";
import { validateRequest } from "../middleware/ValidateRequest";
import AuthMiddleware from "../middleware/AuthMiddleware";

const router = Router();
const auth = new AuthMiddleware()

router.post("/auth/register", validateRequest(userSchema), AuthController.register);
router.post("/auth/login", AuthController.login);
router.get("/:id", auth.verifyToken.bind(auth), AuthController.getUserById);
router.put("/:id", auth.verifyToken.bind(auth), validateRequest(updateUserSchema), AuthController.updateUser);
router.delete("/:id", auth.verifyToken.bind(auth), AuthController.deleteUser);

export { router as AuthRoutes };