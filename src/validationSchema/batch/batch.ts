import { z } from "zod";

export const batchSchema = z.object({
  barn_id: z
    .union([z.string(), z.number()])
    .refine((val) => {
      const num = Number(val);
      return Number.isInteger(num) && num > 0;
    }, {
      message: "معرّف العنبر مطلوب ويجب أن يكون رقمًا صحيحًا",
    }),

  poultry_type: z
    .string()
    .min(1, "نوع الدواجن مطلوب")
    .max(255, "نوع الدواجن يجب ألا يزيد عن 255 حرف"),

  initial_quantity: z
    .union([z.string(), z.number()])
    .refine((val) => {
      const num = Number(val);
      return Number.isInteger(num) && num >= 1;
    }, {
      message: "الكمية الابتدائية يجب أن تكون رقمًا صحيحًا وأكبر من 0",
    }),

  start_date: z
    .string()
    .min(1, "تاريخ البداية مطلوب")
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "تاريخ البداية غير صحيح",
    }),

  end_date: z
    .string()
    .optional()
    .or(z.literal(""))
    .refine((val) => {
      if (!val || val === "") return true;
      return !isNaN(Date.parse(val));
    }, {
      message: "تاريخ النهاية غير صحيح",
    }),

  notes: z.string().optional().or(z.literal("")),
});