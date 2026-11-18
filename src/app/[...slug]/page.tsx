import FullCta from '@/components/general/full-cta';
import PeopleAndExploring from '@/components/general/people-and-exploring';
import { exploringParser } from '@/parsers/exploring-parser/exploring-parser';
import { speakerParser } from '@/parsers/speaker-parser/speaker-parser';
import PageCarousal from '@/components/general/page-carousal';
import GetInTouch from '@/components/general/get-in-touch';
import KeyContacts from '@/components/general/key-contacts';
import { FullPageSlider } from '@/components/interactive/fullpage';
import Sections from '@/components/sections';
import { fullCtaParser } from '@/parsers/fullcta-parser/fullcta-parser';
import { globalNewsletterParser } from '@/parsers/section-parser/newsletter-parser';
import Newsletter from '@/components/general/newsletter';
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

// Global newsletter relation, populated like full_cta. Only collections that have the
// `global_newsletters` field get it: an unknown populate key makes Strapi return 400.
const globalNewslettersPopulate = {
  global_newsletters: {
    populate: {
      newsletter: getComponentsPopulateObj()['components.newsletter'],
    },
  },
};

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
      '/api/pages': globalNewslettersPopulate,
      '/api/services': globalNewslettersPopulate,
      '/api/sector-pages': globalNewslettersPopulate,
      // case studies have no full_cta field (qs drops undefined keys)
      // services/sectors feed the "Keep Exploring" links next to the people
      '/api/casestudies': { ...globalNewslettersPopulate, full_cta: undefined, services: true, sectors: true },
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
  // pages set to "Interactive" in Strapi snap module by module; a grid (taller than the screen) is scrolled through normally
  const isAnimation      = data?.type === 'interactive';
  const isLightAnimation = !isAnimation;
  const getFullCtaParser = fullCtaParser(data?.fullCta);
  const globalNewsletter = globalNewsletterParser(data?.globalNewsletters);
  const contactParser    = getInTouchParser(data?.contact);
  const keyContactsParser = getKeyContactsParser(data?.keyContacts);
  const isCaseStudy = data?._pageType === 'casestudies';
  // case studies show their people next to "Keep Exploring" (same block as insights), not as key contacts
  const peopleParser = isCaseStudy ? null : getKeyContactsParser(data?.people, data?.peopleTitle);
  const caseStudyPeople = isCaseStudy ? speakerParser(data?.people) : null;
  const caseStudyExploring = isCaseStudy ? exploringParser(data?.services, data?.sectors) : null;


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
        {/* the blocks after the CMS sections (carousel, key contacts, newsletter, CTA) snap like the sections above;
            ones taller than the screen are scrolled through normally, see FullPageSlider */}
        <div>
        {isCaseStudy && (
          <PeopleAndExploring
            peopleTitle="Key contacts"
            people={caseStudyPeople?.props}
            exploring={[
              ...(caseStudyExploring?.servicesList || []),
              ...(caseStudyExploring?.sectorsList || []),
            ]}
            className="mb-xl"
          />
        )}
        {/* allow_carousal carousel: the page's related items per chosen type (incl. a service's related content), else the latest;
            with allow_carousal off, a service page still shows its related content here */}
        <PageCarousal
          collection={data?._pageType}
          documentId={data?.documentId}
          slug={data?.slug}
          isPreview={isPreview}
          related={parsedRelatedContent?.items}
          fallback={parsedRelatedContent}
          isAnimation={false}
        />
        {keyContactsParser && <KeyContacts {...keyContactsParser} />}
        {peopleParser && <KeyContacts {...peopleParser} />}
        {contactParser && <GetInTouch {...contactParser.props} />}

        {globalNewsletter && (
          <Newsletter
            {...globalNewsletter.props}
            isAnimation={false}
            isLightAnimation
          />
        )}
        {getFullCtaParser && <FullCta isAnimation={false} {...getFullCtaParser.props} />}
        </div>
      </FullPageSlider>
    </div>
  );
};

export default Pages;