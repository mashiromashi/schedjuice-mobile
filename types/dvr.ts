import * as z from "zod"
import { role } from "./user";

export enum DataVerificationRequestStatus {
  PENDING = "pending",
  AWAITING_VERIFICATION = "awaiting_verification",
  VERIFIED = "verified",
  REJECTED = "rejected",
}

export const dataVerificationRequestSchema = z.object({
  id: z.number(),
  name: z.string(),
  fields: z.any(),
  requested_user_types: z.any(),
  created_by: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export const dvrCreateSchema = dataVerificationRequestSchema.pick({
  name: true,
  fields: true,
  requested_user_types: true,
});
