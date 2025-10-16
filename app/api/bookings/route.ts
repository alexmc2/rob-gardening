// app/api/bookings/route.ts
import { NextResponse } from 'next/server';
import { z } from 'zod';

import { client } from '@/sanity/lib/client';
import {
  BOOKING_SETTINGS_BY_ID_QUERY,
  BOOKING_SETTINGS_DEFAULT_QUERY,
} from '@/sanity/queries/booking-settings';

const requestSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  phone: z.string().min(7),
  postcode: z.string().min(5),
  service: z.string().min(1),
  preferredDate: z.string().min(1),
  preferredStartTime: z.string().min(1),
  preferredEndTime: z.string().min(1),
  message: z.string().max(1000).optional(),
  settingsId: z.string().optional(),
});

type BookingSettings = {
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
};

type Location = { lat: number; lng: number };

const earthRadiusKm = 6371;

const toRadians = (value: number) => (value * Math.PI) / 180;

function distanceInKm(start: Location, end: Location) {
  const dLat = toRadians(end.lat - start.lat);
  const dLon = toRadians(end.lng - start.lng);
  const lat1 = toRadians(start.lat);
  const lat2 = toRadians(end.lat);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.sin(dLon / 2) * Math.sin(dLon / 2) * Math.cos(lat1) * Math.cos(lat2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return earthRadiusKm * c;
}

async function fetchBookingSettings(settingsId?: string) {
  const query = settingsId ? BOOKING_SETTINGS_BY_ID_QUERY : BOOKING_SETTINGS_DEFAULT_QUERY;
  const params = settingsId ? { id: settingsId } : {};

  const settings = await client.fetch<BookingSettings | null>(query, params, {
    cache: 'no-store',
    next: { tags: ['booking-settings'] },
  });

  return settings ?? null;
}

type PostcodeResult = {
  postcode: string;
  latitude: number;
  longitude: number;
};

async function lookupPostcode(postcode: string): Promise<PostcodeResult | null> {
  const trimmed = postcode.trim();

  if (!trimmed) {
    return null;
  }

  try {
    const response = await fetch(
      `https://api.postcodes.io/postcodes/${encodeURIComponent(trimmed)}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/json',
        },
        cache: 'no-store',
      }
    );

    if (!response.ok) {
      return null;
    }

    const data = (await response.json()) as {
      result?: { postcode: string; latitude: number; longitude: number };
    };

    if (!data?.result) {
      return null;
    }

    return {
      postcode: data.result.postcode,
      latitude: data.result.latitude,
      longitude: data.result.longitude,
    };
  } catch (error) {
    console.error('Failed to query postcode lookup', error);
    return null;
  }
}

function normalisePostcode(postcode: string) {
  return postcode.replace(/\s+/g, '').toUpperCase();
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch (error) {
    return NextResponse.json(
      { message: 'Invalid request payload.' },
      { status: 400 }
    );
  }

  const result = requestSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { message: 'Please double-check the booking form details.' },
      { status: 400 }
    );
  }

  const values = result.data;

  const settings = await fetchBookingSettings(values.settingsId);

  if (!settings) {
    return NextResponse.json(
      { message: 'Booking configuration is missing – please contact the site owner.' },
      { status: 500 }
    );
  }

  const baseLat = settings.serviceLocation?.lat;
  const baseLng = settings.serviceLocation?.lng;
  const radius = settings.serviceRadiusKm ?? null;

  if (
    baseLat === undefined ||
    baseLat === null ||
    baseLng === undefined ||
    baseLng === null ||
    !radius
  ) {
    return NextResponse.json(
      { message: 'Booking configuration is incomplete – please contact the site owner.' },
      { status: 500 }
    );
  }

  const postcodeResult = await lookupPostcode(values.postcode);

  if (!postcodeResult) {
    return NextResponse.json(
      { message: 'We could not find that postcode. Please check it and try again.' },
      { status: 404 }
    );
  }

  const distanceKm = distanceInKm(
    { lat: baseLat, lng: baseLng },
    { lat: postcodeResult.latitude, lng: postcodeResult.longitude }
  );

  if (distanceKm > radius) {
    const areaLabel = settings.serviceAreaLabel || settings.servicePostcode || 'our area';
    return NextResponse.json(
      {
        message: `We currently serve within ${radius} km of ${areaLabel}.`,
        distanceKm,
        allowed: false,
        postcode: normalisePostcode(postcodeResult.postcode),
      },
      { status: 422 }
    );
  }

  // TODO: hook into email, CRM, or payment flow here.

  const successMessage =
    settings.successMessage || 'Thanks for your booking request – we will confirm shortly.';

  return NextResponse.json(
    {
      message: successMessage,
      allowed: true,
      distanceKm,
      postcode: normalisePostcode(postcodeResult.postcode),
    },
    { status: 200 }
  );
}
