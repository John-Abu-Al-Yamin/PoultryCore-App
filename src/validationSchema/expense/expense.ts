import { z } from "zod";

export const expenseSchema = z.object({
  batch_id: z
    .union([z.string(), z.number()])
    .refine((val) => {
      const num = Number(val);
      return Number.isInteger(num) && num > 0;
    }, { message: "الدفعة مطلوبة" }),

  type: z
    .string()
    .min(1, "نوع المصروف مطلوب"),

  amount: z
    .union([z.string(), z.number()])
    .refine((val) => {
      const num = Number(val);
      return !isNaN(num) && num > 0;
    }, { message: "المبلغ يجب أن يكون رقمًا أكبر من 0" }),

  date: z
    .string()
    .min(1, "تاريخ المصروف مطلوب")
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "تاريخ المصروف غير صحيح",
    }),

  notes: z.string().optional(),
});
