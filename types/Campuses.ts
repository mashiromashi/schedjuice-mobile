import * as z from "zod";

export const CampusCreateEditSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  location: z.string().optional().nullable(),
  is_online: z.boolean().default(false),
  is_default: z.boolean().default(false),
});

export type CampusType = z.infer<typeof CampusCreateEditSchema>;
