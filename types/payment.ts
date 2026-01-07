import * as z from "zod";
import { accountSchema } from "./user";

export enum paymentType {
  lump_sum = "lump_sum",
  split = "split",
}

export const paymentPlanSchema = z.object({
  id: z.number(),
  name: z.string().describe("Name"),
  payment_type: z.nativeEnum(paymentType).describe("Payment Type"),
});

export const paymentPlanCreateSchema = paymentPlanSchema.pick({
  name: true,
  payment_type: true,

});

export const paymentTermSchema = z.object({
  id: z.number(),
  amount: z.number(),
  commencement_date: z.coerce.date(),
  expiry_date: z.coerce.date(),
  payment_plan: z.number().or(paymentPlanSchema),
});

export const paymentTermCreateSchema = z.object({
  amount: z.coerce.number().describe("Amount (MMK)"),
  commencement_date: z.coerce.date().describe("Commencement Date"),
  expiry_date: z.coerce.date().describe("Expiry Date"),
});

export const paymentTermArraySchema = z.object({
  dummy: z.string().nullable().optional(),
  terms: z.array(paymentTermCreateSchema),
});

export const paymentMethodSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional().nullable(),
  public_view: z.string().optional().nullable().describe("Public-side view"),
  created_by: z.number().or(accountSchema),
});
export const paymentMethodCreateSchema = paymentMethodSchema.pick({
  name: true,
  description: true,
  public_view: true,
});

export enum paymentStatus {
  pending = "pending",
  paid = "paid",
  verified = "verified",
  overdue = "overdue",
}
export enum reminderStatus {
  pending = "pending",
  first_sent = "first_sent",
  second_sent = "second_sent",
  final_sent = "final_sent",
}

export const userPaymentSchema = z.object({
  id: z.number(),
  payment_status: z.nativeEnum(paymentStatus),
  amount_paid: z.number().optional().nullable(),
  reminder_status: z.nativeEnum(reminderStatus),
  transaction_id: z.string().optional().nullable(),
  payment_date: z.coerce.date().optional().nullable(),
  verified_date: z.coerce.date().optional().nullable(),
  payment_method: z.number().or(paymentMethodSchema),
  discount: z.coerce.number().gt(0).lte(100).optional().nullable().describe("Discount (%)"),
  user: z.number().or(accountSchema),
  payment_term: z.number().or(paymentTermSchema),
  verified_by: z.number().or(accountSchema).optional().nullable(),
  payment_screenshot: z.string().optional().nullable(),
  user_course: z.number().optional().nullable(),
  parent_payment: z.number().optional().nullable(),
});

export const userPaymentManualCreateSchema = z.object({
  amount_paid: z.coerce.number().describe("Amount Paid (MMK)"),
  payment_date: z.coerce.date().describe("Payment Date"),
  payment_method: z.coerce.number({invalid_type_error: "This field is required"}).describe("Payment Method"),
  transaction_id: z.string().optional().nullable().describe("Transaction ID"),
  payment_screenshot: z.any().describe("Payment Screenshot"),
})

export const userPaymentInfoEditSchema = userPaymentSchema.pick({
  discount: true,
})