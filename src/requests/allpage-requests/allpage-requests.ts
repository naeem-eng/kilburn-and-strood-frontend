import { strapiFetch } from "../lib/strapi";
import { PageRequestsType } from "./allpage-requests.types";

const urls = [
  "/api/pages",
  "/api/services",
  "/api/sector-pages",
  "/api/offices",
  // "/api/articles",
];

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
        populate : typeof populate === "object" ? { 
          ...populate,
          ...(specificPopulate?.[endpoint] || {})
        } : populate,
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
