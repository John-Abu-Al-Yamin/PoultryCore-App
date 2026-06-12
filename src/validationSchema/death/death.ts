import { z } from "zod";

export const deathSchema = z.object({
  batch_id: z
    .union([z.string(), z.number()])
    .refine((val) => {
      const num = Number(val);
      return Number.isInteger(num) && num > 0;
    }, { message: "الدفعة ضرورية" }),

  quantity: z
    .union([z.string(), z.number()])
    .refine((val) => {
      const num = Number(val);
      return !isNaN(num) && num > 0;
    }, { message: "العدد لازم يكون رقم أكبر من 0" }),

  reason: z
    .string()
    .min(1, "سبب النفوق ضروري"),

  date: z
    .string()
    .min(1, "التاريخ ضروري")
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "التاريخ مش صحيح",
    }),

  notes: z.string().optional(),
});
