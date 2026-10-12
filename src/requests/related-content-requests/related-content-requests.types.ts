export type RelatedContentRequestProps = {
  serviceName: string;
};

export type RelatedContentRawImage = {
  ext?: string;
  alternativeText?: string;
  width?: number;
  height?: number;
  url?: string;
};

export type RelatedContentRawArticle = {
  title: string;
  slug: string;
  publishDate?: string;
  featuredImage?: RelatedContentRawImage;
};

export type RelatedContentRawEvent = {
  title: string;
  slug: string;
  eventDate?: string;
  featuredImage?: RelatedContentRawImage;
};

export type RelatedContentRaw = {
  articles: RelatedContentRawArticle[];
  events: RelatedContentRawEvent[];
};
