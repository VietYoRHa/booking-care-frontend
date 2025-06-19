import { z } from "zod";
import { getValidators } from "./commonValidator";

export const createLoginSchema = () => {
    const { email, password } = getValidators();
    return z.object({
        email,
        password,
    });
};
