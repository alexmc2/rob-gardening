// sanity/schemas/documents/page.ts
import { defineField, defineType } from "sanity";
import { Files } from "lucide-react";
import { orderRankField } from "@sanity/orderable-document-list";

export default defineType({
  name: 'page',
  type: 'document',
  title: 'Page',
  icon: Files,
  groups: [
    {
      name: 'content',
      title: 'Content',
    },
    {
      name: 'seo',
      title: 'SEO',
    },
    {
      name: 'settings',
      title: 'Settings',
    },
  ],
  fields: [
    defineField({ name: 'title', type: 'string', group: 'content' }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'settings',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'blocks',
      type: 'array',
      group: 'content',
      of: [
        { type: 'hero-1' },
        { type: 'hero-2' },
        { type: 'hero-full' },
        { type: 'hero-flex' },
        { type: 'section-header' },
        { type: 'rich-text-block' },
        { type: 'lottie-animation' },
        { type: 'menu-section' },
        { type: 'menu-google-section' },
        { type: 'split-row' },
        { type: 'grid-row' },
        { type: 'carousel-1' },
        { type: 'carousel-2' },
        { type: 'image-gallery' },
        { type: 'before-after-gallery' },
        { type: 'cloudinary-gallery' },
        { type: 'testimonials-carousel' },
        { type: 'timeline-row' },
        { type: 'cta-1' },
        { type: 'logo-cloud-1' },
        { type: 'faqs' },
        { type: 'form-newsletter' },
        { type: 'form-contact' },
        { type: 'form-booking' },
        { type: 'form-booking-calendar' },
        { type: 'location-map' },
        { type: 'all-posts' },
        { type: 'product-grid' },
        { type: 'shop-browser' },
      ],
      options: {
        insertMenu: {
          groups: [
            {
              name: 'hero',
              title: 'Hero',
              of: ['hero-1', 'hero-2', 'hero-full', 'hero-flex'],
            },
            {
              name: 'logo-cloud',
              title: 'Logo Cloud',
              of: ['logo-cloud-1'],
            },
            {
              name: 'section-header',
              title: 'Section Header',
              of: ['section-header'],
            },
            {
              name: 'content',
              title: 'Content',
              of: ['rich-text-block'],
            },
            {
              name: 'animation',
              title: 'Animation',
              of: ['lottie-animation'],
            },
            {
              name: 'menu',
              title: 'Menu',
              of: ['menu-section', 'menu-google-section'],
            },
            {
              name: 'grid',
              title: 'Grid',
              of: ['grid-row'],
            },
            {
              name: 'split',
              title: 'Split',
              of: ['split-row'],
            },
            {
              name: 'carousel',
              title: 'Carousel',
              of: ['carousel-1', 'carousel-2'],
            },
            {
              name: 'gallery',
              title: 'Gallery',
              of: ['image-gallery', 'before-after-gallery', 'cloudinary-gallery'],
            },
            {
              name: 'testimonials',
              title: 'Testimonials',
              of: ['testimonials-carousel'],
            },
            {
              name: 'timeline',
              title: 'Timeline',
              of: ['timeline-row'],
            },
            {
              name: 'cta',
              title: 'CTA',
              of: ['cta-1'],
            },
            {
              name: 'faqs',
              title: 'FAQs',
              of: ['faqs'],
            },
            {
              name: 'forms',
              title: 'Forms',
              of: ['form-newsletter', 'form-contact', 'form-booking', 'form-booking-calendar', 'location-map'],
            },
            {
              name: 'all-posts',
              title: 'All Posts',
              of: ['all-posts'],
            },
            {
              name: 'commerce',
              title: 'Commerce',
              of: ['product-grid', 'shop-browser'],
            },
          ],
          views: [
            {
              name: 'grid',
              previewImageUrl: (block) => `/sanity/preview/${block}.jpg`,
            },
            { name: 'list' },
          ],
        },
      },
    }),
    defineField({
      name: 'meta_title',
      title: 'Meta Title',
      type: 'string',
      group: 'seo',
    }),
    defineField({
      name: 'meta_description',
      title: 'Meta Description',
      type: 'text',
      group: 'seo',
    }),
    defineField({
      name: 'noindex',
      title: 'No Index',
      type: 'boolean',
      initialValue: false,
      group: 'seo',
    }),
    defineField({
      name: 'ogImage',
      title: 'Open Graph Image - [1200x630]',
      type: 'image',
      group: 'seo',
    }),
    orderRankField({ type: 'page' }),
  ],
});
