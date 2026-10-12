import React from 'react';
import PeopleBio from '@/components/general/people-bio';
import { Text, TextLg, TextMd } from '@/components/helpers/typography';
import PeopleExpertise from '@/components/standard-components/expertise';
import ContentCarousal from '@/components/general/content-carousal';
import PeopleCard from '@/components/general/people-card';
import PeopleCardsContainer from '@/components/general/people-cards-container';
import TabbedBodyContent from '@/components/general/tabbed-body-content';
import InlineImageAndVideo from '@/components/general/inline-image-and-video';
import { notFound } from 'next/navigation';
import { fetchPeopleIndividual } from '@/requests/people-requests';
import { fullCtaParser } from '@/parsers/fullcta-parser/fullcta-parser';
import peopleBioParser from '@/parsers/people-bio-parser';
import Body from '@/components/general/body';
import TestimonialSlider from '@/components/general/testimonial-slider';
import FullCta from '@/components/general/full-cta';
import { draftMode } from 'next/headers';
import FullPageSlider from '@/components/interactive/fullpage/full-pageslider';
import { getSeoObject } from '@/utils/utils';

 export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {

  const resolvedParams = await params;
  const slug = resolvedParams.slug || "home";
  const { isEnabled } = await draftMode();
  const page = await fetchPeopleIndividual({
    slug,
    populate: "*",
    isPreview: isEnabled,
  });

  if (!page) notFound();

  const data = page;
  const { seo } = data;

  return getSeoObject(seo, data);
}



const People = async ({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) => {

  const resolvedParams = await params;
  const slug = resolvedParams.slug || "home";
  
  const { isEnabled } = await draftMode();

  const page = await fetchPeopleIndividual({
    slug,
    populate: {
      "highlighted_testimonials": {
        populate: "*"
      },
      "events": {
        populate: "*"
      },
      "articles": {
        populate: "*"
      },
      "services": {
        populate: "*"
      },
      "sector": {
        populate: "*"
      },
      "displayed_sectors": true,
      "full_cta": {
        populate: {
          fullCTAComponent: {
            populate: "*"
          }
        }
      },
      "header_photo": {
        populate: "*"
      },
      "testimonial": {
        populate: "*"
      },
      "people_roles": {
        populate: "*"
      },
      "vcard_file": {
        populate: "*"
      },
      "pattern_image": {
        populate: "*"
      },
    },
    isPreview: isEnabled,
  }); 
  // // //console.log({page})
  if (!page) notFound();

  const data = page; 
  // //console.log({data})

  const getFullCtaParser = fullCtaParser(data?.fullCta);
  const getPeopleBioParser = peopleBioParser(data);



  // //console.log(getPeopleBioParser)
  return (
    <div className="relative z-1 bg-white">
        <FullPageSlider interactive={data?.type === "interactive"}>

          <PeopleBio
            isAnimation={false} 
            index={3}
            backCTA={true} 
            backCTAText={"Back to People"}
            {...getPeopleBioParser?.bio}
          />
           
          
          { !(getPeopleBioParser?.roleList?.join(',')?.toLowerCase()?.includes("trainee")) &&
            <>
              {(getPeopleBioParser?.services?.length || getPeopleBioParser?.sectors?.length) ? <PeopleExpertise 
                  role={getPeopleBioParser?.roleList?.join(',')?.toLowerCase()}
                  title={`${getPeopleBioParser?.bio?.title}'s expertise`}
                  color={getPeopleBioParser?.bio?.color || 'bright-red'}
                  services={getPeopleBioParser?.services}
                  sectors={getPeopleBioParser?.sectors}
              /> : null}
            </>
          }

          {getPeopleBioParser?.biography && <Body className={`md:mt-xl ${getPeopleBioParser?.qualifications.length === 0 ? 'mb-2xl' : ''}`} title={"Biography"} content={getPeopleBioParser?.biography}/>}


           {Boolean(getPeopleBioParser?.contentCarousal?.items?.length) && <ContentCarousal 
              title={getPeopleBioParser?.contentCarousal?.title}
              items={getPeopleBioParser?.contentCarousal?.items || []}
            />  }

            {(getPeopleBioParser?.qualifications.length > 0) && <TabbedBodyContent
              className={`px-sm md:px-xl ${getPeopleBioParser?.testimonialsContainer?.testimonials?.length === 0 ? 'pb-3xl' : 'pb-0!'}`}
              color={getPeopleBioParser?.bio?.color}
              tabsType="vertical"
              tabs={getPeopleBioParser?.qualifications?.map((item:any, index:number) => ({
                id: index,
                title: item?.title,
                content: item?.content
              }))}
            />}

            {/* <TestimonialSlider */}

            {getPeopleBioParser?.testimonialsContainer && <TestimonialSlider {...getPeopleBioParser?.testimonialsContainer} isAnimation={false} />}

            {getFullCtaParser && <FullCta {...getFullCtaParser.props} />}
        </FullPageSlider>
    </div>
  );
}


export default People; 