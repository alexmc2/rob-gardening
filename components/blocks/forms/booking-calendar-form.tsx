// components/blocks/forms/booking-calendar-form.tsx
'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { stegaClean } from 'next-sanity';
import { addDays, format, parseISO, startOfDay } from 'date-fns';

import SectionContainer from '@/components/ui/section-container';
import { Button } from '@/components/ui/button1';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, CalendarDays, ChevronDown } from '@/lib/icons';
import type { ColorVariant, SectionPadding } from '@/sanity.types';

const postcodeRegex = /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i;

const bookingCalendarSchema = z
  .object({
    name: z.string().min(1, {
      message: 'Please enter your name',
    }),
    email: z
      .string()
      .min(1, {
        message: 'Please enter your email',
      })
      .email({
        message: 'Please enter a valid email address',
      }),
    phone: z.string().min(7, {
      message: 'Add a contact number so we can reach you',
    }),
    postcode: z
      .string()
      .min(6, {
        message: 'Please add your postcode',
      })
      .regex(postcodeRegex, {
        message: 'Enter a valid UK postcode',
      }),
    service: z.string().min(1, {
      message: 'Select a service to book',
    }),
    preferredDate: z.string().min(1, {
      message: 'Select a booking date from the calendar',
    }),
    preferredStartTime: z.string().min(1, {
      message: 'Choose a start time',
    }),
    preferredEndTime: z.string().min(1, {
      message: 'Choose an end time',
    }),
    message: z
      .string()
      .max(1000, {
        message: 'Keep your notes under 1,000 characters',
      })
      .optional()
      .or(z.literal('')),
  })
  .superRefine((values, ctx) => {
    const startMinutes = timeToMinutes(values.preferredStartTime);
    const endMinutes = timeToMinutes(values.preferredEndTime);

    if (
      startMinutes !== null &&
      endMinutes !== null &&
      endMinutes <= startMinutes
    ) {
      ctx.addIssue({
        path: ['preferredEndTime'],
        code: z.ZodIssueCode.custom,
        message: 'End time must be after the start time',
      });
    }
  });

const cleanString = (value?: string | null) =>
  value ? stegaClean(value) : undefined;
const normalisePostcode = (value: string) => value.trim().toUpperCase();

const DEFAULT_START_TIME = '09:00';
const DEFAULT_END_TIME = '12:00';

export type BookingCalendarFormBlock = {
  _type: 'form-booking-calendar';
  _key: string;
  padding?: SectionPadding | null;
  colorVariant?: ColorVariant | null;
  heading?: string | null;
  body?: string | null;
  calendarIntro?: string | null;
  services?: string[] | null;
  noticePeriodDays?: number | null;
  advanceWindowDays?: number | null;
  availabilityNote?: string | null;
  submitButtonLabel?: string | null;
  successMessage?: string | null;
  outOfAreaMessage?: string | null;
  enableFadeIn?: boolean | null;
  settings?: {
    _id: string;
    title?: string | null;
    servicePostcode?: string | null;
    serviceRadiusKm?: number | null;
    serviceLocation?: {
      lat?: number | null;
      lng?: number | null;
    } | null;
    serviceAreaLabel?: string | null;
    successMessage?: string | null;
    notificationEmail?: string | null;
  } | null;
};

type BookingCalendarFormValues = z.infer<typeof bookingCalendarSchema>;

type DisabledRange = { before?: Date; after?: Date };

