// @ts-nocheck
// we are not getting any fucking type safety because of some ts shits
import * as z from 'zod';
import { accountSchema } from './user';

export enum assignedAsEnum {
  teacher = 'teacher',
  student = 'student',
}

const assignedAsRoleSchema = z.object({
  id: z.number(),
  name: z.string().max(256),
  is_collision_enabled: z.boolean().default(true).describe('Enable Event Collision'),
});

const assignedAsRoleCreateSchema = assignedAsRoleSchema.omit({
  id: true,
});

const userCoursesSchema = z.object({
  user: z.number(),
  course: z.lazy(() => courseSchema.partial().or(z.number())),
  assigned_as: z.nativeEnum(assignedAsEnum),
});

const categorySchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string().optional(),
});
const categoryCreateUpdateSchema = categorySchema.omit({
  id: true,
});
export type categoryType = z.infer<typeof categorySchema>;

export enum courseStatus {
  planned = 'planned',
  active = 'active',
  ended = 'ended',
}

const courseSchema = z.object({
  id: z.number(),
  title: z.string().min(3),
  status: z.nativeEnum(courseStatus),
  code: z.string().nullable().optional().describe('Course ID'),
  description: z.string().min(3),
  start_date: z.coerce.date().describe('Start date'),
  end_date: z.coerce.date().describe('End date'),
  batch_number: z.coerce.number().gt(0).optional().nullable().describe('Batch number'),
  user_courses: z.lazy(() => z.array(userCoursesSchema.partial())),
  category: z.number().or(z.object(categorySchema)),
  payment_plans: z.array(z.number()).optional().nullable(),
  default_daily_note: z.any().optional().nullable(),
  is_join_code_enabled: z.boolean().default(true),
  repeat_every: z.array(z.string()).optional().nullable(),
  is_recurring: z.boolean().optional().nullable(),
  is_close_on_sabbath: z.boolean().optional().nullable(),
  student_count: z.number().optional().nullable(),
  teacher_count: z.number().optional().nullable(),
});

export enum completionType {
  completed = 'completed',
  dropped = 'dropped',
  failed = 'failed',
}

export const courseHistorySchema = z.object({
  id: z.number(),

  course: courseSchema,
  user: accountSchema,
  created_by: accountSchema,
  completion_type: z.nativeEnum(completionType).optional().nullable(),
});

export const courseHistoryCreateSchema = z.object({
  course: z.number(),
  user: z.number(),
  completion_type: z.nativeEnum(completionType).describe('Completion Status'),
});

export const eventSchema = z.object({
  id: z.number() | z.string(),
  title: z.string(),
  date: z.date(),
  time_from: z.string(),
  time_to: z.string(),
  is_edit: z.boolean().optional(),
  is_delete: z.boolean().optional(),
  course: courseSchema,
});

export const eventCreateSchema = eventSchema.pick({
  title: true,
  date: true,
  time_from: true,
  time_to: true,
});

export type eventType = typeof eventSchema._type;

export const dailyNoteSchema = z.object({
  id: z.number(),
  note: z.any(),
  event: eventSchema,
});

export type courseType = z.infer<typeof courseSchema>;
const partiallyOmittedCourseSchema = courseSchema.omit({
  id: true,
  user_courses: true,
  payment_plan: true,
  status: true,
  payment_plans: true,
  default_daily_note: true,
  repeat_every: true,
  is_recurring: true,
  is_close_on_sabbath: true,
  is_join_code_enabled: true,
});
export { partiallyOmittedCourseSchema };
export {
  courseSchema,
  userCoursesSchema,
  categorySchema,
  categoryCreateUpdateSchema,
  assignedAsRoleSchema,
  assignedAsRoleCreateSchema,
};
export type assignedAsRoleType = z.infer<typeof assignedAsRoleSchema>;
// class includes students, teachers, etc.
// course includes classes
// classe are just a collection of students and teachers
// how about exams? will the course have the schedule or the class? The class can have schedule, but, tied to course?
// course will just have lesson outlines
// class will have schedule
// classes can have courses within a certain timeframe
// go fuck yourself ^

export enum courseJoinRequestStatus {
  pending = 'pending',
  approved = 'approved',
  rejected = 'rejected',
}
export type courseJoinRequestType = {
  id: number;
  course: number;
  user: number;
  status: courseJoinRequestStatus;
  created_at: string;
  updated_at: string;
};

export type UserCourse = {
  id: number;
  user: number;
  course: courseType;
  assigned_as: assignedAsEnum;
};
