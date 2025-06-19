import { z } from "zod";
import LanguageUtils from "../LanguageUtils";

export const getValidators = () => {
    const appLanguage = LanguageUtils.getAppLanguage();
    return {
        full_name: z
            .string()
            .min(
                1,
                LanguageUtils.getMessageByKey(
                    "zod.full_name.required",
                    appLanguage
                )
            )
            .max(
                100,
                LanguageUtils.getMessageByKey("zod.full_name.max", appLanguage)
            )
            .trim(),

        first_name: z
            .string()
            .min(
                1,
                LanguageUtils.getMessageByKey(
                    "zod.first_name.required",
                    appLanguage
                )
            )
            .max(
                50,
                LanguageUtils.getMessageByKey("zod.first_name.max", appLanguage)
            )
            .trim(),

        last_name: z
            .string()
            .min(
                1,
                LanguageUtils.getMessageByKey(
                    "zod.last_name.required",
                    appLanguage
                )
            )
            .max(
                50,
                LanguageUtils.getMessageByKey("zod.last_name.max", appLanguage)
            )
            .trim(),

        phone_number: z
            .string()
            .min(
                1,
                LanguageUtils.getMessageByKey(
                    "zod.phone_number.required",
                    appLanguage
                )
            )
            .max(
                10,
                LanguageUtils.getMessageByKey(
                    "zod.phone_number.max",
                    appLanguage
                )
            )
            .regex(
                /^\d+$/,
                LanguageUtils.getMessageByKey(
                    "zod.phone_number.invalid",
                    appLanguage
                )
            )
            .transform((val) => val.trim()),

        email: z
            .string()
            .min(
                1,
                LanguageUtils.getMessageByKey("zod.email.required", appLanguage)
            )
            .email(
                LanguageUtils.getMessageByKey("zod.email.invalid", appLanguage)
            )
            .max(100)
            .trim(),

        password: z
            .string()
            .min(
                6,
                LanguageUtils.getMessageByKey("zod.password.min", appLanguage)
            ),

        gender: z.string({
            required_error: LanguageUtils.getMessageByKey(
                "zod.gender.required",
                appLanguage
            ),
        }),

        address: z
            .string()
            .min(
                1,
                LanguageUtils.getMessageByKey(
                    "zod.address.required",
                    appLanguage
                )
            )
            .trim(),

        reason: z
            .string()
            .min(
                1,
                LanguageUtils.getMessageByKey(
                    "zod.reason.required",
                    appLanguage
                )
            )
            .max(
                500,
                LanguageUtils.getMessageByKey("zod.reason.max", appLanguage)
            )
            .trim(),

        date_of_birth: z.number({
            invalid_type_error: LanguageUtils.getMessageByKey(
                "zod.date_of_birth.required",
                appLanguage
            ),
        }),
    };
};

const appLanguage = LanguageUtils.getAppLanguage();

export const full_name = z
    .string()
    .min(
        1,
        LanguageUtils.getMessageByKey("zod.full_name.required", appLanguage)
    )
    .max(100, "Họ tên tối đa 100 ký tự")
    .trim();

export const first_name = z
    .string()
    .min(
        1,
        `${LanguageUtils.getMessageByKey(
            "zod.first_name.required",
            appLanguage
        )}`
    )
    .max(50, "Tên tối đa 50 ký tự")
    .trim();

export const last_name = z
    .string()
    .min(1, "Họ là bắt buộc")
    .max(50, "Họ tối đa 50 ký tự")
    .trim();

export const phone_number = z
    .string()
    .min(1, "Số điện thoại là bắt buộc")
    .max(10, "Số điện thoại tối đa 10 chữ số")
    .regex(/^\d+$/, "Số điện thoại chỉ được chứa chữ số")
    .transform((val) => val.trim());

export const email = z
    .string()
    .min(1, "Email là bắt buộc")
    .email("Email không hợp lệ")
    .max(100)
    .trim();

export const password = z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự");

export const gender = z.string({
    required_error: "Giới tính là bắt buộc",
});

export const address = z.string().min(1, "Địa chỉ là bắt buộc").trim();

export const reason = z
    .string()
    .min(1, "Lý do khám là bắt buộc")
    .max(500, "Lý do khám tối đa 500 ký tự")
    .trim();

export const date_of_birth = z.number({
    invalid_type_error: "Ngày sinh là bắt buộc",
});
