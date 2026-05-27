import { z } from 'zod'

export const ChapterIdSchema = z.enum([
  'chapter-01-ai',
  'chapter-02-startup',
  'chapter-03-vc',
  'chapter-04-bigtech',
  'chapter-05-crypto',
  'chapter-06-social',
  'chapter-07-gig',
  'chapter-08-hardware',
  'chapter-09-future',
  'chapter-endless',
])

export type ChapterId = z.infer<typeof ChapterIdSchema>

export const TimelineEventSchema = z.object({
  name: z.string().max(200),
  year: z.string().regex(/^\d{4}$/),
  desc: z.string().max(500),
  color: z.string().max(100),
})

export const ChapterDataSchema = z.object({
  id: ChapterIdSchema,
  title: z.string().max(200),
  content: z.string().max(50000),
})

export function validateChapterId(id: string): ChapterId | null {
  const result = ChapterIdSchema.safeParse(id)
  return result.success ? result.data : null
}
