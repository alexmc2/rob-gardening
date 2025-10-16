// utils/cloudinary/cloudinary.ts
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

type CloudinaryResource = {
  public_id: string;
  secure_url: string;
  created_at: string;
  width: number;
  height: number;
};

export type CloudinaryImage = {
  public_id: string;
  secure_url: string;
  created_at: string;
  width: number;
  height: number;
};

const galleryPrefix = process.env.CLOUDINARY_GALLERY_PREFIX;

export async function getCloudinaryImages(
  prefix?: string | null
): Promise<CloudinaryImage[]> {
  try {
    const result = await cloudinary.api.resources({
      type: "upload",
      prefix: prefix ?? galleryPrefix ?? undefined,
      max_results: 500,
      direction: "desc",
      sort_by: "created_at",
    });

    return result.resources.map((resource: CloudinaryResource) => ({
      public_id: resource.public_id,
      secure_url: resource.secure_url,
      created_at: resource.created_at,
      width: resource.width,
      height: resource.height,
    }));
  } catch (error) {
    console.error("Error fetching Cloudinary images:", error);
    return [];
  }
}
