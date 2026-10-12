import TextHeader from '@/components/general/text-header';
import { menuParser } from '@/parsers/global-parser';
import { strapiFetch } from '@/requests/lib/strapi';
import Link from 'next/link';

export const revalidate = 3600;


 

const SitemapLink = ({ href, label }: { href: string; label: string }) => (
  <li>
    <Link href={href} className="text-dark-blue hover:underline hover:text-bright-red transition-colors">
      {label}
    </Link>
  </li>
);

const SitemapSection = ({ title, children, slug }: any) => {
  if(slug) return (
   <div  className="mb-10 px-sm md:px-xl block ">
      {title && <Link href={slug} className="font-modern-era-medium text-2md mb-4 hover:underline hover:text-bright-red transition-colors block">
        {title}
      </Link>}
      {children &&<ul className="space-y-2 list-disc pl-5">
        {children}
      </ul>}
    </div>
  )
  return (
    <div className="mb-10 px-sm md:px-xl">
      {title && <h2 className="font-modern-era-medium text-lg mb-4">{title}</h2>}
      {children && <ul className="space-y-2">
        {children}
      </ul>}
    </div>
  )
};

export default async function SiteMapPage() {
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
                                                          populate: true
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
  //console.log({parsers})
  
  return (
    <div className=" mt-(--padding-top) min-h-screen bg-white z-10 relative">

      <TextHeader title="Sitemap" className="mb-sm h-auto!" />

      {/* Static pages */}
      <SitemapSection title={"Home"} key={"/"} slug={"/"}/>

      {
        parsers?.map((s: any) => (
          <SitemapSection title={s.title} key={s.seoSlug} slug={s.url}>
            {s.children?.map((c: any) => (
              <SitemapLink key={c.seoSlug} href={`${c.url}`} label={c.title} />
            ))}
          </SitemapSection>
        ))
      }

    </div>
  );
}