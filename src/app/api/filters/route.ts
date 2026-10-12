import { strapiFetch } from "@/requests/lib/strapi";
import { NextRequest, NextResponse } from "next/server";

const urls = [
    {
        key: "expertises",
        url: "/api/expertises"
    },
    {
        key: "sectors",
        url: "/api/sectors"
    },
    {
        key: "roles",
        url: "/api/people-roles"
    },
    {
        key: "services",
        url: "/api/services"
    },
    {
        key: "offices",
        url: "/api/offices"
    },
    {
        key: "article_types",
        url: "/api/article-types"
    },
    {
        key: "event_types",
        url: "/api/event-types"
    }
] as {
    key: string;
    url: string;
}[];


export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const keys = searchParams.get("keys");

  if(!keys) {
    return NextResponse.json({ error: "No keys provided" }, { status: 400 });
  }

  
  const tempKeys = keys?.split(",");
  let data = {} as any;
  for (let i = 0; i < tempKeys?.length; i++) {
    const key = tempKeys[i];
    if(!key) continue;

    const temp = await strapiFetch(urls?.find((x:any)=>x?.key==key)?.url as string, {
      populate: "*",
    });

    if (temp?.data) data[key] = temp?.data;
  }

  return NextResponse.json(data);
}