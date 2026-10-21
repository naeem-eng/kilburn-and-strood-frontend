// src/utils/case.ts
import {
  camelCase,
  snakeCase,
  isArray,
  isPlainObject,
  transform,
} from 'lodash';
import qs from "qs";

export type DeepCaseOptions = {
  /**
   * Whether to transform array indices into keys (rarely desired).
   * Default: false (keeps arrays as arrays, only transforms their elements)
   */
  transformArrayIndexes?: boolean;

  /**
   * Optional predicate to skip transforming certain keys.
   * Return true to KEEP the original key.
   */
  skipKey?: (key: string, parentPath: string[]) => boolean;
};

/**
 * Recursively converts object keys to camelCase.
 * - Transforms keys on plain objects
 * - Recurses into arrays and objects
 * - Leaves non-plain objects (Date, Map, etc.) unchanged
 */
export function toCamelCaseDeep<T = unknown>(
  input: T,
  options: DeepCaseOptions = {}
): T {
  const { transformArrayIndexes = false, skipKey } = options;

  if (isArray(input)) {
    if (!transformArrayIndexes) {
      // Keep array shape, transform nested values
      return (input as unknown[]).map((v) => toCamelCaseDeep(v, options)) as T;
    }
    // Convert array to object with transformed index keys (rarely used)
    return transform(
      input as unknown[],
      (acc, value, index) => {
        const newKey = camelCase(String(index));
        (acc as Record<string, unknown>)[newKey] = toCamelCaseDeep(value, options);
      },
      {} as Record<string, unknown>
    ) as unknown as T;
  }

  if (isPlainObject(input)) {
    return transform(
      input as Record<string, unknown>,
      (acc, value, key) => {
        const k = String(key);
        const newKey = skipKey?.(k, []) ? k : camelCase(k);
        (acc as Record<string, unknown>)[newKey] = toCamelCaseDeep(value, options);
      },
      {} as Record<string, unknown>
    ) as unknown as T;
  }

  // Primitive or non-plain object: return as-is
  return input;
}

/**
 * Recursively converts object keys to snake_case.
 * - Transforms keys on plain objects
 * - Recurses into arrays and objects
 * - Leaves non-plain objects (Date, Map, etc.) unchanged
 */
export function toSnakeCaseDeep<T = unknown>(
  input: T,
  options: DeepCaseOptions = {}
): T {
  const { transformArrayIndexes = false, skipKey } = options;

  if (isArray(input)) {
    if (!transformArrayIndexes) {
      return (input as unknown[]).map((v) => toSnakeCaseDeep(v, options)) as T;
    }
    return transform(
      input as unknown[],
      (acc, value, index) => {
        const newKey = snakeCase(String(index));
        (acc as Record<string, unknown>)[newKey] = toSnakeCaseDeep(value, options);
      },
      {} as Record<string, unknown>
    ) as unknown as T;
  }

  if (isPlainObject(input)) {
    return transform(
      input as Record<string, unknown>,
      (acc, value, key) => {
        const k = String(key);
        const newKey = skipKey?.(k, []) ? k : snakeCase(k);
        (acc as Record<string, unknown>)[newKey] = toSnakeCaseDeep(value, options);
      },
      {} as Record<string, unknown>
    ) as unknown as T;
  }

  return input;
}

/** Convenience helpers for arrays of objects (deep) */
export const arrayObjectsToCamelCaseDeep = <T = unknown>(arr: T[], options?: DeepCaseOptions): T[] =>
  arr.map((item) => toCamelCaseDeep(item, options));

export const arrayObjectsToSnakeCaseDeep = <T = unknown>(arr: T[], options?: DeepCaseOptions): T[] =>
  arr.map((item) => toSnakeCaseDeep(item, options));
 

export const imagesTypes = 
[
  ".jpg", ".jpeg", ".png", ".gif", ".webp", ".bmp", ".tiff", ".tif",
  ".heic", ".heif",
  ".raw", ".cr2", ".cr3", ".nef", ".arw", ".orf", ".rw2", ".dng",
  ".ico", ".psd", ".exr", ".hdr",
  ".svg", ".ai", ".eps", ".pdf", ".cdr",
  ".jp2", ".j2k", ".pcx", ".tga", ".dds", ".apng", ".xbm", ".xpm", ".sgi", ".rgb"
]

