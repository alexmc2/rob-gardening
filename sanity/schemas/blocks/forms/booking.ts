// sanity/schemas/blocks/forms/booking.ts
import { defineField, defineType } from 'sanity';
import { CalendarPlus } from 'lucide-react';
import { fadeInField } from '../shared/fade-in';

export default defineType({
  name: 'form-booking',
  title: 'Form: Booking',
  type: 'object',
  description: 'Collect booking requests with postcode coverage checks.',
  icon: CalendarPlus,
  fields: [
    defineField({
      name: 'padding',
      type: 'section-padding',
    }),
    defineField({
      name: 'colorVariant',
      type: 'color-variant',
      title: 'Color Variant',
      description: 'Select a background color variant for the section.',
    }),
    defineField({
      name: 'heading',
      type: 'string',
      description: 'A punchy headline encouraging visitors to make a booking.',
    }),
    defineField({
      name: 'body',
      title: 'Body Copy',
      type: 'text',
      rows: 3,
      description: 'Supporting copy that clarifies availability or what to include.',
    }),
    defineField({
      name: 'bookingSettings',
      title: 'Booking settings',
      type: 'array',
      description: 'Select the service area configuration used to validate postcodes.',
      of: [
        {
          type: 'reference',
          to: [{ type: 'bookingSettings' }],
        },
      ],
      validation: (Rule) =>
        Rule.length(1).error('Select exactly one booking settings document to use.'),
    }),
    defineField({
      name: 'services',
      title: 'Services offered',
      type: 'array',
      description: 'Populate the services a visitor can choose from when booking.',
      of: [{ type: 'string' }],
      options: {
        layout: 'tags',
      },
      validation: (Rule) =>
        Rule.min(1).warning('Add at least one service so visitors know what to book.'),
    }),
    defineField({
      name: 'availabilityNote',
      type: 'string',
      title: 'Availability note',
      description: 'Optional note shown below the form (e.g. "Bookings open Monday-Friday").',
    }),
    defineField({
      name: 'submitButtonLabel',
      title: 'Submit Button Label',
      type: 'string',
      initialValue: 'Request booking',
    }),
    defineField({
      name: 'successMessage',
      title: 'Success Message',
      type: 'string',
      description: 'Overrides the success fallback defined in booking settings.',
    }),
    defineField({
      name: 'outOfAreaMessage',
      title: 'Out-of-area message',
      type: 'string',
      description: 'Optional message shown when a postcode is outside your service radius.',
    }),
    fadeInField(),
  ],
  preview: {
    select: {
      title: 'heading',
      services: 'services',
    },
    prepare({ title, services }) {
      const serviceCount = Array.isArray(services) ? services.length : 0;
      return {
        title: title || 'Booking form',
        subtitle: serviceCount ? `${serviceCount} services configured` : 'Add services',
      };
    },
  },
});
