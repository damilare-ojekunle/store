import { Types } from "mongoose";

export interface ICartProduct {
    productId: Types.ObjectId;
    quantity: number;
}

export interface ICart extends Document {
    userId: Types.ObjectId;
    products: ICartProduct[];
}

// For request/response validation
export interface AddToCartRequest {
    productId: string;
    quantity: number;
}