// sanity/schemas/documents/booking-settings.ts
import { defineField, defineType } from 'sanity';
import { CalendarCheck } from 'lucide-react';

export default defineType({
  name: 'bookingSettings',
  title: 'Booking Settings',
  type: 'document',
  icon: CalendarCheck,
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      description: 'Internal label to help editors identify this configuration.',
      validation: (Rule) =>
        Rule.required().error('Add a title so editors know what this configuration covers.'),
    }),
    defineField({
      name: 'servicePostcode',
      type: 'string',
      title: 'Base postcode',
      description: 'Primary postcode you operate from. Used when explaining service coverage.',
      validation: (Rule) =>
        Rule.required().error('Set the base postcode used for distance calculations.'),
    }),
    defineField({
      name: 'serviceLocation',
      type: 'geopoint',
      title: 'Base coordinates',
      description: 'Use the map picker to set your base location for distance checks.',
      validation: (Rule) =>
        Rule.required().error('Set base coordinates to measure distances accurately.'),
    }),
    defineField({
      name: 'serviceRadiusKm',
      type: 'number',
      title: 'Service radius (km)',
      description: 'Bookings beyond this radius are declined automatically.',
      options: {
        list: [
          { title: '5 km', value: 5 },
          { title: '10 km', value: 10 },
          { title: '15 km', value: 15 },
          { title: '20 km', value: 20 },
          { title: '25 km', value: 25 },
          { title: '30 km', value: 30 },
        ],
        layout: 'radio',
      },
      validation: (Rule) => Rule.required().error('Choose how far you travel for bookings.'),
    }),
    defineField({
      name: 'serviceAreaLabel',
      type: 'string',
      title: 'Service area label',
      description: 'Shown when a postcode is outside your service radius (e.g. Greater Manchester).',
    }),
    defineField({
      name: 'successMessage',
      type: 'string',
      title: 'Success response',
      description: 'Optional override for the default success message after the form submits.',
      initialValue: 'Thanks for your booking request! We will confirm shortly.',
    }),
    defineField({
      name: 'notificationEmail',
      type: 'string',
      title: 'Notification email',
      description: 'Send booking submissions here when email integration is configured.',
      validation: (Rule) =>
        Rule.email().warning('Enter a valid email address to receive booking notifications.'),
    }),
  ],
  preview: {
    select: {
      title: 'title',
      radius: 'serviceRadiusKm',
    },
    prepare({ title, radius }) {
      return {
        title: title || 'Booking settings',
        subtitle: radius ? `Service radius: ${radius} km` : undefined,
      };
    },
  },
});
