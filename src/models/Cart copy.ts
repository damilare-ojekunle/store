import mongoose, { Document, Schema, Types } from "mongoose";


export interface ICartProduct {
    productId: Types.ObjectId;
    quantity: number;
}
export interface ICart extends Document {
    userId: Types.ObjectId;
    products: ICartProduct[];

}


const CartSchema: Schema = new Schema<ICart>(
    {
        userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
        products: [
            {
                productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
                quantity: { type: Number, required: true, min: 1 }
            }
        ]
    },
    { timestamps: true }
);

export default mongoose.model<ICart>("Cart", CartSchema);
