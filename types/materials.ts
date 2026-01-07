import * as z from 'zod';

export const pickerAssetSchema = z.object({
  uri: z.string(),
  name: z.string(),
  size: z.number().nullable().optional(),
  mimeType: z.string().nullable().optional(),
  lastModified: z.number().nullable().optional(),
  file: z.any().optional(), // whatever else DocumentPicker returns
});

export const MaterialSchema = z.object({
  type: z.literal('file'),
  id: z.uuid(),
  title: z.string().min(2).max(100),
  description: z.string().min(2).max(500),
  files: z.array(pickerAssetSchema),
  url: z.never(),
  course: z.number(),
  created_at: z.date(),
  updated_at: z.date(),
});

export type Material = z.infer<typeof MaterialSchema>;

export const createMaterialSchema = MaterialSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
});
