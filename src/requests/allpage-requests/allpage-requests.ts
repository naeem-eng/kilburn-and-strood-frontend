import { strapiFetch } from "../lib/strapi";
import { PageRequestsType } from "./allpage-requests.types";

const urls = [
  "/api/pages",
  "/api/services",
  "/api/sector-pages",
  "/api/casestudies",
  // "/api/articles",
];

// Relations a collection doesn't have. Strapi rejects the whole request (400 "Invalid key")
// when populate names a missing field, so the page would 404.
const MISSING_FIELDS: Record<string, string[]> = {
  "/api/casestudies": ["full_cta"],
};

const withoutMissingFields = (endpoint: string, populate: Record<string, unknown>) => {
  const missing = MISSING_FIELDS[endpoint];
  if (!missing) return populate;
  return Object.fromEntries(Object.entries(populate).filter(([key]) => !missing.includes(key)));
};

const fetchAllPages = async (props: PageRequestsType): Promise<any> => {
  const {
    slug = null,
    populate = "*",
    isPreview = true,
    specificPopulate = {}
  } = props;

  let filters = undefined;

  if (slug) {
    filters = {
      slug: {
        $eq: slug,
      },
    };
  }

  // // //console.log({slug, isPreview})


  let todo = null; 
  for (const endpoint of urls) {
    const response = await strapiFetch(
      endpoint,
      {
        filters,
        populate : typeof populate === "object" ? withoutMissingFields(endpoint, {
          ...populate,
          ...(specificPopulate?.[endpoint] || {})
        }) : populate,
      },
      undefined,
      isPreview
    );

    if (response?.data?.length) {
      todo = response.data;
      if(slug) {
        const pageType = endpoint.replace('/api/', '');
        return { ...response.data[0], _pageType: pageType };
      }
      return response.data?.map((d: any) => ({...d, slug: endpoint?.includes('pages') ? d.slug : endpoint.replace("/api", "")+"/"+d.slug}));
    }
  }

  return todo?.[0]; 
};

export default fetchAllPages;
