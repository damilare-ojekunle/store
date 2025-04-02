import { Router } from "express";
import AuthController from "../controllers/AuthController";

const router = Router();

router.post("/auth/register", AuthController.register);
router.post("/auth/login", AuthController.login);

export { router as AuthRoutes };