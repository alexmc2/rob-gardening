// sanity/queries/forms/contact.ts
import { groq } from "next-sanity";
import { fadeInQuery } from "../shared/fade-in";

// @sanity-typegen-ignore
export const formContactQuery = groq`
  _type == "form-contact" => {
    _type,
    _key,
    padding,
    colorVariant,
    heading,
    body,
    formspreeFormId,
    submitButtonLabel,
    successMessage,
    ${fadeInQuery},
  }
`;
