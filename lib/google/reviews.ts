// lib/google/reviews.ts

import { randomUUID } from "crypto";

const GOOGLE_PLACES_ENDPOINT = "https://places.googleapis.com/v1/places";

export type ReviewsSortOrder = "most_relevant" | "newest";

export interface FetchGoogleReviewsOptions {
  placeId?: string | null;
  limit?: number | null;
  minimumRating?: number | null;
  sortOrder?: ReviewsSortOrder | null;
  languageCode?: string | null;
}

export interface GoogleReviewAuthor {
  name: string;
  profileUrl?: string;
  avatarUrl?: string;
}

export interface GoogleReview {
  id: string;
  rating: number;
  text?: string;
  languageCode?: string;
  relativePublishTimeDescription?: string;
  publishTime?: string;
  author: GoogleReviewAuthor;
}

export interface GoogleReviewsResult {
  placeName?: string;
  averageRating?: number;
  userRatingCount?: number;
  reviews: GoogleReview[];
  error?: string;
}

interface GooglePlacesReviewPayload {
  name?: string;
  rating?: number;
  text?: { text?: string; languageCode?: string };
  originalText?: { text?: string; languageCode?: string };
  relativePublishTimeDescription?: string;
  publishTime?: string;
  authorAttribution?: {
    displayName?: string;
    uri?: string;
    photoUri?: string;
  };
}

interface GooglePlacesResponse {
  displayName?: { text?: string };
  rating?: number;
  userRatingCount?: number;
  reviews?: GooglePlacesReviewPayload[];
}

const SORT_PARAM_MAP: Record<ReviewsSortOrder, string> = {
  most_relevant: "MOST_RELEVANT",
  newest: "NEWEST",
};

function parseMinimumRating(input?: number | null): number {
  if (!input || Number.isNaN(input)) return 0;
  return Math.min(Math.max(input, 0), 5);
}

function normaliseReview(payload: GooglePlacesReviewPayload): GoogleReview | null {
  const rating = payload.rating ?? 0;
  const id = payload.name ?? randomUUID();
  const text = payload.text?.text?.trim() || payload.originalText?.text?.trim();

  return {
    id,
    rating,
    text,
    languageCode: payload.text?.languageCode || payload.originalText?.languageCode,
    relativePublishTimeDescription: payload.relativePublishTimeDescription,
    publishTime: payload.publishTime,
    author: {
      name: payload.authorAttribution?.displayName || "Google reviewer",
      profileUrl: payload.authorAttribution?.uri,
      avatarUrl: payload.authorAttribution?.photoUri,
    },
  };
}

export async function fetchGoogleReviews({
  placeId,
  limit,
  minimumRating,
  sortOrder = "most_relevant",
  languageCode,
}: FetchGoogleReviewsOptions): Promise<GoogleReviewsResult> {
  const apiKey = process.env.GOOGLE_PLACES_API_KEY;
  const fallbackPlaceId = process.env.GOOGLE_PLACES_PLACE_ID;

  const resolvedPlaceId = placeId || fallbackPlaceId;

  if (!apiKey) {
    return {
      reviews: [],
      error: "Missing GOOGLE_PLACES_API_KEY environment variable.",
    };
  }

  if (!resolvedPlaceId) {
    return {
      reviews: [],
      error: "Missing Google Place ID. Provide it in Sanity or set GOOGLE_PLACES_PLACE_ID.",
    };
  }

  const params = new URLSearchParams();
  const maxReviews = limit && limit > 0 ? Math.min(limit, 10) : 6;

  // Keep request simple and compatible: only pass languageCode.
  // We'll sort and slice locally to satisfy UI needs.
  const locale = languageCode || process.env.GOOGLE_PLACES_LANGUAGE || "en-GB";
  params.set("languageCode", locale);

  const requestUrl = `${GOOGLE_PLACES_ENDPOINT}/${resolvedPlaceId}?${params.toString()}`;

  try {
    const response = await fetch(requestUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": apiKey,
        "X-Goog-FieldMask": "displayName,rating,userRatingCount,reviews",
      },
      // Cache responses for an hour to avoid hammering the quota while keeping content fresh
      next: { revalidate: 60 * 60 },
    });

    if (!response.ok) {
      const errorText = await response.text();
      return {
        reviews: [],
        error: `Google Places API error: ${response.status} ${errorText}`,
      };
    }

    const data = (await response.json()) as GooglePlacesResponse;

    const minRatingValue = parseMinimumRating(minimumRating);

    let rawReviews = Array.isArray(data.reviews) ? data.reviews : [];

    // If newest is requested, sort client-side by publishTime desc when available
    if (sortOrder === "newest") {
      rawReviews = [...rawReviews].sort((a, b) => {
        const at = a.publishTime ? Date.parse(a.publishTime) : 0;
        const bt = b.publishTime ? Date.parse(b.publishTime) : 0;
        return bt - at;
      });
    }

    const filtered = rawReviews
      .filter((review) => (review.rating ?? 0) >= minRatingValue)
      .map((review) => normaliseReview(review))
      .filter((review): review is GoogleReview => Boolean(review))
      .slice(0, maxReviews);

    return {
      placeName: data.displayName?.text,
      averageRating: data.rating,
      userRatingCount: data.userRatingCount,
      reviews: filtered,
    };
  } catch (error) {
    return {
      reviews: [],
      error: error instanceof Error ? error.message : "Failed to fetch Google reviews.",
    };
  }
}
