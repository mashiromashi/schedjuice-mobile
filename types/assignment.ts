import * as z from 'zod';

export enum assignmentStatus {
  available_to_submit = 'Available To Submit',
  /**
   * Everyone should have been submitted and due date is reached
   */
  ready_to_be_graded = 'Ready To Be Graded',
  require_resubmission = 'Require Resubmission',
  submitted = 'Submitted',
  overdue = 'Overdue',
  locked = 'Locked',
  graded = 'Graded',
}

export const submissionSchema = z.object({
  id: z.number(),
  description: z.any().optional(),
  attempt_count: z.number().describe('Attempt count'),
  is_submitted: z.boolean().describe('Submission status'),
  is_graded: z.boolean().describe('Grading Status'),
  user_score: z.number().describe('User score'),
  created_at: z.date(),
  updated_at: z.date(),
  assignment: z.number(),
  created_by: z.any(),
});

export const submissionCreateSchema = submissionSchema.omit({
  id: true,
  created_at: true,
  updated_at: true,
  assignment: true,
  created_by: true,
});

export const assignmentSchema = z.object({
  id: z.number(),
  title: z.string(),
  course: z.number(),
  available_datetime: z.date().describe('Available date'),
  due_datetime: z.date().describe('Due date'),
  available_score: z.coerce.number().describe('Max points'),
  max_attempts: z.coerce.number().gt(0).describe('Max attempts'),
  submissions: z.array(submissionSchema),
  instructions: z.any().optional().describe('Instructions'),
  created_at: z.date(),
  updated_at: z.date(),
});

export const assignmentCreateSchema = assignmentSchema.omit({
  id: true,
  course: true,
  created_at: true,
  updated_at: true,
  submissions: true,
});

export const assignmentUpdateSchema = assignmentSchema.omit({
  course: true,
  created_at: true,
  updated_at: true,
  submissions: true,
});

export type assignmentUpdateType = z.infer<typeof assignmentUpdateSchema>;
export type assignmentCreateType = z.infer<typeof assignmentCreateSchema>;
export type assignmentType = z.infer<typeof assignmentSchema>;

export type submissionType = z.infer<typeof submissionSchema>;
