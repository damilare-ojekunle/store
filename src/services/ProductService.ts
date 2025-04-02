import ProductRepository from "../repositories/ProductRepository";
import { IProduct } from "../models/Product";




class ProductService {
    /**
     * Create a new product
     * @param productData - The product details
     * @returns The created product
     */
    static async createProduct(productData: Partial<IProduct>): Promise<IProduct> {

        return await ProductRepository.createProduct(productData);
    }

    /**
     * Get all products
     * @returns List of products
     */
    static async getAllProducts(): Promise<IProduct[]> {
        return await ProductRepository.getAllProducts();
    }

    /**
     * Get a product by ID
     * @param id - Product ID
     * @returns The found product
     */
    static async getProductById(id: string): Promise<IProduct | null> {
        return await ProductRepository.getProductById(id);
    }

    /**
     * Update a product
     * @param id - Product ID
     * @param updateData - Fields to update
     * @returns Updated product
     */
    static async updateProduct(id: string, updateData: Partial<IProduct>): Promise<IProduct | null> {

        return await ProductRepository.updateProduct(id, updateData);
    }

    /**
     * Delete a product by ID
     * @param id - Product ID
     * @returns Deleted product
     */
    static async deleteProduct(id: string): Promise<IProduct | null> {
        return await ProductRepository.deleteProduct(id);
    }
}

export default ProductService;
