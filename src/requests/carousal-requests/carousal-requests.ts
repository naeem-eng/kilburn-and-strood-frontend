import { strapiFetch } from "@/requests/lib/strapi";
import { getImgOrVideoType, getStrapiMedia } from "@/utils/utils";
import { format } from "date-fns";
import { ContentCarousalProps } from "@/components/general/content-carousal/content-carousal.types";
import { GRID_RENDERS, GridRenderName, isGridRender } from "@/requests/grid-requests/grid-config";

// Page-level carousel: allow_carousal + carousal_enums (Insights / Events / Casestudies) on pages, services,
// sector pages, articles, events and case studies. Shown before the full CTA.
// Each chosen type shows the page's own related items when it has any, otherwise the latest ones.

export const CAROUSAL_MAX_ITEMS = 10;

const ITEM_TYPES: Record<GridRenderName, string> = { Insights: "Insights", Events: "Events", Casestudies: "Case studies" };

// grid_renders name → the relation that holds those items on a page (services and sector pages have all three)
const RELATIONS: Record<GridRenderName, string> = { Insights: "articles", Events: "events", Casestudies: "casestudies" };

type CarousalSettings = { allowCarousal?: boolean | null; carousalEnums?: { name?: string | null }[] | null };
export type CarousalItem = ContentCarousalProps["items"][number];

// Max 10 in total, shared evenly between the chosen types (5 + 5, 4 + 3 + 3); a type with fewer items leaves its room to the others
const pickEvenly = (lists: CarousalItem[][], max: number) => {
    const picked: CarousalItem[] = [];
    const queues = lists.map((list) => [...list]);
    while (picked.length < max && queues.some((queue) => queue.length)) {
        for (const queue of queues) {
            const next = queue.shift();
            if (next && picked.length < max) picked.push(next);
        }
    }
    return picked;
};

const byDateDesc = (a: CarousalItem, b: CarousalItem) => (b.sortDate?.getTime() || 0) - (a.sortDate?.getTime() || 0);

const uniqueByUrl = (items: CarousalItem[]) =>
    items.filter((item, i) => items.findIndex((other) => other.url === item.url) === i);

const toItem = (render: GridRenderName, item: any): CarousalItem => {
    const image = item?.featuredImage;
    const rawDate = item?.publishDate || item?.eventDate || item?.date || item?.publishedAt;
    return {
        title: item?.title || item?.name,
        slug: item?.slug,
        url: item?.slug ? GRID_RENDERS[render].href + item.slug : undefined,
        itemType: ITEM_TYPES[render],
        sortDate: rawDate ? new Date(rawDate) : undefined,
        date: rawDate ? format(new Date(rawDate), "do MMMM yyyy") : undefined,
        mediaType: image ? getImgOrVideoType(image?.ext) : null,
        mediaSrc: image ? getStrapiMedia(image, "large") : undefined,
        mediaAlt: image?.alternativeText,
        mediaWidth: image?.width,
        mediaHeight: image?.height,
    };
};

const toTitle = (prefix: string, renders: GridRenderName[]) => {
    const labels = renders.map((render) => ITEM_TYPES[render].toLowerCase());
    return `${prefix} ${labels.length > 1 ? `${labels.slice(0, -1).join(", ")} and ${labels[labels.length - 1]}` : labels[0]}`;
};

// The page's own relation (e.g. a service's articles). Collections without it (plain pages) answer 400 → none.
const fetchOwnRelated = async (collection: string, documentId: string, render: GridRenderName, isPreview: boolean) => {
    const relation = RELATIONS[render];
    const data = await strapiFetch<{ data?: Record<string, any[]> }>(`/api/${collection}/${documentId}`, {
        fields: ["documentId"],
        populate: {
            [relation]: {
                populate: { featured_image: { populate: "*" } },
                sort: [`${GRID_RENDERS[render].dateField}:desc`],
            },
        },
    }, undefined, isPreview);
    const items = data?.data?.[relation] || [];
    return items.map((item) => toItem(render, item));
};

// Latest items of a type, leaving out the current page
const fetchLatest = async (render: GridRenderName, slug?: string) => {
    const config = GRID_RENDERS[render];
    const data = await strapiFetch<{ data?: any[] }>(config.url, {
        ...(slug ? { filters: { slug: { $ne: slug } } } : {}),
        populate: config.populate,
        sort: [`${config.dateField}:desc`, "publishedAt:desc"],
        pagination: { start: 0, limit: CAROUSAL_MAX_ITEMS },
    });
    return (data?.data || []).map((item) => toItem(render, item));
};

type FetchCarousalProps = {
    collection: string;      // Strapi collection of the current page, e.g. "pages", "services", "articles", "events"
    documentId?: string;
    slug?: string;           // left out of its own carousel
    isPreview?: boolean;
    related?: CarousalItem[]; // extra related items already fetched by the page (e.g. fetchRelatedContent on services)
    relatedTitle?: string;    // title prefix when related items are used, e.g. "Abi Heath's" (default "Related")
};

// Its own small requests, so the page's own populate stays untouched.
// Collections without these fields (Strapi 400) simply get no carousel.
const fetchCarousal = async ({ collection, documentId, slug, isPreview = false, related = [], relatedTitle = "Related" }: FetchCarousalProps): Promise<ContentCarousalProps | null> => {
    if (!documentId) return null;

    const settings = await strapiFetch<{ data?: CarousalSettings }>(`/api/${collection}/${documentId}`, {
        fields: ["allow_carousal"],
        populate: { carousal_enums: { fields: ["name"] } },
    }, undefined, isPreview);

    const renders = [...new Set((settings?.data?.carousalEnums || [])
        .map((item) => item?.name?.trim() || "")
        .filter(isGridRender))];
    if (!settings?.data?.allowCarousal || !renders.length) return null;

    let usedRelated = false;
    const lists = await Promise.all(renders.map(async (render) => {
        const own = await fetchOwnRelated(collection, documentId, render, isPreview);
        const extra = related.filter((item) => item.itemType === ITEM_TYPES[render]);
        const matches = uniqueByUrl([...own, ...extra]).filter((item) => item.slug !== slug).sort(byDateDesc);
        if (matches.length) {
            usedRelated = true;
            return matches;
        }
        return fetchLatest(render, slug);
    }));

    const items = pickEvenly(lists, CAROUSAL_MAX_ITEMS).sort(byDateDesc);

    return items.length ? { title: toTitle(usedRelated ? relatedTitle : "Latest", renders), items } : null;
};

export default fetchCarousal;
