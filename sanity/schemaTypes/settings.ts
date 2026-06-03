import { defineType, defineField } from 'sanity';

export const settings = defineType({
  name: 'settings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({ name: 'tickerMachines', type: 'number', initialValue: 1247 }),
    defineField({ name: 'tickerLabelsToday', type: 'number', initialValue: 8200000 }),
    defineField({ name: 'tickerUptime', type: 'string', initialValue: '99.4%' }),
    defineField({ name: 'tickerFactories', type: 'number', initialValue: 340 }),
    defineField({ name: 'whatsappNumber', type: 'string', initialValue: '60123456789' }),
    defineField({ name: 'midaApproved', type: 'boolean', initialValue: true }),
    defineField({ name: 'heroVideoUrl', type: 'url' }),
  ],
});
