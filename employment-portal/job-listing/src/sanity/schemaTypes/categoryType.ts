import { TagIcon } from '@sanity/icons';
import { defineField, defineType } from 'sanity';

export const categoryType = defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({
      name: 'category',
      title: 'Job Category',
      type: 'string',
      options: {
        list: [
          { title: 'IT & Software', value: 'It & Software' },
          { title: 'Finance', value: 'Finance' },
          { title: 'Marketing', value: 'Marketing' },
          { title: 'HR', value: 'Hr' },
          { title: 'Government', value: 'Government' },
          { title: 'Design', value: 'Design' },
          { title: 'Data Entry', value: 'Data Entry' },
          {
            title: 'Production & Manufacturing',
            value: 'Production & Manufacturing',
          },
        ],
      },
    }),
  ],
});
