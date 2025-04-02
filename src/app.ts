import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Database from "./config/db";
import { AuthRoutes, ProductRoutes, CartRoutes } from "./routes";
import { errorHandler } from "./middleware/ErrorHandler";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

Database.connect();

app.use("/api/", AuthRoutes);
app.use("/api/products", ProductRoutes);
app.use("/api/carts", CartRoutes);

app.use(errorHandler)

export default app;
