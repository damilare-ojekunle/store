import ProductModel, { IProduct } from "../models/Product";

export default class ProductRepository {
    /**
     * Create a new product
     * @param productData - The product details
     * @returns Created product
     */
    static async createProduct(productData: Partial<IProduct>): Promise<IProduct> {
        const product = new ProductModel(productData);
        return await product.save();
    }

    /**
     * Get all products
     * @returns List of products
     */
    static async getAllProducts(): Promise<IProduct[]> {
        return await ProductModel.find();
    }

    /**
     * Get a product by ID
     * @param productId - The product ID
     * @returns The product or null if not found
     */
    static async getProductById(productId: string): Promise<IProduct | null> {
        return await ProductModel.findById(productId);
    }

    /**
     * Update a product by ID
     * @param productId - The product ID
     * @param updateData - The fields to update
     * @returns The updated product or null if not found
     */
    static async updateProduct(productId: string, updateData: Partial<IProduct>): Promise<IProduct | null> {
        return await ProductModel.findByIdAndUpdate(productId, updateData, { new: true, runValidators: true });
    }

    /**
     * Delete a product by ID
     * @param productId - The product ID
     * @returns Deleted product or null if not found
     */
    static async deleteProduct(productId: string): Promise<IProduct | null> {
        return await ProductModel.findByIdAndDelete(productId);
    }
}
