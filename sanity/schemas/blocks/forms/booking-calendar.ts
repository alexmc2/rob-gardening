// sanity/schemas/blocks/forms/booking-calendar.ts
import { defineField, defineType } from 'sanity';
import { CalendarRange } from 'lucide-react';
import { fadeInField } from '../shared/fade-in';

export default defineType({
  name: 'form-booking-calendar',
  title: 'Form: Booking with calendar',
  type: 'object',
  description: 'Capture booking requests with an inline calendar selector.',
  icon: CalendarRange,
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
      description: 'Primary heading that introduces the booking form.',
    }),
    defineField({
      name: 'body',
      title: 'Body copy',
      type: 'text',
      rows: 3,
      description: 'Optional supporting copy rendered near the calendar.',
    }),
    defineField({
      name: 'calendarIntro',
      type: 'string',
      title: 'Calendar helper text',
      description: 'Brief note displayed above the calendar (e.g. "Select a preferred visit date").',
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
      name: 'noticePeriodDays',
      type: 'number',
      title: 'Minimum notice (days)',
      description: 'Earliest selectable date will be today plus this many days.',
      initialValue: 2,
      validation: (Rule) => Rule.min(0).max(90).warning('Keep notice between 0 and 90 days.'),
    }),
    defineField({
      name: 'advanceWindowDays',
      type: 'number',
      title: 'Maximum advance booking window (days)',
      description: 'Limit how far into the future bookings can be requested (defaults to 180 days).',
      validation: (Rule) => Rule.min(0).max(365).warning('Keep the advance window under one year.'),
    }),
    defineField({
      name: 'availabilityNote',
      type: 'string',
      title: 'Availability note',
      description: 'Optional note shown near the submit button.',
    }),
    defineField({
      name: 'submitButtonLabel',
      title: 'Submit button label',
      type: 'string',
      initialValue: 'Request booking',
    }),
    defineField({
      name: 'successMessage',
      title: 'Success message',
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
        title: title || 'Booking form with calendar',
        subtitle: serviceCount ? `${serviceCount} services configured` : 'Add services',
      };
    },
  },
});
