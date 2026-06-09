import { z } from "zod";

export const deathSchema = z.object({
  batch_id: z
    .union([z.string(), z.number()])
    .refine((val) => {
      const num = Number(val);
      return Number.isInteger(num) && num > 0;
    }, { message: "الدفعة مطلوبة" }),

  quantity: z
    .union([z.string(), z.number()])
    .refine((val) => {
      const num = Number(val);
      return !isNaN(num) && num > 0;
    }, { message: "العدد يجب أن يكون رقمًا أكبر من 0" }),

  reason: z
    .string()
    .min(1, "سبب النفوق مطلوب"),

  date: z
    .string()
    .min(1, "التاريخ مطلوب")
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "التاريخ غير صحيح",
    }),

  notes: z.string().optional(),
});
