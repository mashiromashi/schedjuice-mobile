import * as z from 'zod';
import { visibilitySchema } from './visibility';

export const passwordRegex = RegExp(
  '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$'
);
export const passwordRegexMessage =
  'Password must has at leasat 8 charaters, contains one number, one lowercase letter, one uppercase letter and one special character.';

export enum role {
  superadmin = 'superadmin',
  admin = 'admin',
  manager = 'manager',
  teacher = 'teacher',
  student = 'student',
}

export enum gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  NON_BINARY = 'NON_BINARY',
  OTHER = 'OTHER',
}
const roleEnum = z.enum(role);
const genderEnum = z.enum(gender);
export enum viewMode {
  table = 'table',
  card = 'card',
}
export const userSettingsSchema = z.object({
  default_view_mode: z.enum(viewMode).describe('Default View Mode'),
});
export const tempSchema = z.object({
  id: z.number(),
  code: z.string().optional().describe('User ID'),
  email: z.email(),
  communication_email: z.email(),
  profile_image: z.string().optional().nullable(),
  cover_image: z.string().optional().nullable(),

  password: z.string(),
  name: z.string().max(500),
  alternative_name: z.string().max(500).optional(),
  roles: z.array(roleEnum),
  gender: genderEnum,
  date_of_birth: z.coerce.date().describe('Date of birth'),
  phone_number: z.string().describe('Phone number'),

  facebook_account_link: z.url().optional().nullable().describe('Facebook Account Link'),

  house_number: z.string().max(500),
  street: z.string().max(500),
  country: z.string().max(500),
  region: z.string().max(500),
  city: z.string().max(500),
  township: z.string().max(500),
  is_password_change_required: z.boolean(),
  visibility: z.number().optional(),

  emergency_contact_name: z.string().max(500).optional().describe('Emergency contact name'),
  emergency_contact_phone_number: z
    .string()
    .max(500)
    .optional()
    .describe('Emergency contact phone number'),
  emergency_contact_relationship: z
    .string()
    .max(500)
    .optional()
    .describe('Emergency contact relationship'),
});
const accountSchema = tempSchema.and(userSettingsSchema);

export const dvrFieldSchema = tempSchema.pick({
  communication_email: true,
  alternative_name: true,
  date_of_birth: true,
  phone_number: true,
  house_number: true,
  street: true,
  township: true,
  city: true,
  region: true,
  country: true,
});

export const accountVisibilitySchema = tempSchema.pick({
  code: true,
  communication_email: true,
  alternative_name: true,
  roles: true,
  gender: true,
  date_of_birth: true,
  phone_number: true,
  house_number: true,
  street: true,
  township: true,
  city: true,
  region: true,
  country: true,
  facebook_account_link: true,
  emergency_contact_name: true,
  emergency_contact_phone_number: true,
  emergency_contact_relationship: true,
});

const accountCreateSchema = z.object({
  name: z.string(),
  alternative_name: z.string().max(500).optional(),
  email: z.email(),
  code: z.string().nullable().optional().describe('User ID'),

  communication_email: z.email().describe('Communication Email'),
  gender: genderEnum,

  date_of_birth: z.coerce.date().describe('Date of birth'),

  phone_number: z.string().describe('Phone number'),

  facebook_account_link: z.url().optional().nullable().describe('Facebook Account Link'),

  house_number: z.string().max(500),
  street: z.string().max(500),
  country: z.string().max(500),
  region: z.string().max(500),
  city: z.string().max(500),
  township: z.string().max(500),
  roles: z.any(),
});
const accountBulkCreateSchema = tempSchema.pick({
  email: true,
  communication_email: true,
  name: true,
  alternative_name: true,
  gender: true,
  date_of_birth: true,
  phone_number: true,
  house_number: true,
  street: true,
  township: true,
  city: true,
  region: true,
  country: true,
  facebook_account_link: true,
});
export const emergencyContactSchema = tempSchema.pick({
  emergency_contact_name: true,
  emergency_contact_phone_number: true,
  emergency_contact_relationship: true,
});

const accountBulkCreatePartialSchema = z.object({
  roles: z.any(),
});

export type accountType = z.output<typeof accountSchema>;
const accountEditSchema = z.object({
  email: z.email(),
  communication_email: z.email(),
  code: z.string().nullable().optional().describe('User ID'),

  phone_number: z.string().describe('Phone number'),
  name: z.string(),
  alternative_name: z.string().max(500).optional(),
  gender: genderEnum,
  date_of_birth: z.coerce.date().describe('Date of birth'),
  roles: z.any(),

  facebook_account_link: z.string().url().optional().nullable().describe('Facebook Account Link'),

  house_number: z.string().max(500),
  street: z.string().max(500),
  country: z.string().max(500),
  region: z.string().max(500),
  city: z.string().max(500),
  township: z.string().max(500),
});

export {
  accountSchema,
  accountEditSchema,
  accountCreateSchema,
  accountBulkCreateSchema,
  accountBulkCreatePartialSchema,
};
