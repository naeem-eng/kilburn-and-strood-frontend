import EventFullCards from '@/components/general/event-full-cards';
import FullCta from '@/components/general/full-cta';
import GetInTouch from '@/components/general/get-in-touch/get-in-touch';
import PeopleCard from '@/components/general/people-card';
import { Button } from '@/components/helpers/buttons';
import { TextLg, TextMd, TextXl, TitleMd, TitleSm } from '@/components/helpers/typography';
import { FullPageSlider } from '@/components/interactive/fullpage';
import Sections from '@/components/sections';
import { eventParser } from '@/parsers/event-parser/event-parser';
import { fullCtaParser } from '@/parsers/fullcta-parser/fullcta-parser';
import { getInTouchParser } from '@/parsers/get-in-touch-parser/get-in-touch-parser';
import { guestSpeakerParser, speakerParser } from '@/parsers/speaker-parser/speaker-parser';
import fetchEventsIndividual from '@/requests/events-requests/events-individual-request';
import { getComponentsPopulateObj, getSeoObject } from '@/utils/utils';
import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';


export const revalidate = 3600; 

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {

  const resolvedParams = await params;
  const slug = resolvedParams.slug || "home";
  const { isEnabled } = await draftMode();
  const page = await fetchEventsIndividual({
    slug,
    populate: "*",
    isPreview: isEnabled,
  });

  if (!page) notFound();

  const data = page;
  const { seo } = data;

  return getSeoObject(seo, data);
}



const Event = async ({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) => {
  const resolvedParams = await params;
  const slug = resolvedParams.slug || "home";
  
  const { isEnabled } = await draftMode();

  const page = await fetchEventsIndividual({
    slug,
    populate: {
      "sections": {
        on: {
          ...getComponentsPopulateObj()
        },
      },
      "event_types": {
        populate: "*"
      },
      "speakers": {
        populate: "*"
      },
      "services": {
        populate: "*"
      },
      "full_cta": {
        populate: {
          fullCTAComponent: {
            populate: "*"
          }
        }
      },
      "featured_image": {
        populate: "*"
      },
      "cta": {
        populate: "*"
      },
      "guest_speakers": {
        populate: "*"
      },
      "contact": {
        populate: "*"
      }
    },
    isPreview: isEnabled,
  }); 

  if (!page) notFound();

  const data = page; 



  const event = eventParser(data);
  const speakers = speakerParser(data?.speakers);
  const guestSpeakers = guestSpeakerParser(data?.guestSpeakers);
  const getFullCtaParser = fullCtaParser(data?.fullCta);
  const contactParser = getInTouchParser(data?.contact);

  return (
    <div className="relative z-1 min-h-screen bg-white pt-[20vw] md:pt-[10vw]">
        <FullPageSlider interactive={false}>

        <div className='flex-1 w-full min-h-0'>

            <div className='mb-md px-sm md:px-xl '>
                <Button href='/events' type='text' textColor='text-dark-gray' icon={'left-arrow'}>
                    Back
                </Button>
            </div>

            {event?.props &&<div className='px-sm md:px-xl '>
                <EventFullCards noLink={true}
                    {...event?.props}
                />
            </div>}


            <Sections color={event?.props?.color || "bright-red"} sections={data?.sections || []} isAnimation={false} />

            {speakers?.props && <div className='px-sm md:px-xl '>
                <TextXl>
                    Speakers
                </TextXl>
                <div className={`mt-md flex flex-row flex-wrap gap-y-md bg-white justify-start items-start pb-lg content-start -mx-xs min-w-full ${(guestSpeakers?.props || data?.fullCta) ? 'mb-xl' : ''}`}>
                    {speakers?.props.map((person: any) => (
                        <PeopleCard type="list" {...person} key={person?.slug} />
                    ))}
                </div>
            </div>}

            {guestSpeakers?.props && <div className='px-sm md:px-xl '>
                <TextXl>
                    Guest speakers
                </TextXl>
                <div className={`mt-md flex flex-row flex-wrap gap-y-md bg-white justify-start items-start pb-lg content-start -mx-xs min-w-full ${(data?.fullCta) ? 'mb-xl' : ''} `}>
                    {guestSpeakers?.props.map((guest: any, i: number) => (
                        <PeopleCard type="list" {...guest} key={i} />
                    ))}
                </div>
            </div>}

            {getFullCtaParser && <FullCta {...getFullCtaParser?.props} />}
            {contactParser && <GetInTouch {...contactParser.props} />}
        </div>
        </FullPageSlider>
    </div>
  );
}


export default Event;