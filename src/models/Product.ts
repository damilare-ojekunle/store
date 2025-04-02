import mongoose, { Document, Schema } from "mongoose";

export interface IProduct extends Document {
    title: string;
    price: number;
    description: string;
    category: string;
    image: string;

}

const ProductSchema: Schema = new Schema<IProduct>(
    {
        title: { type: String, required: true, trim: true },
        price: { type: Number, required: true, min: 0 },
        description: { type: String, required: true, trim: true },
        category: { type: String, required: true, trim: true },
        image: { type: String, required: true, trim: true }
    },
    { timestamps: true, versionKey: false }
);

export default mongoose.model<IProduct>("Product", ProductSchema);
