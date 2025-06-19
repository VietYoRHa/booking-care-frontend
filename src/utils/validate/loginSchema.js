import { z } from "zod";
import { email, getValidators, password } from "./commonValidator";

export const loginSchema = z.object({
    email,
    password,
});

export const createLoginSchema = () => {
    const { email, password } = getValidators();
    return z.object({
        email,
        password,
    });
};
