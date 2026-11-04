import { ContentCarousalProps } from "@/components/general/content-carousal/content-carousal.types";
import { RelatedContentRaw } from "@/requests/related-content-requests/related-content-requests.types";
import { getImgOrVideoType, getStrapiMedia } from "@/utils/utils";
import { format } from "date-fns";

const relatedContentParser = (data: RelatedContentRaw, title = "Related Insights & Events"): ContentCarousalProps => {
  const articles = data.articles.map((v) => ({
    title: v.title,
    slug: v.slug,
    url: `/insights/${v.slug}`,
    sortDate: new Date(v.publishDate!),
    itemType: "Insights" as const,
    date: v.publishDate ? format(new Date(v.publishDate), "do MMMM yyyy") : "",
    mediaType: getImgOrVideoType(v.featuredImage?.ext ?? ""),
    mediaSrc: getStrapiMedia(v.featuredImage, "large"),
    mediaAlt: v.featuredImage?.alternativeText,
    mediaWidth: v.featuredImage?.width,
    mediaHeight: v.featuredImage?.height,
  }));

  const events = data.events.map((v) => ({
    title: v.title,
    slug: v.slug,
    url: `/events/${v.slug}`,
    sortDate: new Date(v.eventDate!),
    itemType: "Events" as const,
    date: v.eventDate ? format(new Date(v.eventDate), "do MMMM yyyy") : "",
    mediaType: getImgOrVideoType(v.featuredImage?.ext ?? ""),
    mediaSrc: getStrapiMedia(v.featuredImage, "large"),
    mediaAlt: v.featuredImage?.alternativeText,
    mediaWidth: v.featuredImage?.width,
    mediaHeight: v.featuredImage?.height,
  }));

  const casestudies = (data.casestudies ?? []).map((v) => ({
    title: v.title || v.name,
    slug: v.slug,
    url: `/casestudies/${v.slug}`,
    sortDate: new Date(v.date!),
    itemType: "Case studies" as const,
    date: v.date ? format(new Date(v.date), "do MMMM yyyy") : "",
    mediaType: getImgOrVideoType(v.featuredImage?.ext ?? ""),
    mediaSrc: getStrapiMedia(v.featuredImage, "large"),
    mediaAlt: v.featuredImage?.alternativeText,
    mediaWidth: v.featuredImage?.width,
    mediaHeight: v.featuredImage?.height,
  }));

  const items = [...articles, ...events, ...casestudies].sort((a, b) => (b.sortDate > a.sortDate ? 1 : -1)) as ContentCarousalProps['items'];

  return { title, items };
};

export default relatedContentParser;
