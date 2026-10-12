import PeopleBio from '@/components/general/people-bio';
import { Text, TextLg, TextMd, TextXl, TitleMd, TitleSm } from '@/components/helpers/typography';
import ArticleHeader from '@/components/general/article-header';
import ArticleHero from '@/components/general/article-hero';
import InlineImageAndVideo from '@/components/general/inline-image-and-video';
import Stats from '@/components/general/stats';
import fetchArticlesIndividual from '@/requests/articles-requests/articles-individual-request';
import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';
import { getComponentsPopulateObj, getSeoObject, getStrapiMedia } from '@/utils/utils';
import Sections from '@/components/sections';
import { fullCtaParser } from '@/parsers/fullcta-parser/fullcta-parser';
import FullCta from '@/components/general/full-cta';
import { guestSpeakerParser, speakerParser } from '@/parsers/speaker-parser/speaker-parser';
import PeopleCard from '@/components/general/people-card';
import { FullPageSlider } from '@/components/interactive/fullpage';


export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {

  const resolvedParams = await params;
  const slug = resolvedParams.slug || "home";
  const { isEnabled } = await draftMode();
  const page = await fetchArticlesIndividual({
    slug,
    populate: "*",
    isPreview: isEnabled,
  });

  if (!page) notFound();

  const data = page;
  const { seo } = data;
  return getSeoObject(seo, data);
}



const Article = async ({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) => {
  const resolvedParams = await params;
  const slug = resolvedParams.slug || "home";
  
  const { isEnabled } = await draftMode();

  const page = await fetchArticlesIndividual({
    slug,
    populate: {
      "sections": {
        on: {
          ...getComponentsPopulateObj()
        },
      },
      "article_types": {
        populate: "*"
      },
      "authour": {
        populate: "*"
      },
      "services": {
        populate: "*"
      },
      "sectors": {  
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
      "color": {
        populate: "*"
      },
      "guest_speakers": {
        populate: "*"
      }
    },
    isPreview: isEnabled,
  });

  if (!page) notFound();

  const data = page;
  // //console.log(data);

  const speakers = speakerParser(data?.authour);
  const guestSpeakers = guestSpeakerParser(data?.guestSpeakers);
  const getFullCtaParser = fullCtaParser(data?.fullCta);

  return (

    <div className="relative z-1 min-h-screen bg-white">
    <FullPageSlider interactive={false}>

        <ArticleHeader 
          title={data?.title}
          articalType={data?.articleTypes}
          date={data?.publishDate}
          shareable={false}
          color={data?.color?.name}
        />

        <ArticleHero 
          heroType={"image"}
          mediaSrc={getStrapiMedia(data?.featuredImage, 'large')}
          mediaAlt={data?.featuredImage?.alternativeText}
          mediaWidth={data?.featuredImage?.width}
          mediaHeight={data?.featuredImage?.height}
          color={data?.color?.name || "bright-red"}
        />


        {data?.sections && <Sections color={data?.color?.name} sections={data?.sections || []} isAnimation={false} />}

        {speakers?.props && <div className='px-sm md:px-xl mt-4xl'>
              <TextXl>
                  Written by
              </TextXl>
              <div className={`mt-md flex flex-row flex-wrap gap-y-md bg-white justify-start items-start pb-lg content-start -mx-xs min-w-full ${(guestSpeakers?.props || data?.fullCta) ? 'mb-xl' : ''}`}>
                  {speakers?.props.map((person: any) => (
                      <PeopleCard type="list" {...person} key={person?.slug} />
                  ))}
              </div>
          </div>}
        
        {guestSpeakers?.props && <div className={`${speakers?.props ? 'px-sm md:px-xl' : 'px-sm md:px-xl mt-4xl'  }`}>
              <TextXl>
                  Guest author
              </TextXl>
              <div className={`mt-md flex flex-row flex-wrap gap-y-md bg-white justify-start items-start pb-lg content-start -mx-xs min-w-full ${(data?.fullCta) ? 'mb-xl' : ''}`}>
                  {guestSpeakers?.props.map((guest: any, i: number) => (
                      <PeopleCard type="list" {...guest} key={i} />
                  ))}
              </div>
          </div>}

        {data?.fullCta && <FullCta {...getFullCtaParser?.props} />}
      </FullPageSlider>
      </div>
  );
}

export default Article;
