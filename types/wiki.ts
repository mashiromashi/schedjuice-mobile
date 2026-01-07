import { courseType } from "./course";
import { accountType } from "./user";
import * as z from "zod";

export enum itemTypeEnum {
  content = "content",
  link = "link",
  file = "file",
}

export type ItemType = {
  id: number;
  name: string;
  code: string;
  content?: string;
  url?: string;
  item_type: itemTypeEnum;
  is_folder: boolean;
  data?: File | string;
  parent: number | ItemType | null | undefined;
  course: number | courseType;
  created_by: number | accountType;
  created_at: string | Date;
  updated_at: string | Date;
};

export const linkFormSchema = z.object({
  name: z.string().describe("Name"),
  url: z.string().url().describe("URL"),
});
