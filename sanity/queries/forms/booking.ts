// sanity/queries/forms/booking.ts
import { groq } from "next-sanity";
import { fadeInQuery } from "../shared/fade-in";

// @sanity-typegen-ignore
export const formBookingQuery = groq`
  _type == "form-booking" => {
    _type,
    _key,
    padding,
    colorVariant,
    heading,
    body,
    services,
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
