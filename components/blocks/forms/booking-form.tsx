// components/blocks/forms/booking-form.tsx
'use client';

import { useCallback, useMemo } from 'react';
import * as z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { stegaClean } from 'next-sanity';

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2 } from '@/lib/icons';
import type { ColorVariant, SectionPadding } from '@/sanity.types';

const postcodeRegex = /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i;

const bookingFormSchema = z.object({
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
  preferredDate: z
    .string()
    .min(1, {
      message: 'Pick a preferred date',
    })
    .refine(
      (value) => {
        const parsed = new Date(value);
        if (Number.isNaN(parsed.getTime())) {
          return false;
        }

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        parsed.setHours(0, 0, 0, 0);

        return parsed.getTime() >= today.getTime();
      },
      {
        message: 'Choose a date from today onwards',
      }
    ),
  message: z
    .string()
    .max(1000, {
      message: 'Keep your notes under 1,000 characters',
    })
    .optional()
    .or(z.literal('')),
});

const cleanString = (value?: string | null) =>
  value ? stegaClean(value) : undefined;

const normalisePostcode = (value: string) => value.trim().toUpperCase();

export type BookingFormBlock = {
  _type: 'form-booking';
  _key: string;
  padding?: SectionPadding | null;
  colorVariant?: ColorVariant | null;
  heading?: string | null;
  body?: string | null;
  services?: string[] | null;
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

type BookingFormValues = z.infer<typeof bookingFormSchema>;

export default function BookingForm({
  padding,
  colorVariant,
  heading,
  body,
  services,
  availabilityNote,
  submitButtonLabel,
  successMessage,
  outOfAreaMessage,
  settings,
  enableFadeIn,
}: BookingFormBlock) {
  const cleanedColor = colorVariant ? stegaClean(colorVariant) : undefined;
  const cleanedHeading = cleanString(heading);
  const cleanedBody = cleanString(body);
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

  const form = useForm<BookingFormValues>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      postcode: '',
      service: serviceOptions[0] ?? '',
      preferredDate: '',
      message: '',
    },
  });

  const { isSubmitting } = form.formState;

  const handleSubmit = useCallback(
    async (values: BookingFormValues) => {
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
          message: '',
        });
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

  async function onSubmit(values: BookingFormValues) {
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

  const sectionChildren = (
    <div className="space-y-8">
      {(cleanedHeading || cleanedBody) && (
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
          className="grid gap-6 md:grid-cols-2"
        >
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
                  <Input {...field} type="tel" autoComplete="tel" />
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
                      field.onChange(normalisePostcode(event.target.value))
                    }
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
            name="preferredDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Preferred date</FormLabel>
                <FormControl>
                  <Input {...field} type="date" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    rows={5}
                    placeholder="Tell us about the job, access notes, or preferred times."
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="md:col-span-2 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
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
        </form>
      </Form>
    </div>
  );

  return (
    <SectionContainer
      color={cleanedColor}
      padding={padding}
      enableFadeIn={enableFadeIn}
    >
      <div className="mx-auto max-w-3xl rounded-2xl border border-border/60 bg-background/80 p-8 shadow-sm backdrop-blur">
        {sectionChildren}
      </div>
    </SectionContainer>
  );
}
