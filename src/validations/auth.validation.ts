import * as yup from "yup";


export const userSchema = yup.object().shape({
    name: yup.string().required("Name is required").min(3, "Name must be at least 3 characters long"),

    email: yup.string().required("Email is required").email("Invalid email format").min(3, "Email must be at least 3 characters long"),

    password: yup.string().required("Password is required").min(6, "Password must be at least 6 characters long"),
});
export const updateUserSchema = yup.object().shape({
    name: yup.string().min(3, "Name must be at least 3 characters long").optional(),

    email: yup.string()
        .email("Invalid email format")
        .min(3, "Email must be at least 3 characters long")
        .optional(),

    password: yup.string()
        .min(6, "Password must be at least 6 characters long")
        .optional(),
});
