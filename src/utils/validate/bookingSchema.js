import { z } from "zod";
import {
    address,
    date_of_birth,
    email,
    full_name,
    gender,
    phone_number,
    reason,
} from "./commonValidator";

export const bookingSchema = z.object({
    // full_name,
    // phone_number,
    // email,
    // address,
    // reason,
    date_of_birth,
    gender,
});
