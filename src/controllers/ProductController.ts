import { Request, Response } from "express";
import ProductService from "../services/ProductService";
import { AsyncHandler } from "../utils/AsyncHandler";

import HTTP_STATUS from "../utils/httpStatus";

class ProductController {
    /**
     * Get all products
     */
    static getAllProducts = AsyncHandler(async (req: Request, res: Response) => {
        const products = await ProductService.getAllProducts();
        res.status(HTTP_STATUS.OK).json({ success: true, data: products });
    })

    /**
     * Get a product by ID
     */
    static getProductById = AsyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const product = await ProductService.getProductById(id);
        if (!product) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: "Product not found" });
        }
        res.status(HTTP_STATUS.OK).json({ success: true, data: product });

    })



    /**
     * Create a new product
     */
    static createProduct = AsyncHandler(async (req: Request, res: Response) => {
        const product = await ProductService.createProduct(req.body);
        res.status(HTTP_STATUS.CREATED).json({ success: true, data: product });


    })



    /**
     * Update a product
     */
    static updateProduct = AsyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const updatedProduct = await ProductService.updateProduct(id, req.body);
        if (!updatedProduct) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: "Product not found" });
        }
        res.status(HTTP_STATUS.OK).json({ success: true, data: updatedProduct });

    })

    /**
     * Delete a product
     */
    static deleteProduct = AsyncHandler(async (req: Request, res: Response) => {
        const { id } = req.params;
        const deleted = await ProductService.deleteProduct(id);
        if (!deleted) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({ success: false, message: "Product not found" });
        }
        res.status(HTTP_STATUS.OK).json({ success: true, message: "Product deleted successfully" });

    })
}

export default ProductController;
