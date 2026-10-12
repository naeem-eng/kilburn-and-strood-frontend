import { strapiFetch } from "@/requests/lib/strapi";
import { NextRequest, NextResponse } from "next/server";

const COLLECTIONS = [
  { key: "services", endpoint: "/api/services", nameField: "name"  },
  { key: "peoples",  endpoint: "/api/peoples",  nameField: "name"  },
  { key: "insights", endpoint: "/api/articles", nameField: "title" },
  { key: "events",   endpoint: "/api/events",   nameField: "title" },
] as const;


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
  const page     = Math.max(1, Number(searchParams.get("page")     ?? 1));
  const pageSize = Math.max(1, Number(searchParams.get("pageSize") ?? 10));

  const requestedKeys = searchParams.getAll("collections");
  const activeCollections = requestedKeys.length
    ? COLLECTIONS.filter(c => requestedKeys.includes(c.key))
    : [...COLLECTIONS];
    
  const dataResults = await Promise.allSettled(
    activeCollections.map(({ key, endpoint }) =>
      strapiFetch(endpoint, {
        ...(search ? { filters: buildFilters(search) } : {}),
        populate: "*",
        pagination: { page, pageSize },
      }).then(res => ({
        key,
        data:       res?.data            ?? [],
        pagination: res?.meta?.pagination ?? null,
      }))
    )
  );

  const data: Record<string, any[]> = {};
  const pagination: Record<string, any> = {};
  const errors: Record<string, string> = {};

  dataResults.forEach((result, i) => {
    const key = activeCollections[i].key;
    if (result.status === "fulfilled") {
      data[key]       = result.value.data;
      pagination[key] = result.value.pagination;
    } else {
      data[key]   = [];
      errors[key] = result.reason?.message ?? "Unknown error";
    }
  });

  return NextResponse.json({
    data,
    pagination,
    meta: {
      page,
      pageSize,
      ...(Object.keys(errors).length ? { errors } : {}),
    },
  });
}