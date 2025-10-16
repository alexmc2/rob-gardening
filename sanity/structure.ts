// sanity/structure.ts
import { orderableDocumentListDeskItem } from "@sanity/orderable-document-list";
import {
  Files,
  BookA,
  User,
  ListCollapse,
  Quote,
  Menu,
  Settings,
  Newspaper,
  ShoppingBag,
  Package,
  Boxes,
  CalendarCheck,
} from "lucide-react";

export const structure = (S: any, context: any) =>
  S.list()
    .title("Content")
    .items([
      orderableDocumentListDeskItem({
        type: "page",
        title: "Pages",
        icon: Files,
        S,
        context,
      }),
      S.listItem()
        .title("Blog")
        .id("blog")
        .icon(Newspaper)
        .child(
          S.list()
            .title("Blog")
            .id("blogRoot")
            .items([
              S.listItem()
                .title("Posts")
                .schemaType("post")
                .child(
                  S.documentTypeList("post")
                    .title("Posts")
                    .defaultOrdering([{ field: "_createdAt", direction: "desc" }])
                ),
              orderableDocumentListDeskItem({
                type: "category",
                title: "Categories",
                icon: BookA,
                S,
                context,
              }),
              orderableDocumentListDeskItem({
                type: "author",
                title: "Authors",
                icon: User,
                S,
                context,
              }),
            ])
        ),
      S.listItem()
        .title("Shop")
        .id("shop")
        .icon(ShoppingBag)
        .child(
          S.list()
            .title("Shop")
            .id("shopRoot")
            .items([
              orderableDocumentListDeskItem({
                type: "product",
                title: "Products",
                icon: Package,
                S,
                context,
              }),
              orderableDocumentListDeskItem({
                type: "collection",
                title: "Product Categories",
                icon: Boxes,
                S,
                context,
              }),
            ])
        ),
      orderableDocumentListDeskItem({
        type: "faq",
        title: "FAQs",
        icon: ListCollapse,
        S,
        context,
      }),
      orderableDocumentListDeskItem({
        type: "testimonial",
        title: "Testimonials",
        icon: Quote,
        S,
        context,
      }),
      S.divider(),
      S.listItem()
        .title("Navigation")
        .icon(Menu)
        .child(
          S.editor()
            .id("navigation")
            .schemaType("navigation")
            .documentId("navigation")
        ),
      S.listItem()
        .title("Booking Settings")
        .icon(CalendarCheck)
        .child(
          S.editor()
            .id("bookingSettings")
            .schemaType("bookingSettings")
            .documentId("bookingSettings")
        ),
      S.listItem()
        .title("Settings")
        .icon(Settings)
        .child(
          S.editor()
            .id("settings")
            .schemaType("settings")
            .documentId("settings")
        ),
    ]);
