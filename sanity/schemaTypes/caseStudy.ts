import { defineType, defineField } from 'sanity';

export const caseStudy = defineType({
  name: 'caseStudy',
  title: 'Case Study',
  type: 'document',
  fields: [
    defineField({ name: 'title', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'title' }, validation: (r) => r.required() }),
    defineField({ name: 'customer', type: 'string' }),
    defineField({ name: 'industry', type: 'string' }),
    defineField({ name: 'hero', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'summary', type: 'text', rows: 3 }),
    defineField({
      name: 'outcomes',
      type: 'array',
      of: [
        defineField({
          name: 'outcome',
          type: 'object',
          fields: [
            { name: 'metric', type: 'string' },
            { name: 'value', type: 'string' },
          ],
        } as any),
      ],
    }),
    defineField({ name: 'pullQuote', type: 'text', rows: 2 }),
    defineField({ name: 'attribution', type: 'string' }),
    defineField({
      name: 'body',
      type: 'array',
      of: [{ type: 'block' }, { type: 'image', options: { hotspot: true } }],
    }),
    defineField({ name: 'machineUsed', type: 'reference', to: [{ type: 'product' }] }),
    defineField({ name: 'publishedAt', type: 'datetime' }),
  ],
  preview: { select: { title: 'title', subtitle: 'customer', media: 'hero' } },
});
