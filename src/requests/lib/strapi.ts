import { toCamelCaseDeep } from "@/utils/utils";
// import { unstable_cache } from "next/cache";
import qs from "qs";

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL!;
const TOKEN = process.env.STRAPI_API_TOKEN;
 export async function strapiFetch<T = any | undefined>(
  path: string,
  query?: Record<string, any>,
  init?: RequestInit,
  isPreview: boolean = false
): Promise<T | undefined> {

  const fullQuery = {
    ...query,
    ...(isPreview ? { status: "draft" } : { status: "published" }),
  };

  const url =
    STRAPI_URL +
    path +
    (fullQuery
      ? `?${qs.stringify(fullQuery, {
          encodeValuesOnly: true,
          arrayFormat: "indices",
        })}`
      : "");

  const headers: HeadersInit = {
    ...(TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {}),
     'Cache-Control': 'public, s-maxage=31536000, stale-while-revalidate'
  };

  const tag = path.replace("/api/", "");
  // single-entry paths (e.g. "services/abc123") also get their collection tag ("services"),
  // so the webhook's revalidateTag("services") clears them too — otherwise they're cached forever
  const collectionTag = tag.split(/[/?]/)[0];
  const tags = [...new Set([tag, collectionTag, 'strapi-all'])];

//   console.log("📡 Requesting:", tag, url);

  const isDev = process.env.NODE_ENV === 'development';

  const res = await fetch(url, {
    ...init,
    headers,
    cache: (isPreview || isDev) ? 'no-store' : 'force-cache',
    next: isDev ? undefined : {
      revalidate: false,
      tags
    },
  });

  if (!res.ok) {
    console.warn(`strapiFetch ${res.status} ${res.statusText}: ${path}`);
    return undefined;
  }

  const data = await res.json();
  return toCamelCaseDeep(data);

}