// sanity/queries/page.ts
import { groq } from "next-sanity";
import { hero1Query } from "./hero/hero-1";
import { hero2Query } from "./hero/hero-2";
import { heroFullQuery } from "./hero/hero-full";
import { heroFlexQuery } from "./hero/hero-flex";
import { sectionHeaderQuery } from "./section-header";
import { splitRowQuery } from "./split/split-row";
import { gridRowQuery } from "./grid/grid-row";
import { carousel1Query } from "./carousel/carousel-1";
import { carousel2Query } from "./carousel/carousel-2";
import { imageGalleryQuery } from "./gallery/image-gallery";
import { beforeAfterGalleryQuery } from "./gallery/before-after-gallery";
import { cloudinaryGalleryQuery } from "./gallery/cloudinary-gallery";
import { testimonialsCarouselQuery } from "./testimonials/testimonials-carousel";
import { timelineQuery } from "./timeline";
import { cta1Query } from "./cta/cta-1";
import { logoCloud1Query } from "./logo-cloud/logo-cloud-1";
import { faqsQuery } from "./faqs";
import { formNewsletterQuery } from "./forms/newsletter";
import { formContactQuery } from "./forms/contact";
import { formBookingQuery } from "./forms/booking";
import { formBookingCalendarQuery } from "./forms/booking-calendar";
import { formContactMapQuery } from "./forms/contact-map";
import { locationMapQuery } from "./location/location-map";
import { allPostsQuery } from "./all-posts";
import { menuSectionQuery } from "./menu-section";
import { menuGoogleSectionQuery } from "./menu-google-section";
import { lottieAnimationQuery } from "./lottie-animation";
import { richTextBlockQuery } from "./rich-text-block";
import { productGridQuery } from './product/product-grid';
import { shopBrowserQuery } from './product/shop-browser';

export const PAGE_QUERY = groq`
  *[_type == "page" && slug.current == $slug][0]{
    blocks[]{
      ${hero1Query},
      ${hero2Query},
      ${heroFullQuery},
      ${heroFlexQuery},
      ${sectionHeaderQuery},
      ${richTextBlockQuery},
      ${lottieAnimationQuery},
      ${splitRowQuery},
      ${gridRowQuery},
      ${carousel1Query},
      ${carousel2Query},
      ${imageGalleryQuery},
      ${beforeAfterGalleryQuery},
      ${cloudinaryGalleryQuery},
      ${testimonialsCarouselQuery},
      ${timelineQuery},
      ${cta1Query},
      ${logoCloud1Query},
      ${faqsQuery},
      ${formNewsletterQuery},
      ${formContactQuery},
      ${formBookingQuery},
      ${formBookingCalendarQuery},
      ${formContactMapQuery},
      ${locationMapQuery},
      ${allPostsQuery},
      ${menuSectionQuery},
      ${menuGoogleSectionQuery},
      ${productGridQuery},
      ${shopBrowserQuery},
    },
    meta_title,
    meta_description,
    noindex,
    ogImage {
      asset->{
        _id,
        url,
        metadata {
          dimensions {
            width,
            height
          }
        }
      },
    }
  }
`;

export const PAGES_SLUGS_QUERY = groq`*[_type == "page" && defined(slug)]{slug}`;