export const videoTypes = [
  ".mp4", ".mov", ".m4v", ".avi", ".wmv", ".flv", ".mkv",
  ".webm", ".mpeg", ".mpg", ".mpe", ".mp2",
  ".3gp", ".3g2",
  ".ogv", ".ogg",
  ".h264", ".h265", ".hevc",
  ".mts", ".m2ts", ".ts",
  ".vob",
  ".rm", ".rmvb",
  ".divx",
  ".f4v"
]

export const getImgOrVideoType = (url: string) => { 
  if (imagesTypes.includes(url)) return 'image'
  if (videoTypes.includes(url)) return 'video'
  return 'image'
}

export const getComponentsPopulateObj = ():{[key:string]:{
  populate: string | object;
}} => {
  const components = [
    "components.text-with-image",
    "components.text-image-slider",
    "components.text-header",
    "components.testimonial-slider",
    "components.tabbed-content",
    "components.stats",
    "components.secondary-header",
    "components.people-highlight",
    "components.location",
    "components.latest-content",
    "components.inline-image-and-video",
    "components.homepage-header",
    "components.full-cta",
    "components.featured-blocks",
    "components.casestudy-highlight",
    "components.body",
    "components.article-header",
    "components.get-in-touch",
    "components.article-header",
    "components.article-hero",
    "components.inline-image-and-video",
    "components.newsletter",
  ];

  let todo:{[key:string]:{
    populate: string | object;
  }} = {};

  components.map((component) => {
    if(component === "components.get-in-touch" || component === "components.article-header") {
      todo[component] = {
        populate: {
          cta: {
            populate: "*"
          }
        }
      };
      return;
    }
    if(component === "components.tabbed-content") { 
      todo[component] = {
        populate: {
          tabs: {
            populate: "*"
          },
          content_tabs: {
            populate: "*"
          },
          map_content_tabs: {
            populate: "*"
          },
          media_1: {
            populate: "*"
          },
          media_2: {
            populate: "*"
          },
        }
      };
      return;
    }
    if(component === "components.newsletter") {
      todo[component] = {
        populate: {
          media_1: {
            populate: "*"
          },
          media_2: {
            populate: "*"
          },
          cta: {
            populate: "*"
          }
        }
      };
      return;
    }
    if(component === "components.testimonial-slider") {
      todo[component] = {
        populate: {
          testimonials: {
            populate: {
              media: {
                populate: "*"
              },
              person: {
                populate: {
                  profile_photo: {
                    populate: "*"
                  }
                }
              }
            }
          }
        }
      };
      return;
    }
    if(component === "components.people-highlight") { 
      todo[component] = {
        populate: {
          items: {
            populate: "*",
          }
        }
      };
      return;
    }
    if(component === "components.text-image-slider") { 
      todo[component] = {
        populate: {
          items: {
            populate: "*"
          },
          articles: {
            populate: "*"
          },
          events: {
            populate: "*"
          },
          pages: {
            populate: "*"
          }
        }
      };
      return;
    }
    todo[component] = {
      populate: "*",
      
    };
    return;
  });

  return todo
};


// export const getStrapiMedia = (url: string) => {
//   if (!url) return "";

//   // If already absolute → return as is
//   if (url.startsWith("http")) {
//     return url;
//   }

//   return `${process.env.NEXT_PUBLIC_STRAPI_URL}${url}`;
// };



type StrapiImageSize = 'thumbnail' | 'small' | 'medium' | 'large';

