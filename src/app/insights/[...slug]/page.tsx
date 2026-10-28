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
import { exploringParser } from '@/parsers/exploring-parser/exploring-parser';
import Link from 'next/link';
import RightArrowIcon from '@/components/helpers/icons/rightarrow-icon/rightarrow-icon';
import { getInTouchParser } from '@/parsers/get-in-touch-parser/get-in-touch-parser';
import GetInTouch from '@/components/general/get-in-touch/get-in-touch';


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
      },
      "contact":{
        populate: "*"
      }
    },
    isPreview: isEnabled,
  });

  console.log(resolvedParams.slug, !page, {page});

  if (!page) notFound();

  const data = page;
  console.log({data});

  // const speakers = speakerParser(data?.author);
  const guestSpeakers = guestSpeakerParser(data?.guestSpeakers);
  const getFullCtaParser = fullCtaParser(data?.fullCta);
  const contactParser    = getInTouchParser(data?.contact);
  const getExploringParser = exploringParser(data?.services, data?.sectors);

  // console.log({getExploringParser})

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
        

        <div className="flex flex-col md:flex-row mt-4xl gap-y-[5vw] md:gap-x-[5vw] px-sm md:px-xl">
          {speakers?.props && <div className='w-full md:max-w-1/2'>
                <TextXl>
                    Written by
                </TextXl>
                <div className={`mt-md flex flex-row flex-wrap gap-y-md bg-white justify-start items-start pb-lg content-start min-w-full ${(guestSpeakers?.props || data?.fullCta) ? 'mb-xl' : ''}`}>
                    {speakers?.props.map((person: any) => (
                        <PeopleCard type="list" {...person} key={person?.slug} />
                    ))}
                </div>
          </div>}

          {getExploringParser?.servicesList?.length > 0 || getExploringParser?.sectorsList?.length > 0 ? <div className='w-full md:max-w-1/2 '>
                <TextXl>
                    Keep Exploring
                </TextXl>
                <div className="mt-md flex flex-col">
                  {[
                    ...(getExploringParser?.servicesList || []),
                    ...(getExploringParser?.sectorsList || []),
                  ].map((item: any, i: number) => (
                    <Link
                      key={item.href + i}
                      href={item.href?.startsWith("/") ? item.href : `/${item.href}`}
                      className="group block border-t-2 border-bright-red py-md"
                    >
                      <Text as="span" className="block text-bright-red font-modern-era-medium mb-2xs">
                        {item.type === "sectors" ? "Sector" : "Service"}
                      </Text>
                      <div className="flex items-center justify-between gap-x-md">
                        <TextLg as="span" className="text-dark-gray">{item.title}</TextLg>
                        <RightArrowIcon
                          fill="currentColor"
                          className="w-lg h-lg shrink-0 text-dark-gray transition-transform duration-300 ease-in-out group-hover:translate-x-1"
                        />
                      </div>
                    </Link>
                  ))}
                </div>
          </div> : <></>}
        </div>
        
        
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
        {contactParser && <GetInTouch {...contactParser.props} />}
      </FullPageSlider>
      </div>
  );
}

export default Article;