export default function BookingCalendarForm({
  padding,
  colorVariant,
  heading,
  body,
  calendarIntro,
  services,
  noticePeriodDays,
  advanceWindowDays,
  availabilityNote,
  submitButtonLabel,
  successMessage,
  outOfAreaMessage,
  settings,
  enableFadeIn,
}: BookingCalendarFormBlock) {
  const cleanedColor = colorVariant ? stegaClean(colorVariant) : undefined;
  const cleanedHeading = cleanString(heading);
  const cleanedBody = cleanString(body);
  const cleanedCalendarIntro = cleanString(calendarIntro);
  const cleanedSubmitLabel =
    cleanString(submitButtonLabel) ?? 'Request booking';
  const cleanedSuccessMessage = cleanString(successMessage);
  const cleanedOutOfAreaMessage = cleanString(outOfAreaMessage);
  const cleanedAvailabilityNote = cleanString(availabilityNote);

  const cleanedSettings = settings
    ? {
        id: settings._id,
        radiusKm: settings.serviceRadiusKm ?? undefined,
        serviceLabel:
          cleanString(settings.serviceAreaLabel) ??
          cleanString(settings.servicePostcode),
        fallbackSuccess: cleanString(settings.successMessage),
      }
    : null;

  const serviceOptions = useMemo(() => {
    if (!services?.length) {
      return [] as string[];
    }

    return services
      .map((item) => cleanString(item) ?? '')
      .filter((item): item is string => Boolean(item));
  }, [services]);

  const today = useMemo(() => startOfDay(new Date()), []);
  const minimumNotice = Math.max(noticePeriodDays ?? 0, 0);
  const maximumWindow = Math.max(advanceWindowDays ?? 180, 0);

  const minDate = useMemo(
    () => addDays(today, minimumNotice),
    [today, minimumNotice]
  );
  const maxDate = useMemo(
    () => addDays(today, maximumWindow),
    [today, maximumWindow]
  );

  const disabledDays = useMemo<DisabledRange[]>(
    () => [{ before: minDate }, { after: maxDate }],
    [minDate, maxDate]
  );

  const form = useForm<BookingCalendarFormValues>({
    resolver: zodResolver(bookingCalendarSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      postcode: '',
      service: serviceOptions[0] ?? '',
      preferredDate: '',
      preferredStartTime: DEFAULT_START_TIME,
      preferredEndTime: DEFAULT_END_TIME,
      message: '',
    },
  });

  const { isSubmitting } = form.formState;

  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [calendarOpen, setCalendarOpen] = useState(false);

  useEffect(() => {
    const currentValue = form.getValues('preferredDate');
    if (currentValue) {
      setSelectedDate(startOfDay(parseISO(currentValue)));
      return;
    }

    setSelectedDate(minDate);
    form.setValue('preferredDate', format(minDate, 'yyyy-MM-dd'), {
      shouldValidate: true,
    });
  }, [form, minDate]);

  useEffect(() => {
    if (!serviceOptions.length) {
      form.setValue('service', '');
    } else if (!serviceOptions.includes(form.getValues('service'))) {
      form.setValue('service', serviceOptions[0]);
    }
  }, [form, serviceOptions]);

  const handleSubmit = useCallback(
    async (values: BookingCalendarFormValues) => {
      if (!cleanedSettings?.id) {
        toast.error('Booking settings are not configured yet.');
        return;
      }

      try {
        const response = await fetch('/api/bookings', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...values,
            postcode: normalisePostcode(values.postcode),
            message: values.message?.trim() ?? '',
            settingsId: cleanedSettings.id,
          }),
        });

        const result = await response.json().catch(() => null);

        if (!response.ok) {
          const errorMessage =
            cleanedOutOfAreaMessage && response.status === 422
              ? cleanedOutOfAreaMessage
              : result?.message || 'Unable to send your booking request.';

          if (response.status === 422) {
            form.setError('postcode', {
              type: 'manual',
              message: errorMessage,
            });
          }

          toast.error(errorMessage);
          return;
        }

        const messageText =
          cleanedSuccessMessage ||
          cleanedSettings.fallbackSuccess ||
          result?.message;

        if (messageText) {
          toast.success(messageText);
        }

        form.reset({
          name: '',
          email: '',
          phone: '',
          postcode: '',
          service: serviceOptions[0] ?? '',
          preferredDate: '',
          preferredStartTime: DEFAULT_START_TIME,
          preferredEndTime: DEFAULT_END_TIME,
          message: '',
        });
        const resetDate = minDate;
        form.setValue('preferredDate', format(resetDate, 'yyyy-MM-dd'));
        setSelectedDate(resetDate);
      } catch (error: any) {
        toast.error(
          error?.message || 'Unable to send your booking request right now.'
        );
      }
    },
    [
      cleanedOutOfAreaMessage,
      cleanedSettings,
      cleanedSuccessMessage,
      form,
      serviceOptions,
    ]
  );

  async function onSubmit(values: BookingCalendarFormValues) {
    await handleSubmit(values);
  }

  if (!cleanedSettings?.id) {
    return (
      <SectionContainer
        color={cleanedColor}
        padding={padding}
        enableFadeIn={enableFadeIn}
      >
        <div className="mx-auto max-w-2xl rounded-xl border border-dashed border-border/70 bg-muted/40 p-8 text-center text-muted-foreground">
          <p className="font-medium">
            Add booking settings in Sanity to enable this form.
          </p>
          <p className="mt-3 text-sm">
            Link a "Booking Settings" document and publish it to start capturing
            booking requests.
          </p>
        </div>
      </SectionContainer>
    );
  }

  if (!serviceOptions.length) {
    return (
      <SectionContainer
        color={cleanedColor}
        padding={padding}
        enableFadeIn={enableFadeIn}
      >
        <div className="mx-auto max-w-2xl rounded-xl border border-dashed border-border/70 bg-muted/40 p-8 text-center text-muted-foreground">
          <p className="font-medium">
            Add at least one service option in Sanity to enable bookings.
          </p>
          <p className="mt-3 text-sm">
            Populate the "Services offered" list on the booking form block and
            republish the page.
          </p>
        </div>
      </SectionContainer>
    );
  }

  return (
    <SectionContainer
      color={cleanedColor}
      padding={padding}
      enableFadeIn={enableFadeIn}
    >
      <div className="mx-auto max-w-5xl rounded-2xl border border-border/60 bg-background/80 p-8 shadow-sm backdrop-blur">
        <div className="space-y-10">
          {(cleanedHeading || cleanedBody || cleanedSettings?.radiusKm) && (
            <div className="space-y-4 text-left">
              {cleanedHeading && (
                <h2 className="text-3xl font-semibold tracking-tight lg:text-4xl">
                  {cleanedHeading}
                </h2>
              )}
              {cleanedBody && (
                <p className="text-muted-foreground">{cleanedBody}</p>
              )}
              {cleanedSettings?.radiusKm && (
                <p className="text-sm font-medium text-muted-foreground">
                  I currently travel within {cleanedSettings.radiusKm} km of{' '}
                  {cleanedSettings.serviceLabel ?? 'our base postcode'}.
                </p>
              )}
            </div>
          )}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(320px,360px)] lg:items-start"
            >
              <div className="grid gap-6">
                <div className="grid gap-6 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            autoComplete="name"
                            placeholder="Your name"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            autoComplete="email"
                            placeholder="you@yourbusiness.co.uk"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="tel"
                            autoComplete="tel"
         
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="postcode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Postcode</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                  
                            inputMode="text"
                            autoComplete="postal-code"
                            onChange={(event) =>
                              field.onChange(
                                normalisePostcode(event.target.value)
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="service"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11 w-full">
                            <SelectValue placeholder="Select a service" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent className="max-h-60">
                          {serviceOptions.map((service) => (
                            <SelectItem key={service} value={service}>
                              {service}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Notes (optional)</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={4}
                          placeholder="Tell us about the job, access notes, or preferred times."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  {cleanedAvailabilityNote && (
                    <p className="text-sm text-muted-foreground">
                      {cleanedAvailabilityNote}
                    </p>
                  )}
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="dark:bg-sky-500"
                  >
                    {isSubmitting && (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    )}
                    {cleanedSubmitLabel}
                  </Button>
                </div>
              </div>
              <Card className="border-border/70 bg-background/80 shadow-sm backdrop-blur">
                <CardHeader className="pb-4">
                  <CardTitle className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                      <CalendarDays className="h-4 w-4" aria-hidden />
                      <span>Select a preferred date</span>
                    </div>
                    {cleanedCalendarIntro && (
                      <span className="text-base font-normal text-muted-foreground">
                        {cleanedCalendarIntro}
                      </span>
                    )}
                  </CardTitle>
                  <CardDescription>
                    Earliest date: {format(minDate, 'd MMM yyyy')} · Latest
                    date: {format(maxDate, 'd MMM yyyy')}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-5 pt-0">
                  <FormField
                    control={form.control}
                    name="preferredDate"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="text-sm font-medium">
                          Date
                        </FormLabel>
                        <Popover
                          open={calendarOpen}
                          onOpenChange={setCalendarOpen}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className="w-full justify-between font-normal"
                              type="button"
                            >
                              {selectedDate
                                ? format(selectedDate, 'EEE d MMM yyyy')
                                : 'Pick a date'}
                              <ChevronDown className="h-4 w-4" aria-hidden />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={selectedDate}
                              onSelect={(date) => {
                                if (!date) {
                                  return;
                                }
                                const normalized = startOfDay(date);
                                setSelectedDate(normalized);
                                field.onChange(
                                  format(normalized, 'yyyy-MM-dd')
                                );
                                setCalendarOpen(false);
                              }}
                              disabled={disabledDays}
                              captionLayout="buttons"
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="preferredStartTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>From</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="time"
                              step={900}
                              className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="preferredEndTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>To</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="time"
                              step={900}
                              className="appearance-none bg-background [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  {selectedDate && (
                    <p className="text-sm font-medium text-foreground">
                      Selected date: {format(selectedDate, 'EEEE d MMMM yyyy')}
                    </p>
                  )}
                </CardContent>
              </Card>
            </form>
          </Form>
        </div>
      </div>
    </SectionContainer>
  );
}

function timeToMinutes(value: string | undefined): number | null {
  if (!value) {
    return null;
  }

  const [hours, minutes] = value.split(':').map(Number);

  if (Number.isNaN(hours) || Number.isNaN(minutes)) {
    return null;
  }

  return hours * 60 + minutes;
}
