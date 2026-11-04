import { queryGridFilters } from "@/requests/grid-requests/grid-queries";
import { NextRequest, NextResponse } from "next/server";

// Grid section dropdown options: ?enums=Sectors,Peoples&renders=Insights,Events
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  return NextResponse.json(await queryGridFilters(searchParams));
}
