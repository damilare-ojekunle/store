import * as yup from "yup";

export const createStoreSchema = yup.object({
    name: yup
        .string()
        .trim()
        .required("Store name is required")
        .max(100, "Store name cannot exceed 100 characters"),
    address: yup
        .string()
        .trim()
        .required("Store address is required"),
    description: yup
        .string()
        .trim()
        .max(500, "Description cannot exceed 500 characters")
        .optional(),
});

export const updateStoreSchema = yup.object({
    name: yup
        .string()
        .trim()
        .optional()
        .max(100, "Store name cannot exceed 100 characters"),
    address: yup
        .string()
        .trim()
        .optional(),
    description: yup
        .string()
        .trim()
        .optional()
        .max(500, "Description cannot exceed 500 characters"),
});
