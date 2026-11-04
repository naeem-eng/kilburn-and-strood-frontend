import FullCta from '@/components/general/full-cta';
import PageCarousal from '@/components/general/page-carousal';
import PreviewListener from '@/components/general/preview_listner/preview_listner';
import PrimaryHeaderComponent from '@/components/general/primary-hero/primary-header-component';
import { FullPageSlider } from '@/components/interactive/fullpage';
import Sections from '@/components/sections';
import { fullCtaParser } from '@/parsers/fullcta-parser/fullcta-parser';
import sectionParser from '@/parsers/section-parser';
import { strapiFetch } from '@/requests/lib/strapi';
import { fetchSingle } from '@/requests/page-requests';
import { utils } from '@/utils';
import { getComponentsPopulateObj, getSeoObject } from '@/utils/utils';
import { draftMode } from 'next/headers';
// import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import { hasGridSection } from '@/parsers/section-parser/grid-parser';
import React, { memo, useMemo } from 'react';

export const dynamic = 'force-static';
export const fetchCache = 'force-cache'; // Forces all fetches to cache, even with Auth headers
export const revalidate = false; 

export async function generateMetadata() {
  // const { isEnabled } = await draftMode();

  const page = await fetchSingle({
    slug: "home",
    populate: "*",
    isPreview: false
  });

  if (!page) notFound(); 
  const homePage = page
  const { seo } = homePage;
  return getSeoObject(seo, homePage);
  
}


const Home = async () => {

  const draft = await draftMode();
  const isPreview = draft.isEnabled;

  const page = await fetchSingle({
    slug: "home",
    populate: {
      sections: {
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
      }
    },
    isPreview: isPreview
  });




  if (!page) notFound();
  const data = page
  // a grid or the allow_carousal carousel needs normal scrolling, so no fullpage scroll hijack on those pages
  const isAnimation = data?.type === "interactive" && !hasGridSection(data?.sections) && !data?.allowCarousal;
  const isLightAnimation = !isAnimation;

  const getFullCtaParser = fullCtaParser(data?.fullCta);


  return (
    <div id={data?.documentId} className="relative z-9 bg-white">
      
      {isPreview && <PreviewListener />}
      
      <FullPageSlider interactive={isAnimation}>
        <Sections sections={data?.sections || []} isAnimation={isAnimation} isLightAnimation={isLightAnimation} />
        {/* full cta */}
        <PageCarousal collection="pages" documentId={data?.documentId} slug={data?.slug} isPreview={isPreview} />
        {getFullCtaParser && <FullCta {...getFullCtaParser.props} />}
      </FullPageSlider>
      
      
    </div>
  );
}

export default memo(Home);
