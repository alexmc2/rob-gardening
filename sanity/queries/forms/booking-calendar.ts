// sanity/queries/forms/booking-calendar.ts
import { groq } from "next-sanity";
import { fadeInQuery } from "../shared/fade-in";

// @sanity-typegen-ignore
export const formBookingCalendarQuery = groq`
  _type == "form-booking-calendar" => {
    _type,
    _key,
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
    "settings": bookingSettings[0]->{
      _id,
      title,
      servicePostcode,
      serviceRadiusKm,
      serviceLocation,
      serviceAreaLabel,
      successMessage,
      notificationEmail,
    },
    ${fadeInQuery},
  }
`;
