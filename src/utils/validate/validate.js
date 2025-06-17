import { z } from "zod";

export const zodValidate = (schema, data) => {
    try {
        schema.parse(data);
        return { isValid: true, errors: null };
    } catch (error) {
        if (error instanceof z.ZodError) {
            const errors = error.errors.map((err) => ({
                field: err.path[0],
                message: err.message,
            }));
            return { isValid: false, errors };
        }
        return {
            isValid: false,
            errors: [{ field: "general", message: error.message }],
        };
    }
};
