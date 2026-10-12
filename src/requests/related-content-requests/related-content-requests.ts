import { strapiFetch } from "../lib/strapi";
import { RelatedContentRaw, RelatedContentRequestProps } from "./related-content-requests.types";

const fetchRelatedContent = async ({ serviceName }: RelatedContentRequestProps): Promise<RelatedContentRaw> => {
  const [articlesData, eventsData] = await Promise.all([
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
  ]);

  return {
    articles: articlesData?.data ?? [],
    events: eventsData?.data ?? [],
  };
};

export default fetchRelatedContent;
