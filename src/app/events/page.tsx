
import TextHeader from '@/components/general/text-header';
import EventContainer from '@/components/general/event-container';
import { queryEvents } from '@/requests/listing-requests/listing-queries';
import fetchEventsSetting from '@/requests/events-setting-requests';
import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import { getComponentsPopulateObj, getSeoObject } from '@/utils/utils';
import { fullCtaParser } from '@/parsers/fullcta-parser/fullcta-parser';
import { FullPageSlider } from '@/components/interactive/fullpage';
import Sections from '@/components/sections';
import FullCta from '@/components/general/full-cta';

export const dynamic = 'force-static';
export const fetchCache = 'force-cache'; // Forces all fetches to cache, even with Auth headers
export const revalidate = 3600; 

export async function generateMetadata() {

  const page = await fetchEventsSetting({
    populate: "*",
    isPreview: false
  });

  if (!page) notFound();
  const { seo } = page;

  return getSeoObject(seo, page);
}


export default async function Events() {

  const draft = await draftMode();
  const isPreview = draft.isEnabled;

  const page = await fetchEventsSetting({
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
      events: {
        populate: "*"
      },
    },
    isPreview: isPreview
  });

  if (!page) notFound();
  const data = page
  const getFullCtaParser = fullCtaParser(data?.fullCta);
  // first page rendered on the server so the listing is in the HTML (filters / load more stay client-side)
  // page size matches EventContainer's pager so "Load more" continues from page 2
  const initialEvents = await queryEvents(new URLSearchParams({ page: '1', pageSize: '5' }));

  return (
    <div className="relative z-10 min-h-screen bg-white">

        {data?.heroSections &&
          <FullPageSlider interactive={data?.type === "interactive"}>
              {data?.heroSections && <Sections sections={data?.heroSections || []} isAnimation={false} />}
               <EventContainer color='bright-red'
                  className='mt-md'
                  initialData={initialEvents} />
                  {
                    getFullCtaParser && <FullCta {...getFullCtaParser?.props} />
                  }
          
          </FullPageSlider>}
    </div>
  );
}
