import { strapiFetch } from "@/requests/lib/strapi";
import { NextRequest, NextResponse } from "next/server";

const COLLECTIONS = [
  { key: "services", endpoint: "/api/services", nameField: "name"  },
  { key: "peoples",  endpoint: "/api/peoples",  nameField: "name"  },
  { key: "insights", endpoint: "/api/articles", nameField: "title" },
  { key: "events",   endpoint: "/api/events",   nameField: "title" },
] as const;

type CollectionKey = typeof COLLECTIONS[number]["key"];

const buildFilters = (search: string) => {
  if (!search) return {};
  return {
    $or: [
      { name:  { $containsi: search } },
      { title:  { $containsi: search } },
      { search_terms: { $containsi: search } },
    ],
  };
};


export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search   = searchParams.get("q") ?? "";
   
  
  const requestedKeys = searchParams.getAll("collections");
  const activeCollections = requestedKeys.length
    ? COLLECTIONS.filter(c => requestedKeys.includes(c.key))
    : [...COLLECTIONS];

  const countResults = await Promise.allSettled(
    COLLECTIONS.map(({ key, endpoint }) =>
      strapiFetch(endpoint, {
        ...(search ? { filters: buildFilters(search) } : {}),
        populate: true,           // only need IDs for counting
        pagination: { page: 1, pageSize: 1 },
      }).then(res => ({ key, total: res?.meta?.pagination?.total ?? 0 }))
    )
  );

  const totals: Record<string, number> = {};
  countResults.forEach((result, i) => {
    const key = COLLECTIONS[i].key;
    totals[key] = result.status === "fulfilled" ? result.value.total : 0;
  });
  const totalResults = Object.values(totals).reduce((sum, n) => sum + n, 0);
  // //console.log("countResults", countResults, "Totals:", totals, "Total Results:", totalResults);

 

  return NextResponse.json({
    meta: { 
      totalResults,
      totals
    },
  });
}