import { defineType, defineField } from 'sanity';

export const product = defineType({
  name: 'product',
  title: 'Product',
  type: 'document',
  fields: [
    defineField({ name: 'name', type: 'string', validation: (r) => r.required() }),
    defineField({ name: 'slug', type: 'slug', options: { source: 'name' }, validation: (r) => r.required() }),
    defineField({
      name: 'category',
      type: 'string',
      options: { list: ['labelling', 'packaging', 'automation'] },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'featured', type: 'boolean', initialValue: false }),
    defineField({ name: 'image', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'gallery', type: 'array', of: [{ type: 'image', options: { hotspot: true } }] }),
    defineField({ name: 'model3d', type: 'file', description: 'GLTF / GLB file' }),
    defineField({ name: 'speed', type: 'number', description: 'Max units/min' }),
    defineField({ name: 'monthlyPrice', type: 'number', description: 'From price RM/month' }),
    defineField({ name: 'summary', type: 'text', rows: 3 }),
    defineField({
      name: 'body',
      type: 'array',
      of: [{ type: 'block' }, { type: 'image' }],
    }),
    defineField({
      name: 'specs',
      type: 'array',
      of: [
        defineField({
          name: 'spec',
          type: 'object',
          fields: [
            { name: 'label', type: 'string' },
            { name: 'value', type: 'string' },
            { name: 'unit', type: 'string' },
          ],
        } as any),
      ],
    }),
    defineField({
      name: 'features',
      type: 'array',
      of: [
        defineField({
          name: 'feature',
          type: 'object',
          fields: [
            { name: 'icon', type: 'string' },
            { name: 'title', type: 'string' },
            { name: 'body', type: 'text', rows: 2 },
          ],
        } as any),
      ],
    }),
    defineField({
      name: 'faq',
      type: 'array',
      of: [
        defineField({
          name: 'qa',
          type: 'object',
          fields: [
            { name: 'q', type: 'string' },
            { name: 'a', type: 'text' },
          ],
        } as any),
      ],
    }),
    defineField({
      name: 'relatedCaseStudies',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'caseStudy' }] }],
    }),
    defineField({
      name: 'specSheetPdf',
      type: 'file',
      description: 'Lead-gated PDF spec sheet',
    }),
  ],
  preview: {
    select: { title: 'name', subtitle: 'category', media: 'image' },
  },
});
