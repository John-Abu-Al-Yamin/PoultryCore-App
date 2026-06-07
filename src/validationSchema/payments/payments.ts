import { z } from "zod";

export const paymentSchema = z
  .object({
    type: z.string().min(1, "نوع الدفع مطلوب"),
    supplier_id: z.union([z.string(), z.number()]).optional(),
    customer_id: z.union([z.string(), z.number()]).optional(),
    purchase_id: z.union([z.string(), z.number()]).optional(),
    sale_id: z.union([z.string(), z.number()]).optional(),
    amount: z
      .union([z.string(), z.number()])
      .refine(
        (val) => {
          const num = typeof val === "string" ? Number(val) : val;
          return !isNaN(num) && num > 0;
        },
        { message: "المبلغ يجب أن يكون رقمًا أكبر من 0" },
      ),
    payment_date: z.string().min(1, "تاريخ الدفع مطلوب"),
    payment_method: z.string().min(1, "طريقة الدفع مطلوبة"),
    notes: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.type === "to_supplier") {
      if (
        !data.supplier_id ||
        (typeof data.supplier_id === "string" && data.supplier_id.trim() === "")
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["supplier_id"],
          message: "المورد مطلوب",
        });
      }
    }
    if (data.type === "from_customer") {
      if (
        !data.customer_id ||
        (typeof data.customer_id === "string" &&
          data.customer_id.trim() === "")
      ) {
        ctx.addIssue({
          code: "custom",
          path: ["customer_id"],
          message: "العميل مطلوب",
        });
      }
    }
  });
