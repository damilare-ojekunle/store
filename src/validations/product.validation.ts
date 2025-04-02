import * as yup from "yup";

export const productSchema = yup.object().shape({
    title: yup.string().required(),
    price: yup.number().positive().required(),
    description: yup.string().required(),
    category: yup.string().required(),
    image: yup.string().url().required(),
});

export const updateSchema = yup.object().shape({
    title: yup.string().optional(),
    price: yup.number().positive().optional(),
    description: yup.string().optional(),
    category: yup.string().optional(),
    image: yup.string().url().optional(),
});