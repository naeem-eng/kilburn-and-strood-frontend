import { strapiFetch } from "../lib/strapi";
import { RelatedContentRaw, RelatedContentRequestProps } from "./related-content-requests.types";

const fetchRelatedContent = async ({ serviceName }: RelatedContentRequestProps): Promise<RelatedContentRaw> => {
  const [articlesData, eventsData, casestudiesData] = await Promise.all([
    strapiFetch("/api/articles", {
      filters: { services: { name: { $eq: serviceName } } },
      populate: { featured_image: { populate: "*" } },
      sort: ["publish_date:desc"],
      pagination: { pageSize: 20 },
    }),
    strapiFetch("/api/events", {
      filters: { services: { name: { $eq: serviceName } } },
      populate: { featured_image: { populate: "*" } },
      sort: ["event_date:desc"],
      pagination: { pageSize: 20 },
    }),
    strapiFetch("/api/casestudies", {
      filters: { services: { name: { $eq: serviceName } } },
      populate: { featured_image: { populate: "*" } },
      sort: ["date:desc"],
      pagination: { pageSize: 20 },
    }),
  ]);

  return {
    articles: articlesData?.data ?? [],
    events: eventsData?.data ?? [],
    casestudies: casestudiesData?.data ?? [],
  };
};

export default fetchRelatedContent;
