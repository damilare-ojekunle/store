import * as yup from "yup";


const productSchema = yup.object().shape({

    title: yup.string().required().min(3),
    price: yup.number().required().positive(),
    description: yup.string().required(),
    category: yup.string().required(),
    image: yup.string().required().url()
});

export const cartSchema = yup.object().shape({

    userId: yup.string().required(),
    products: yup.array().of(productSchema).required().min(1)
});