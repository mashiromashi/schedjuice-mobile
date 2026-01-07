import * as z from "zod";
export enum quizScopes {
  // public="public",
  organization = "organization",
  course = "course",
}
export enum quizStatus {
  open = "open",
  closed = "closed",
}

export const quizCategorySchema = z.object({
  id: z.string(),
  title: z.string(),
});

export enum questionType {
  SINGLE_CHOICE = "SINGLE_CHOICE",
  MULTIPLE_CHOICE = "MULTIPLE_CHOICE",
  SHORT_ANSWER = "SHORT_ANSWER",
  // FILE_UPLOAD = "FILE_UPLOAD",
}

export const baseQuestionSchema = z.object({
  id: z.string(),
  body: z.any(),
  body_snippet: z.string().optional(),
  available_score: z.number(),
  user_score: z.number().optional(),
  category: z.string(),

  type: z.nativeEnum(questionType),
});

export const optionSchema = z.object({
  id: z.string(),
  body: z.string(),
  isCorrect: z.boolean(),
});

export type optionType = z.infer<typeof optionSchema>;
export const singleChoiceQuestionSchema = baseQuestionSchema.extend({
  type: z.literal(questionType.SINGLE_CHOICE),
  options: z.array(optionSchema),
});
export type singleChoiceQuestionType = z.infer<
  typeof singleChoiceQuestionSchema
>;

export const multipleChoiceQuestionSchema = baseQuestionSchema.extend({
  type: z.literal(questionType.MULTIPLE_CHOICE),
  options: z.array(optionSchema),
  scorePerCorrect: z.number().min(1).default(1).optional(),
  scorePerIncorrect: z.number().max(0).default(0).optional(),
  isPartiallyMarked: z.boolean().default(false),
});

export type multipleChoiceQuestionType = z.infer<
  typeof multipleChoiceQuestionSchema
>;

export const possibleAnswerSchema = z.object({
  id: z.string(),
  value: z.string(),
  isTrimWhiteSpace: z.boolean().default(false),
  isCaseSensitive: z.boolean().default(false),
});

export type possibleAnswerType = z.infer<typeof possibleAnswerSchema>;

export const shortAnswerQuestionSchema = baseQuestionSchema.extend({
  type: z.literal(questionType.SHORT_ANSWER),
  isEssay: z.boolean().default(false),

  possibleAnswers: z.array(possibleAnswerSchema),
});

export type shortAnswerQuestionType = z.infer<typeof shortAnswerQuestionSchema>;

// export const fileUploadQuestionSchema = baseQuestionSchema.extend({
//   type: z.literal(questionType.FILE_UPLOAD),
//   body: z.any(),
//   src: z.string(),
// });

export const questionSchema = z.discriminatedUnion("type", [
  singleChoiceQuestionSchema,
  multipleChoiceQuestionSchema,
  shortAnswerQuestionSchema,
  // fileUploadQuestionSchema,
]);

export enum gradingUnit {
  percentage = "percentage",
  points = "points",
}

export const quizSchema = z.object({
  id: z.number(),
  title: z.string(),
  status: z.nativeEnum(quizStatus),
  code: z.string(),

  category: z.number(),
  scope: z.nativeEnum(quizScopes),
  course: z.number().optional(),

  questions: z.array(questionSchema),
  version: z.number(),
  quiz_categories: z
    .array(quizCategorySchema)
    .default([{ id: "default", title: "default" }]),
  can_show_answers_afterwards: z.boolean().describe("Show answers after quiz"),
  max_retakes: z.number().describe("Maximum retakes allowed"),
  allowed_minutes: z.coerce.number().default(60).describe("Allowed minutes"),
  activation_date: z.coerce.date().optional().describe("Activation date"),
  is_scheduled_activation: z
    .boolean()
    .optional()
    .describe("Schedule quiz activation"),
  expiry_date: z.coerce.date().optional().describe("Expiry date"),
  is_scheduled_expiry: z.boolean().optional().describe("Schedule quiz expiry"),
  results_release_date: z.coerce
    .date()
    .optional()
    .describe("Results release date"),
  is_scheduled_results_release: z
    .boolean()
    .optional()
    .describe("Schedule result release"),
  grading_config: z
    .object({
      grading_unit: z.nativeEnum(gradingUnit).optional(),
      is_pass_mark_enabled: z.boolean().default(false),
      pass_value: z.number().optional(),
      grades: z.array(
        z.object({
          title: z.string(),
          description: z.string().optional(),
          minimum: z.number(),
          maximum: z.number(),
        })
      ),
    })
    .optional(),
});
export type quizType = z.infer<typeof quizSchema>;

export const quizCreateSchema = quizSchema.omit({
  id: true,
  code: true,
  status: true,
  version: true,
  quiz_categories: true,
  questions: true,
  can_show_answers_afterwards: true,
  max_retakes: true,
  activation_date: true,
  is_scheduled_activation: true,
  expiry_date: true,
  is_scheduled_expiry: true,
  results_release_date: true,
  is_scheduled_results_release: true,
  allowed_minutes: true,
  grading_config: true,
});

export const quizSettingsSchema = quizSchema.pick({
  can_show_answers_afterwards: true,
  max_retakes: true,
  is_scheduled_activation: true,
  activation_date: true,
  is_scheduled_expiry: true,
  expiry_date: true,
  is_scheduled_results_release: true,
  results_release_date: true,
});
export const answerItemSchema = z.object({
  answer: z.string(),
  isCorrect: z.boolean().optional(),
  score: z.number().optional(),
  feedback: z.string().optional(),
  is_graded: z.boolean().optional(),
});

// key is questionId, value is answer content
export const answerSchema = z.record(
  z.string(),
  answerItemSchema.and(z.array(answerItemSchema))
);

export const answerModelSchema = z.object({
  is_graded: z.boolean().default(false),
  are_results_released: z.boolean().default(false),
  json_data: answerSchema,
  quiz: quizSchema,
  created_by: z.number(),
});
