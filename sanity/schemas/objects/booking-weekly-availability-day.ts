// sanity/schemas/objects/booking-weekly-availability-day.ts
import { defineField, defineType } from 'sanity';
import { CalendarDays } from 'lucide-react';

const WEEKDAY_OPTIONS = [
  { title: 'Monday', value: 'monday' },
  { title: 'Tuesday', value: 'tuesday' },
  { title: 'Wednesday', value: 'wednesday' },
  { title: 'Thursday', value: 'thursday' },
  { title: 'Friday', value: 'friday' },
  { title: 'Saturday', value: 'saturday' },
  { title: 'Sunday', value: 'sunday' },
] as const;

const SLOT_OPTIONS = [
  { title: 'Morning (08:00 – 10:00)', value: 'morning' },
  { title: 'Late morning (10:00 – 12:00)', value: 'late-morning' },
  { title: 'Early afternoon (12:00 – 14:00)', value: 'early-afternoon' },
  { title: 'Late afternoon (14:00 – 16:00)', value: 'late-afternoon' },
  { title: 'Evening (16:00 – 18:00)', value: 'evening' },
] as const;

export const WEEKLY_AVAILABILITY_SLOT_OPTIONS = SLOT_OPTIONS;
export const WEEKLY_AVAILABILITY_WEEKDAYS = WEEKDAY_OPTIONS;

export default defineType({
  name: 'bookingWeeklyAvailabilityDay',
  title: 'Weekly availability day',
  type: 'object',
  icon: CalendarDays,
  fields: [
    defineField({
      name: 'day',
      type: 'string',
      title: 'Day of week',
      options: {
        list: WEEKDAY_OPTIONS,
        layout: 'radio',
      },
      validation: (Rule) => Rule.required().error('Choose which day this entry configures.'),
    }),
    defineField({
      name: 'availability',
      type: 'string',
      title: 'Availability',
      options: {
        list: [
          { title: 'Available', value: 'available' },
          { title: 'Not available', value: 'unavailable' },
        ],
        layout: 'radio',
      },
      initialValue: 'available',
      validation: (Rule) => Rule.required().error('Set whether you take bookings on this day.'),
    }),
    defineField({
      name: 'slots',
      type: 'array',
      title: 'Time slots',
      description: 'Select the time windows shown to customers for this day.',
      of: [{ type: 'string' }],
      options: {
        list: SLOT_OPTIONS,
        layout: 'checkbox',
      },
      initialValue: ['morning', 'late-morning', 'early-afternoon'],
      hidden: ({ parent }) => parent?.availability !== 'available',
      validation: (Rule) =>
        Rule.custom((value, context) => {
          if (context.parent?.availability !== 'available') {
            return true;
          }

          if (!Array.isArray(value) || value.length === 0) {
            return 'Select at least one slot for available days.';
          }

          return true;
        }),
    }),
  ],
  preview: {
    select: {
      day: 'day',
      availability: 'availability',
      slots: 'slots',
    },
    prepare({ day, availability, slots }) {
      const dayOption = WEEKDAY_OPTIONS.find((option) => option.value === day);
      const dayTitle = dayOption ? dayOption.title : 'Day';
      const slotCount = Array.isArray(slots) ? slots.length : 0;

      return {
        title: dayTitle,
        subtitle:
          availability === 'available'
            ? slotCount
              ? `${slotCount} slot${slotCount === 1 ? '' : 's'} enabled`
              : 'No slots selected'
            : 'Not available',
      };
    },
  },
});
