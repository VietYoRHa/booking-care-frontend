import { z } from "zod";
import { getValidators } from "./commonValidator";

export const createModalUserSchema = () => {
    const { email, password, first_name, last_name, phone_number, address } =
        getValidators();
    return z.object({
        email,
        password,
        first_name,
        last_name,
        phone_number,
        address,
    });
};
