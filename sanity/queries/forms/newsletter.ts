// sanity/queries/forms/newsletter.ts
import { groq } from "next-sanity";
import { fadeInQuery } from "../shared/fade-in";

// @sanity-typegen-ignore
export const formNewsletterQuery = groq`
  _type == "form-newsletter" => {
    _type,
    _key,
    padding,
    colorVariant,
    stackAlign,
    consentText,
    buttonText,
    successMessage,
    ${fadeInQuery},
  }
`;
