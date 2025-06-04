import { z } from 'zod';

export const chapterValidationSchema = z.object({
  subject: z.string().trim().min(1, 'Subject is required'),
  chapter: z.string().trim().min(1, 'Chapter name is required'),
  class: z.string().trim().min(1, 'Class is required'),
  unit: z.string().trim().min(1, 'Unit is required'),
  yearWiseQuestionCount: z.record(z.string(), z.number().int().min(0, 'Question count must be at least 0')),
  questionSolved: z.number().int().min(0, 'Questions solved must be at least 0').default(0),
  status: z.enum(['Completed', 'In Progress', 'Not Started']).default('Not Started'),
  isWeakChapter: z.boolean().default(false)
});

export const chapterQuerySchema = z.object({
  class: z.string().optional(),
  unit: z.string().optional(),
  status: z.enum(['Completed', 'In Progress', 'Not Started']).optional(),
  isWeakChapter: z.enum(['true', 'false']).optional(),
  subject: z.string().optional(),
  page: z.string().regex(/^\d+$/, 'Page must be a number').default('1'),
  limit: z.string().regex(/^\d+$/, 'Limit must be a number').default('10')
});

export const chapterParamsSchema = z.object({
  id: z.string().regex(/^[a-fA-F0-9]{24}$/, 'Invalid MongoDB ObjectId format')
});

export const uploadChaptersBodySchema = z.object({
  chapters: z.array(chapterValidationSchema).optional()
});

export type ChapterInput = z.infer<typeof chapterValidationSchema>;
export type ChapterQueryInput = z.infer<typeof chapterQuerySchema>;
export type ChapterParamsInput = z.infer<typeof chapterParamsSchema>;
export type UploadChaptersBodyInput = z.infer<typeof uploadChaptersBodySchema>;
