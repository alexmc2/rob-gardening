// sanity/queries/booking-settings.ts
import { groq } from "next-sanity";

export const BOOKING_SETTINGS_FIELDS = `
  _id,
  title,
  servicePostcode,
  serviceRadiusKm,
  serviceLocation,
  serviceAreaLabel,
  successMessage,
  notificationEmail,
`;

export const BOOKING_SETTINGS_BY_ID_QUERY = groq`
  *[_type == "bookingSettings" && _id == $id][0]{
    ${BOOKING_SETTINGS_FIELDS}
  }
`;

export const BOOKING_SETTINGS_DEFAULT_QUERY = groq`
  *[_type == "bookingSettings"][0]{
    ${BOOKING_SETTINGS_FIELDS}
  }
`;
