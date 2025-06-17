import { z } from "zod";
import {
    address,
    email,
    first_name,
    last_name,
    password,
    phone_number,
} from "./commonValidator";

export const modalUserSchema = z.object({
    email,
    password,
    first_name,
    last_name,
    phone_number,
    address,
});
