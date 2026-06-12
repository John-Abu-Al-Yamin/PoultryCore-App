import { z } from "zod";

export const purchaseSchema = z.object({
  supplier_id: z
    .union([z.string(), z.number()])
    .refine((val) => {
      const num = Number(val);
      return Number.isInteger(num) && num > 0;
    }, { message: "المورد ضروري" }),

  type: z.enum(['chicks', 'feed', 'medicine', 'other'], {
    errorMap: () => ({ message: "نوع المشتريات ضروري" }),
  }),

  batch_id: z
    .union([z.string(), z.number()])
    .refine((val) => {
      const num = Number(val);
      return Number.isInteger(num) && num > 0;
    }, { message: "الدفعة ضرورية" }),

  item_name: z
    .string()
    .min(1, "اسم الصنف ضروري")
    .max(255, "اسم الصنف ما يزيدش عن 255 حرف"),

  quantity: z
    .union([z.string(), z.number()])
    .refine((val) => {
      const num = Number(val);
      return !isNaN(num) && num > 0;
    }, { message: "الكمية ضرورية ولازم تكون أكبر من 0" }),

  unit_price: z
    .union([z.string(), z.number()])
    .refine((val) => {
      const num = Number(val);
      return !isNaN(num) && num >= 0;
    }, { message: "سعر الوحدة ضروري" }),

  purchase_date: z
    .string()
    .min(1, "تاريخ الشراء ضروري")
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "تاريخ الشراء مش صحيح",
    }),

  payment_type: z
    .string()
    .min(1, "نوع الدفع ضروري"),
});