export const getStrapiMedia = (
  imageOrUrl: any,
  preferredSize: StrapiImageSize = 'medium'
): string => {
  // Handle plain string URL (backwards compatible)
  if (typeof imageOrUrl === 'string') {
    if (!imageOrUrl) return '';
    return imageOrUrl.startsWith('http')
      ? imageOrUrl
      : `${process.env.NEXT_PUBLIC_STRAPI_URL}${imageOrUrl}`;
  }

  

  // Handle Strapi image object — pick best format or fall back to original
  const formats = imageOrUrl?.formats ?? imageOrUrl?.data?.attributes?.formats;
  const originalUrl = imageOrUrl?.url ?? imageOrUrl?.data?.attributes?.url;

  const formatUrl = formats?.[preferredSize]?.url ?? originalUrl ?? '';

  if (!formatUrl) return '';

  return formatUrl.startsWith('http')
    ? formatUrl
    : `${process.env.NEXT_PUBLIC_STRAPI_URL}${formatUrl}`;
};



export const getDayAndMonth = (dateString: string) => {
  const date = new Date(dateString);

  return {
    day: date.toLocaleDateString("en-GB", { day: "2-digit" }),
    month: date.toLocaleDateString("en-GB", { month: "long" }),
  };
};



 export const toQueryString = (obj: Record<string, any>): string => {
  return qs.stringify(obj, { 
    encodeValuesOnly: true,  // keeps brackets readable
    allowDots: false,
  });
};

export const uniqueObjects = (prev: any[], newData: any[]) => {
  const merged = [...prev, ...newData];
  return merged.filter((item, index, self) => 
    index === self.findIndex(t => t.id === item.id)
  );
};



export const getSeoObject = (seo: any , page: any) => {

  const siteName = process.env.NEXT_PUBLIC_SITE_NAME ?? '';
  const title    = seo?.metaTitle    || page?.title || page?.name || '';
  const desc     = seo?.metaDescription || page?.description || '';
  const image    = seo?.ogImage?.url || seo?.media?.url || '';
  const url      = seo?.canonicalUrl || process.env.NEXT_PUBLIC_SITE_URL || '';

  return {
    title:       `${siteName} | ${title}`,
    description: desc,
    keywords:    seo?.keywords || '',

    robots: {
      index:  !(seo?.metaRobots?.includes('noindex')),
      follow: !(seo?.metaRobots?.includes('nofollow')),
      googleBot: seo?.metaRobots || 'index, follow',
    },

    alternates: {
      canonical: url,
    },

    openGraph: {
      title:       seo?.ogTitle       || title,
      description: seo?.ogDescription || desc,
      images:      image ? [{ url: image }] : [],
      type:        seo?.ogType        || 'website',
      siteName,
      url,
    },

    twitter: {
      card:        seo?.twitterCard        ||  undefined,
      title:       seo?.twitterTitle       || seo?.ogTitle       || title,
      description: seo?.twitterDescription || seo?.ogDescription || desc,
      images:      seo?.twitterImage?.url  || image ? [seo?.twitterImage?.url || image] : [],
    },

    ...(seo?.structuredData ? {
      other: {
        'application/ld+json': JSON.stringify(seo.structuredData),
      }
    } : {}) 
  }
};

type StrapiBlockNode = { type?: string; text?: string; bold?: boolean; italic?: boolean; children?: StrapiBlockNode[] };

/**
 * Strapi fields can be plain text/markdown or "Rich text (Blocks)" arrays. Rendering a blocks
 * array directly throws "Objects are not valid as a React child" and fails the static build,
 * so blocks are flattened to markdown (paragraphs, bold/italic) and strings pass through.
 */
export const richTextToMarkdown = (value: unknown): string | undefined => {
  if (value === null || value === undefined) return undefined;
  if (typeof value === "string") return value;
  if (!Array.isArray(value)) return undefined;

  const inline = (nodes: StrapiBlockNode[] = []): string =>
    nodes.map((node) => {
      if (node.type === "text" || typeof node.text === "string") {
        let text = node.text || "";
        if (node.bold && text.trim()) text = `**${text}**`;
        if (node.italic && text.trim()) text = `*${text}*`;
        return text;
      }
      return inline(node.children);
    }).join("");

  const markdown = (value as StrapiBlockNode[])
    .map((block) => inline(block.children))
    .filter((line) => line.trim())
    .join("\n\n");

  return markdown || undefined;
};
