import { z } from "zod";

export const purchaseSchema = z.object({
  supplier_id: z
    .union([z.string(), z.number()])
    .refine((val) => {
      const num = Number(val);
      return Number.isInteger(num) && num > 0;
    }, { message: "المورد مطلوب" }),

  batch_id: z
    .union([z.string(), z.number()])
    .refine((val) => {
      const num = Number(val);
      return Number.isInteger(num) && num > 0;
    }, { message: "الدفعة مطلوبة" }),

  item_name: z
    .string()
    .min(1, "اسم الصنف مطلوب")
    .max(255, "اسم الصنف يجب ألا يزيد عن 255 حرف"),

  quantity: z
    .union([z.string(), z.number()])
    .refine((val) => {
      const num = Number(val);
      return !isNaN(num) && num > 0;
    }, { message: "الكمية مطلوبة ويجب أن تكون أكبر من 0" }),

  unit_price: z
    .union([z.string(), z.number()])
    .refine((val) => {
      const num = Number(val);
      return !isNaN(num) && num >= 0;
    }, { message: "سعر الوحدة مطلوب" }),

  purchase_date: z
    .string()
    .min(1, "تاريخ الشراء مطلوب")
    .refine((val) => !isNaN(Date.parse(val)), {
      message: "تاريخ الشراء غير صحيح",
    }),

  payment_type: z
    .string()
    .min(1, "نوع الدفع مطلوب"),
});
