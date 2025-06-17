import { z } from "zod";
import { email, password } from "./commonValidator";

export const loginSchema = z.object({
    email,
    password,
});
