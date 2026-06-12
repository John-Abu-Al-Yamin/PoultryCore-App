import { z } from "zod";

export const barnSchema = z.object({
  name: z
    .string()
    .min(1, "اسم العنبر ضروري")
    .max(255, "اسم العنبر ما يزيدش عن 255 حرف"),

  location: z
    .string()
    .max(255, "موقع العنبر ما يزيدش عن 255 حرف")
    .optional()
    .or(z.literal("")),

  capacity: z.union([z.string(), z.number()]).refine(
    (val) => {
      if (val === "") return false;

      const num = Number(val);

      return Number.isInteger(num) && num > 0;
    },
    {
      message: "سعة العنبر لازم تكون رقم صحيح أكبر من 0",
    },
  ),

  notes: z.string().optional().or(z.literal("")),
});
