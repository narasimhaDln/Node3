import { DocumentTextIcon } from '@sanity/icons';

import { defineField, defineType } from 'sanity';

export const jobType = defineType({
  name: 'jobs',
  title: 'Jobs',
  type: 'document',
  icon: DocumentTextIcon,
  fields: [
    defineField({
      name: 'title',
      title: 'Job Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'companyName',
      title: 'Company Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        slugify: (input) => {
          const uniqueId = Math.random().toString(36).slice(2, 6); // random 6 chars
          return `${input.toLowerCase().replace(/\s+/g, '-')}-${uniqueId}`;
        },
      },
    }),
    defineField({
      name: 'experience',
      title: 'Experience Required',
      type: 'string',
      options: {
        list:[
          { title: 'Fresher', value: 'Fresher'},
          { title: '1-2 Years', value: '1-2 Years'},
          { title: '2-3 Years', value: '2-3 Years' },
          { title: '3-5 Years', value: '3-5 Years' },
          { title: '5-8 Years', value: '5-8 Years' },
          { title: '8+ Years', value: '8+ Years'},
        ],
        layout: 'dropdown',
      },
    }),
    defineField({
      name: 'location',
      title: 'Job Location',
      type: 'array',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Bangalore, India', value: 'Bangalore, India' },
          { title: 'Hyderabad, India', value: 'Hyderabad, India' },
          { title: 'Mumbai, India', value: 'Mumbai, India' },
          { title: 'Delhi NCR, India', value: 'Delhi NCR, India' },
          { title: 'Chennai, India', value: 'Chennai, India' },
          { title: 'Pune, India', value: 'Pune, India' },
          { title: 'Kolkata, India', value: 'Kolkata, India' },
          { title: 'Ahmedabad, India', value: 'Ahmedabad, India' },
          { title: 'Jaipur, India', value: 'Jaipur, India' },
          { title: 'Lucknow, India', value: 'Lucknow, India' },
          { title: 'Chandigarh, India', value: 'Chandigarh, India' },
          { title: 'Coimbatore, India', value: 'Coimbatore, India' },
          { title: 'Indore, India', value: 'Indore, India' },
          { title: 'Nagpur, India', value: 'Nagpur, India' },
          { title: 'Surat, India', value: 'Surat, India' },
          { title: 'Noida, India', value: 'Noida, India' },
          { title: 'Gurugram, India', value: 'Gurugram, India' },
        ],
        layout: 'list',
      },
    }),
    defineField({
      name: 'noticePeriod',
      title: 'Notice Period',
      type: 'string',
      options: {
        list: [
          { title: '15 Days or less', value: '15 Days or less' },
          { title: '1 Month', value: '1 Month' },
          { title: '2 Months', value: '2 Months' },
          { title: '3 Months', value: '3 Months' },
          { title: 'More than 3 Months', value: 'More than 3 Months' },
        ],
        layout: 'dropdown',
      },
    }),
    defineField({
      name: 'salary',
      title: 'Salary',
      type: 'string',
      options: {
        list: [
          { title: '3-6 LPA', value: '3-6 LPA' },
          { title: '7-10 LPA', value: '7-10 LPA' },
          { title: '11-14 LPA', value: '11-14 LPA' },
          { title: '15-18 LPA', value: '15-18 LPA' },
          { title: '19-22 LPA', value: '19-22 LPA' },
          { title: '23-26 LPA', value: '23-26 LPA' }, // Fixed typo from '23-26LPA'
        ],
        layout: 'dropdown',
      },
    }),
    //posted By
    defineField({
      name: 'postedBy',
      title: 'Posted By',
      type: 'reference',
      to: [{ type: 'author' }],
    }),
    //category it reference the category schema
    defineField({
      name: 'category',
      title: 'Job Category',
      type: 'reference',
      to: [{ type: 'category' }],
    }),
    //employment type
    defineField({
      name: 'employmentType',
      title: 'Employment Type',
      type: 'string',
      options: {
        list: [
          { title: 'Full-Time', value: 'fulltime' },
          { title: 'Part-Time', value: 'partTime' },
          { title: 'Internship', value: 'internship' },
          { title: 'Contract', value: 'contract' },
          { title: 'Freelance', value: 'freelance' },
        ],
      },
    }),
    //work mode
    defineField({
      name: 'workMode',
      title: 'WorkMode',
      type: 'string',
      options: {
        list: [
          { title: 'Hybrid', value: 'hybrid' },
          { title: 'Onsite', value: 'onsite' },
          { title: 'Remote', value: 'remote' },
        ],
        layout: 'dropdown',
      },
    }),

    defineField({
      name: 'openings',
      title: 'Number of Openings',
      type: 'number',
    }),
    //description
    defineField({
      name: 'description',
      title: 'Job Description',
      type: 'text',
      rows: 5,
    }),
    //role
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
    }),
    //application Link
    defineField({
      name: 'applicationLink',
      title: 'Application Link',
      type: 'url',
    }),
    defineField({
      name: 'eligibility',
      title: 'Eligibility Criteria',
      type: 'text',
      rows: 3,
    }),
    //key skills
    defineField({
      name: 'KeySkills',
      title: 'Key Skills',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    //responsibilities
    defineField({
      name: 'responsibilities',
      title: 'Responsibilities',
      type: 'array',
      of: [{ type: 'string' }],
    }),
    defineField({
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
    }),
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'companyName',
    },
  },
});
