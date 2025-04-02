import mongoose, { Schema, Document } from 'mongoose';

interface ICartItem {
    productId: mongoose.Types.ObjectId;
    quantity: number;
    title: string;
    price: number;
    description?: string;
    category?: string;
    image?: string;
}

interface ICart extends Document {
    userId: mongoose.Types.ObjectId;
    items: ICartItem[];
    createdAt: Date;
    updatedAt: Date;
}

const CartSchema = new Schema<ICart>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{
        productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, min: 1 },
        title: { type: String, required: true },
        price: { type: Number, required: true },
        description: { type: String },
        category: { type: String },
        image: { type: String }
    }]
}, { timestamps: true });

// Calculate total price virtual
CartSchema.virtual('totalPrice').get(function (this: ICart) {
    return this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
});

export default mongoose.model<ICart>('Cart', CartSchema);