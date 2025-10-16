// sanity/schema.ts
import { type SchemaTypeDefinition } from "sanity";
// documents
import page from "./schemas/documents/page";
import post from "./schemas/documents/post";
import author from "./schemas/documents/author";
import category from "./schemas/documents/category";
import faq from "./schemas/documents/faq";
import testimonial from "./schemas/documents/testimonial";
import navigation from "./schemas/documents/navigation";
import settings from "./schemas/documents/settings";
import bookingSettings from "./schemas/documents/booking-settings";
import product from "./schemas/documents/product";
import collection from "./schemas/documents/collection";

// Schema UI shared objects
import blockContent from "./schemas/blocks/shared/block-content";
import link from "./schemas/blocks/shared/link";
import { colorVariant } from "./schemas/blocks/shared/color-variant";
import { buttonVariant } from "./schemas/blocks/shared/button-variant";
import sectionPadding from "./schemas/blocks/shared/section-padding";
import lottieAsset from "./schemas/objects/lottie-asset";
import heroFlex from "./schemas/objects/hero_flex";
import productVariant from "./schemas/objects/product-variant";
import cloudinaryGalleryImage from "./schemas/objects/cloudinary-gallery-image";
// Schema UI objects
import hero1 from "./schemas/blocks/hero/hero-1";
import hero2 from "./schemas/blocks/hero/hero-2";
import heroFull from "./schemas/blocks/hero/hero-full";
import sectionHeader from "./schemas/blocks/section-header";
import richTextBlock from "./schemas/blocks/rich-text-block";
import splitRow from "./schemas/blocks/split/split-row";
import splitContent from "./schemas/blocks/split/split-content";
import splitCardsList from "./schemas/blocks/split/split-cards-list";
import splitCard from "./schemas/blocks/split/split-card";
import splitImage from "./schemas/blocks/split/split-image";
import splitInfoList from "./schemas/blocks/split/split-info-list";
import splitInfo from "./schemas/blocks/split/split-info";
import splitContactForm from "./schemas/blocks/split/split-contact-form";
import splitLocationMap from "./schemas/blocks/split/split-location-map";
import gridCard from "./schemas/blocks/grid/grid-card";
import pricingCard from "./schemas/blocks/grid/pricing-card";
import gridPost from "./schemas/blocks/grid/grid-post";
import gridRow from "./schemas/blocks/grid/grid-row";
import productGrid from "./schemas/blocks/product-grid";
import shopBrowser from "./schemas/blocks/shop-browser";
import carousel1 from "./schemas/blocks/carousel/carousel-1";
import carousel2 from "./schemas/blocks/carousel/carousel-2";
import imageGallery from "./schemas/blocks/gallery/image-gallery";
import cloudinaryGallery from "./schemas/blocks/gallery/cloudinary-gallery";
import beforeAfterGallery from "./schemas/blocks/gallery/before-after-gallery";
import timelineRow from "./schemas/blocks/timeline/timeline-row";
import timelinesOne from "./schemas/blocks/timeline/timelines-1";
import cta1 from "./schemas/blocks/cta/cta-1";
import logoCloud1 from "./schemas/blocks/logo-cloud/logo-cloud-1";
import faqs from "./schemas/blocks/faqs";
import newsletter from "./schemas/blocks/forms/newsletter";
import contactForm from "./schemas/blocks/forms/contact";
import bookingForm from "./schemas/blocks/forms/booking";
import bookingCalendarForm from "./schemas/blocks/forms/booking-calendar";
import contactMap from "./schemas/blocks/forms/contact-map";
import locationMap from "./schemas/blocks/location/location-map";
import allPosts from "./schemas/blocks/all-posts";
import menuSection from "./schemas/blocks/menu-section";
import menuGoogleSection from "./schemas/blocks/menu-google-section";
import lottieAnimation from "./schemas/blocks/lottie-animation";
import testimonialsCarousel from "./schemas/blocks/testimonials/testimonials-carousel";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // documents
    page,
    post,
    author,
    category,
    faq,
    testimonial,
    navigation,
    settings,
    bookingSettings,
    product,
    collection,
    // shared objects
    blockContent,
    link,
    colorVariant,
    buttonVariant,
    sectionPadding,
    lottieAsset,
    heroFlex,
    productVariant,
    cloudinaryGalleryImage,
    // blocks
    hero1,
    hero2,
    heroFull,
    sectionHeader,
    richTextBlock,
    splitRow,
    splitContent,
    splitCardsList,
    splitCard,
    splitImage,
    splitInfoList,
    splitInfo,
    splitContactForm,
    splitLocationMap,
    gridCard,
    pricingCard,
    gridPost,
    gridRow,
    productGrid,
    shopBrowser,
    carousel1,
    carousel2,
    imageGallery,
    cloudinaryGallery,
    beforeAfterGallery,
    timelineRow,
    timelinesOne,
    cta1,
    logoCloud1,
    faqs,
    newsletter,
    contactForm,
    bookingForm,
    bookingCalendarForm,
    contactMap,
    locationMap,
    allPosts,
    menuSection,
    menuGoogleSection,
    lottieAnimation,
    testimonialsCarousel,
  ],
};
