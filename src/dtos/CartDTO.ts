export interface AddToCartDTO {
    productId: string;
    quantity: number;
}

export interface UpdateCartItemDTO {
    productId: string;
    quantity: number;
}

export interface CartResponseDTO {
    userId: string;
    items: {
        productId: string;
        quantity: number;
        title: string;
        price: number;
        totalPrice: number;
        description?: string;
        category?: string;
        image?: string;
    }[];
    totalPrice: number;
    createdAt?: Date;
    updatedAt?: Date;
}