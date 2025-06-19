import { z } from "zod";
import { getValidators } from "./commonValidator";

export const createBookingSchema = () => {
    const {
        full_name,
        phone_number,
        email,
        address,
        reason,
        date_of_birth,
        gender,
    } = getValidators();
    return z.object({
        full_name,
        phone_number,
        email,
        address,
        reason,
        date_of_birth,
        gender,
    });
};
