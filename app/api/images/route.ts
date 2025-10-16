// app/api/images/route.ts
import { NextResponse } from "next/server";

import {
  getCloudinaryImages,
  type CloudinaryImage,
} from "@/utils/cloudinary/cloudinary";

export const dynamic = "force-dynamic";

type CarouselImage = {
  url: string;
  public_id: string;
  alt: string;
  width: number;
  height: number;
  created_at: string;
};

type DeletedImageRow = {
  original_data?: {
    public_id?: string | null;
  } | null;
};

type SupabaseResponse = {
  data: DeletedImageRow[] | null;
  error: unknown;
};

async function fetchDeletedImageIds(): Promise<Set<string>> {
  try {
    const { getServerSupabase } = await import("@/utils/supabase/server");
    const supabase = await getServerSupabase();
    const { data, error } = (await supabase
      .from("active_recycle_bin")
      .select("original_data")
      .eq("entity_type", "gallery_image")) as SupabaseResponse;

    if (error) {
      console.error("Supabase error while fetching deleted gallery images:", error);
      return new Set();
    }

    const ids = data
      ?.map((row) => row.original_data?.public_id)
      .filter((id): id is string => Boolean(id)) ?? [];

    return new Set(ids);
  } catch (error) {
    if (error instanceof Error && /Cannot find module/.test(error.message)) {
      console.info(
        "Supabase utilities not available; skipping deleted image filtering."
      );
      return new Set();
    }

    console.error("Unexpected error while loading Supabase utilities:", error);
    return new Set();
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const prefixParam = searchParams.get("prefix");

    const images = await getCloudinaryImages(prefixParam);
    const deletedImageIds = await fetchDeletedImageIds();

    const activeImages = images.filter(
      (image: CloudinaryImage) => !deletedImageIds.has(image.public_id)
    );

    const carouselImages: CarouselImage[] = activeImages.map(
      (image: CloudinaryImage) => ({
        url: image.secure_url,
        public_id: image.public_id,
        alt: image.public_id,
        width: image.width,
        height: image.height,
        created_at: image.created_at,
      })
    );

    return NextResponse.json(carouselImages);
  } catch (error) {
    console.error("Error fetching images:", error);
    return NextResponse.json([], { status: 200 });
  }
}
