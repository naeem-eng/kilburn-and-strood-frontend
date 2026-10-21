import { strapiFetch } from "@/requests/lib/strapi";
import { NextRequest, NextResponse } from "next/server";

// Only the fields the filters parser reads (title, falling back to name).
// Fetches go through strapiFetch, so they are cached with the collection tag
// plus "strapi-all" and revalidated by the Strapi webhook.
const collections: Record<string, { url: string; fields: string[] }> = {
    expertises: { url: "/api/expertises", fields: ["title"] },
    sectors: { url: "/api/sectors", fields: ["title"] },
    roles: { url: "/api/people-roles", fields: ["title"] },
    services: { url: "/api/services", fields: ["title", "name"] },
    offices: { url: "/api/offices", fields: ["title", "name"] },
    article_types: { url: "/api/article-types", fields: ["title"] },
    event_types: { url: "/api/event-types", fields: ["title"] },
};

type FilterItem = { id: number; documentId: string; title?: string | null; name?: string | null };
type FilterResponse = { data?: FilterItem[] };

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const keys = searchParams.get("keys");

  if(!keys) {
    return NextResponse.json({ error: "No keys provided" }, { status: 400 });
  }

  const requested = [...new Set(keys.split(",").map((k) => k.trim()).filter(Boolean))];
  const invalid = requested.filter((k) => !Object.hasOwn(collections, k));

  if (invalid.length) {
    return NextResponse.json({ error: `Invalid keys: ${invalid.join(", ")}` }, { status: 400 });
  }

  const results = await Promise.all(
    requested.map((key) =>
      strapiFetch<FilterResponse>(collections[key].url, {
        fields: collections[key].fields,
        // Strapi deep-populates every relation when populate is omitted
        populate: false,
        pagination: { pageSize: 500 },
      })
    )
  );

  const data: Record<string, FilterItem[]> = {};
  requested.forEach((key, i) => {
    const items = results[i]?.data;
    if (items) data[key] = items;
  });

  return NextResponse.json(data);
}
