import * as z from "zod";

export const newsSchema = z.object({
  title: z.string().min(1),
  data: z.string().min(1),
});
