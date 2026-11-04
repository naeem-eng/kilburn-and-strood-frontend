import { strapiFetch } from "@/requests/lib/strapi";
import { getImgOrVideoType, getStrapiMedia } from "@/utils/utils";
import { format } from "date-fns";
import { ContentCarousalProps } from "@/components/general/content-carousal/content-carousal.types";
import { GRID_RENDERS, GridRenderName, isGridRender } from "@/requests/grid-requests/grid-config";

// Page-level carousel: allow_carousal + carousal_enums (Insights / Events / Casestudies) on pages, services,
// sector pages, articles, events and case studies. Shown before the full CTA.

export const CAROUSAL_MAX_ITEMS = 10;

const ITEM_TYPES: Record<GridRenderName, string> = { Insights: "Insights", Events: "Events", Casestudies: "Case studies" };

type CarousalSettings = { allowCarousal?: boolean | null; carousalEnums?: { name?: string | null }[] | null };
type CarousalItem = ContentCarousalProps["items"][number];

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

const toTitle = (renders: GridRenderName[]) => {
    const labels = renders.map((render) => ITEM_TYPES[render].toLowerCase());
    return `Latest ${labels.length > 1 ? `${labels.slice(0, -1).join(", ")} and ${labels[labels.length - 1]}` : labels[0]}`;
};

type FetchCarousalProps = {
    collection: string;      // Strapi collection of the current page, e.g. "pages", "services", "articles", "events"
    documentId?: string;
    slug?: string;           // left out of its own carousel
    isPreview?: boolean;
};

// Its own small request, so the page's own populate stays untouched.
// Collections without these fields (Strapi 400) simply get no carousel.
const fetchCarousal = async ({ collection, documentId, slug, isPreview = false }: FetchCarousalProps): Promise<ContentCarousalProps | null> => {
    if (!documentId) return null;

    const settings = await strapiFetch<{ data?: CarousalSettings }>(`/api/${collection}/${documentId}`, {
        fields: ["allow_carousal"],
        populate: { carousal_enums: { fields: ["name"] } },
    }, undefined, isPreview);

    const renders = [...new Set((settings?.data?.carousalEnums || [])
        .map((item) => item?.name?.trim() || "")
        .filter(isGridRender))];
    if (!settings?.data?.allowCarousal || !renders.length) return null;

    const lists = await Promise.all(renders.map(async (render) => {
        const config = GRID_RENDERS[render];
        const data = await strapiFetch<{ data?: any[] }>(config.url, {
            ...(slug ? { filters: { slug: { $ne: slug } } } : {}),
            populate: config.populate,
            sort: [`${config.dateField}:desc`, "publishedAt:desc"],
            pagination: { start: 0, limit: CAROUSAL_MAX_ITEMS },
        });
        return (data?.data || []).map((item) => toItem(render, item));
    }));

    const items = pickEvenly(lists, CAROUSAL_MAX_ITEMS)
        .sort((a, b) => (b.sortDate?.getTime() || 0) - (a.sortDate?.getTime() || 0));

    return items.length ? { title: toTitle(renders), items } : null;
};

export default fetchCarousal;
