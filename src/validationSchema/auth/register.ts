import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(1, "الاسم مطلوب"),

    phone: z
      .string()
      .min(1, "رقم الموبايل مطلوب")
      .regex(/^01[0-2,5]{1}[0-9]{8}$/, "رقم الموبايل غير صحيح"),

    password: z.string().min(6, "كلمة المرور لازم تكون 6 أحرف على الأقل"),

    password_confirmation: z.string().min(6, "تأكيد كلمة المرور مطلوب"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "كلمتا المرور غير متطابقتين",
    path: ["password_confirmation"],
  });
