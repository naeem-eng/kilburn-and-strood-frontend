import React from 'react';
import TextImageSlider from '@/components/general/text-image-slider';
import ArticleContainer from '@/components/general/article-container';
import FullCta from '@/components/general/full-cta';
import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import fetchArticlesSetting from '@/requests/articles-setting-requests';
import { FullPageSlider } from '@/components/interactive/fullpage';
import Sections from '@/components/sections';
import { getComponentsPopulateObj, getSeoObject } from '@/utils/utils';
import { fullCtaParser } from '@/parsers/fullcta-parser/fullcta-parser';

export const dynamic = 'force-static';
export const fetchCache = 'force-cache'; // Forces all fetches to cache, even with Auth headers
export const revalidate = 3600; 


export async function generateMetadata() {

  // const { isEnabled } = await draftMode();

  const page = await fetchArticlesSetting({
    populate: "*",
    isPreview: false
  });

  if (!page) notFound();
  const { seo } = page;
  return getSeoObject(seo, page);
}


export default async function ArticleList() {
 
  const draft = await draftMode();
  const isPreview = draft.isEnabled;

  const page = await fetchArticlesSetting({
    populate: {
      hero_sections: {
          on: {
              ...getComponentsPopulateObj()
          },
      },
      full_cta: {
        populate: {
          fullCTAComponent: {
            populate: "*"
          }
        }
      },
      articles: {
        populate: "*"
      },
    },
    isPreview: isPreview
  });

  if (!page) notFound();
  const data = page
  const getFullCtaParser = fullCtaParser(data?.fullCta);

  return (
    <div className="relative z-10 bg-white ">
        {data?.heroSections &&
            <FullPageSlider interactive={data?.type === "interactive"}>
                {data?.heroSections && <Sections sections={data?.heroSections || []} isAnimation={false} />}
                  <ArticleContainer />
                  {
                    data?.fullCta && <FullCta {...getFullCtaParser?.props} />
                  }
            </FullPageSlider>}
  
    </div>
  );
}
