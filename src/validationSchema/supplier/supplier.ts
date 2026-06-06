import { z } from "zod";

export const supplierSchema = z.object({
  name: z
    .string()
    .min(1, "اسم المورد مطلوب")
    .max(255, "اسم المورد لا يمكن أن يتجاوز 255 حرفًا"),

  phone: z
    .string()
    .min(1, "رقم الهاتف مطلوب")
    .regex(/^01[0-2,5]{1}[0-9]{8}$/, "رقم هاتف مصري غير صالح"),

  address: z
    .string()
    .max(255, "العنوان لا يمكن أن يتجاوز 255 حرفًا")
    .optional()
    .or(z.literal("")),
});