import { z } from "zod";

export const loginSchema = z.object({
phone: z
.string()
.min(1, "رقم الموبايل مطلوب")
.regex(/^01[0-2,5]{1}[0-9]{8}$/, "رقم الموبايل غير صحيح"),

password: z.string().min(6, "كلمة المرور لازم تكون 6 أحرف على الأقل"),
});
