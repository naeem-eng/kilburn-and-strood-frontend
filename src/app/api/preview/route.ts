import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("url") || "/";
  
  // // //console.log({slug}, request.url)

  const draft = await draftMode();
  draft.enable();

  redirect(slug);
}
