import { z } from "zod";

export const batchSchema = z.object({
  barn_id: z
    .union([z.string(), z.number()])
    .refine((val) => {
      const num = Number(val);
      return Number.isInteger(num) && num > 0;
    }, {
      message: "معرّف العنبر ضروري ولازم يكون رقم صحيح",
    }),

  poultry_type: z
    .string()
    .min(1, "نوع الدواجن ضروري")
    .max(255, "نوع الدواجن ما يزيدش عن 255 حرف"),

  start_date: z
    .string()
    .min(1, "تاريخ البداية ضروري")
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "تاريخ البداية مش صحيح",
    }),

  end_date: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine((val) => {
      if (!val || val === "") return true;
      return !isNaN(Date.parse(val));
    }, {
      message: "تاريخ النهاية مش صحيح",
    }),

  notes: z.string().optional().or(z.literal("")),
}).superRefine((data, ctx) => {
  if (data.end_date && data.start_date) {
    const start = new Date(data.start_date);
    const end = new Date(data.end_date);
    if (end < start) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "تاريخ النهاية ما يكونش قبل تاريخ البداية",
        path: ["end_date"],
      });
    }
  }
});