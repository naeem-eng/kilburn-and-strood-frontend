import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";

const MODEL_TAG_MAP: Record<string, string> = {
  page: "pages",
  service: "services",
  office: "offices",
  event: "events",
  article: "articles",
  people: "peoples",
  footer: "footer",
  header: "header",
  "global-setting": "global-setting",
};

export async function POST(req: NextRequest) {
  try {
    if (req.headers.get('x-revalidation-secret') !== process.env.REVALIDATION_SECRET)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const model = body?.model;
    const tag = model ? (MODEL_TAG_MAP[model] ?? "strapi-all") : "strapi-all";

    // This marks the cache as expired immediately
    revalidateTag(tag, { expire: 0 });

    return NextResponse.json({ revalidated: true, tag });
  } catch {
    return NextResponse.json({ error: "Webhook failed" }, { status: 500 });
  }
}
