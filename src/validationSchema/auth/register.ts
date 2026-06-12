import { z } from "zod";

export const registerSchema = z
  .object({
    name: z.string().min(1, "الاسم ضروري"),

    phone: z
      .string()
      .min(1, "رقم التليفون ضروري")
      .regex(/^01[0-2,5]{1}[0-9]{8}$/, "رقم التليفون مش صحيح"),

    password: z.string().min(6, "كلمة السر لازم تكون 6 أحرف على الأقل"),

    password_confirmation: z.string().min(6, "تأكيد كلمة السر ضروري"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "كلمة السر مش متطابقتين",
    path: ["password_confirmation"],
  });
