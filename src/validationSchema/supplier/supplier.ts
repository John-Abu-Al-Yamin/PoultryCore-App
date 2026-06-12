import { z } from "zod";

export const supplierSchema = z.object({
  name: z
    .string()
    .min(1, "اسم المورد ضروري")
    .max(255, "اسم المورد ما يزيدش عن 255 حرف"),

  phone: z
    .string()
    .min(1, "رقم التليفون ضروري")
    .regex(/^01[0-2,5]{1}[0-9]{8}$/, "رقم تليفون مصري مش صحيح"),

  address: z
    .string()
    .max(255, "العنوان ما يزيدش عن 255 حرف")
    .optional()
    .or(z.literal("")),
});