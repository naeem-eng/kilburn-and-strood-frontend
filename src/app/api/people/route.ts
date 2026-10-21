import { queryPeoples } from "@/requests/listing-requests/listing-queries";
import { NextRequest, NextResponse } from "next/server";

// Filtering / load-more proxy for the browser. The first page is rendered on the server by the
// listing page itself (same query), so content is present in the HTML without JavaScript.
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  return NextResponse.json(await queryPeoples(searchParams));
}
