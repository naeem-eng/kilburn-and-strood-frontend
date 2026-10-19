import FullCta from '@/components/general/full-cta';
import GetInTouch from '@/components/general/get-in-touch';
import KeyContacts from '@/components/general/key-contacts';
import RelatedContentCarousel from '@/components/general/related-content-carousel';
import { FullPageSlider } from '@/components/interactive/fullpage';
import Sections from '@/components/sections';
import { fullCtaParser } from '@/parsers/fullcta-parser/fullcta-parser';
import { getInTouchParser } from '@/parsers/get-in-touch-parser/get-in-touch-parser';
import { getKeyContactsParser } from '@/parsers/key-contact-parser/key-contact-parser';
import relatedContentParser from '@/parsers/related-content-parser';
import fetchAllPages from '@/requests/allpage-requests';
import fetchRelatedContent from '@/requests/related-content-requests';
import { strapiFetch } from '@/requests/lib/strapi';
import { getComponentsPopulateObj, getSeoObject } from '@/utils/utils';
import { draftMode } from 'next/headers';
import { notFound } from 'next/navigation';

export const dynamic = 'force-static';
export const fetchCache = 'force-cache'; // Forces all fetches to cache, even with Auth headers
export const revalidate = 3600; 

export async function generateStaticParams() {
  const pages = await strapiFetch('/api/pages', {
    fields: ['slug'],
    pagination: { pageSize: 1000 },
  });

  return (pages?.data || []).map((p: any) => ({
    slug: p.slug.split('/').filter(Boolean),
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) {
  const resolvedParams = await params;
  const slug = resolvedParams.slug?.[resolvedParams.slug?.length - 1] || 'home';

  const page = await fetchAllPages({
    slug,
    populate: '*',
    isPreview: false, // ← no draftMode
  });


  if (!page) notFound();
  return getSeoObject(page?.seo, page);
}

const Pages = async ({
  params,
}: {
  params: Promise<{ slug?: string[] }>;
}) => {

  const draft = await draftMode();
  const isPreview = draft.isEnabled;

  const resolvedParams = await params;
  const slug = resolvedParams.slug?.[resolvedParams.slug?.length - 1] || 'home';

  const page = await fetchAllPages({
    slug,
    populate: {
      sections: {
        on: { ...getComponentsPopulateObj() },
      },
      full_cta: {
        populate: {
          fullCTAComponent: { populate: '*' }
        }
      },
      people: {
            populate: {
              people_roles: { populate: '*' },
              profile_photo: { populate: '*' }
            },
        },
      contact: { populate: '*' }
    },
    specificPopulate: {
      '/api/offices': {
        key_contacts: {
          populate: {
            people_roles: { populate: '*' },
            profile_photo: { populate: '*' }
          },
        },
        
      }
    },
    isPreview: isPreview, // ← no draftMode
  });



  if (!page) notFound();

  // console.log({page})

  const data = page;
  const isServicePage = data?._pageType === 'services';
  const isAnimation      = data?.type === 'interactive';
  const isLightAnimation = !isAnimation;
  const getFullCtaParser = fullCtaParser(data?.fullCta);
  const contactParser    = getInTouchParser(data?.contact);
  const keyContactsParser = getKeyContactsParser(data?.keyContacts);
  const peopleParser = getKeyContactsParser(data?.people, data?.peopleTitle);


  // console.log({peopleParser, data}, data?.people)

  const relatedContentRaw = isServicePage && data?.name
    ? await fetchRelatedContent({ serviceName: data.name })
    : null;
  const parsedRelatedContent = relatedContentRaw ? relatedContentParser(relatedContentRaw) : null;

  return (
    <div id={data?.documentId} className="relative z-9 bg-white">
      <FullPageSlider interactive={isAnimation}>
        <Sections
          isLightAnimation={isLightAnimation}
          sections={data?.sections || []}
          isAnimation={isAnimation}
        />
        {keyContactsParser && <KeyContacts {...keyContactsParser} />}
        {parsedRelatedContent && parsedRelatedContent.items.length > 0 && <RelatedContentCarousel {...parsedRelatedContent} isAnimation={isAnimation} />}
        {peopleParser && <KeyContacts {...peopleParser} />}
        {contactParser && <GetInTouch {...contactParser.props} />}

        {getFullCtaParser && <FullCta isAnimation={isAnimation} {...getFullCtaParser.props} />}
      </FullPageSlider>
    </div>
  );
};

export default Pages;