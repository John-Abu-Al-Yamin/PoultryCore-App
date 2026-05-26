import { z } from "zod";

export const barnSchema = z.object({
  name: z
    .string()
    .min(1, "اسم العنبر مطلوب")
    .max(255, "اسم العنبر لا يمكن أن يتجاوز 255 حرفًا"),

  location: z
    .string()
    .max(255, "موقع العنبر لا يمكن أن يتجاوز 255 حرفًا")
    .optional()
    .or(z.literal("")),

  capacity: z.union([z.string(), z.number()]).refine(
    (val) => {
      if (val === "") return false;

      const num = Number(val);

      return Number.isInteger(num) && num > 0;
    },
    {
      message: "سعة العنبر يجب أن تكون رقمًا صحيحًا أكبر من 0",
    },
  ),

  notes: z.string().optional().or(z.literal("")),
});
