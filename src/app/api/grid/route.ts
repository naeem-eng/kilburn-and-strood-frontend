import { queryGrid } from "@/requests/grid-requests/grid-queries";
import { NextRequest, NextResponse } from "next/server";

// Grid section cards: ?renders=Insights,Events&enums=Sectors&sectors=A,B&search=x&page=2
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  return NextResponse.json(await queryGrid(searchParams));
}
