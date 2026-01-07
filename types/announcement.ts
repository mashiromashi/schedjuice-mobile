import * as z from 'zod';
import { accountSchema } from './user';
export const announcementSchema = z.object({
  id: z.number(),
  title: z.string(),
  data: z.any().describe('Content'),
  json_data: z.any().describe('JSON Content'),
  is_pinned: z.boolean().default(false),
  created_at: z.date(),
  updated_at: z.date(),
  course: z.number().optional(),
  created_by: z.number().optional().or(z.object(accountSchema)),
});

export const announcementCreateSchema = announcementSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  course: true,
  created_by: true,
});

export const announcementUpdateSchema = announcementSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  course: true,
  created_by: true,
});

export type announcemenUpdatetType = z.infer<typeof announcementUpdateSchema>;
export type announcementType = z.infer<typeof announcementSchema>;
