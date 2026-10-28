// app/sitemap.xml/route.ts
import { menuParser } from '@/parsers/global-parser';
import { strapiFetch } from '@/requests/lib/strapi';

export const revalidate = 3600;

const escapeXml = (url: string) =>
  url
    .replace(/&/g, '&amp;')
    .replace(/'/g, '&apos;')
    .replace(/"/g, '&quot;')
    .replace(/>/g, '&gt;')
    .replace(/</g, '&lt;');


export async function GET() {
  const baseUrl = 'https://kilburn-and-strode-gray.vercel.app';

    const pages = await strapiFetch(
        "/api/header",
        {
          populate: {
              nav_settings: {
                  populate: {
                      sub_nav_settings: {
                          populate: "*"
                      },
                      nav_megamenu_container: {  
                          populate: { 
                                right_article: {
                                      populate: "*"
                              },
                              mega_menu_settings : { 
                                  populate: {
                                      offices_sub_items: {
                                          populate: "*"
                                      },
                                      pages_sub_items: {
                                          populate: "*"
                                      },
                                      events_sub_items: {
                                          populate: "*"
                                      },
                                      services_sub_items: {
                                          populate: "*"
                                      },
                                      sub_nav_items: { 
                                          populate: {
                                              second_level_nav_settings: {
                                                  populate: { 
                                                      second_level_nav_items: {
                                                          populate: "*"
                                                      },
                                                      services_second_level_items: {
                                                          populate: "*"
                                                      }
                                                  }
                                              },
                                          }
                                      }
                                  }
                              }
                          }
                      }
                  }
              }
          }
,
      }, undefined, false);


  const parsers = menuParser(pages?.data);

  const urls = [
    { url: baseUrl, priority: 1.0 },
    ...(parsers?.map((s: any) => ({ url: `${baseUrl}${s.url}`, priority: 0.8 })) || []),
    ...(parsers?.flatMap((s: any) => s.children?.map((c: any) => ({ url: `${baseUrl}${c.url}`, priority: 0.6 })) || []) || []),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.map(({ url, priority }) => `
  <url>
    <loc>${escapeXml(url)}</loc>
    <priority>${priority}</priority>
    <lastmod>${new Date().toISOString()}</lastmod>
  </url>`).join('')}
</urlset>`;

  return new Response(xml, {
    headers: { 'Content-Type': 'application/xml' },
  });
}