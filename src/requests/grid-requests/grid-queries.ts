import { strapiFetch } from "@/requests/lib/strapi";
import { getStrapiMedia } from "@/utils/utils";
import { format } from "date-fns";
import { GridCardProps } from "@/components/general/grid/grid.types";
import { GRID_FILTERS, GRID_PAGE_SIZE, GRID_RENDERS, GridRenderName, TYPE_FILTER, TYPE_LABELS, isGridRender } from "./grid-config";

type Params = URLSearchParams;

const getList = (params: Params, key: string) =>
    (params.get(key) || "").split(",").map((value) => value.trim()).filter(Boolean);

type StrapiList = { data?: any[]; meta?: { pagination?: { total?: number } } };

// Strapi filters for one collection, or null when an active filter doesn't apply to it
const buildFilters = (render: GridRenderName, params: Params, enums: string[]) => {
    const and: any[] = [];

    const search = params.get("search");
    if (search) and.push({ title: { $containsi: search } });

    for (const name of enums) {
        const config = GRID_FILTERS[name];
        if (!config) continue;
        const values = getList(params, config.key);
        if (!values.length) continue;
        const paths = config.fields[render];
        if (!paths?.length) return null;
        // dropdown titles are trimmed, but some CMS names carry stray spaces (" Strategy"), so match those too
        const padded = values.flatMap((value) => [value, ` ${value}`, `${value} `, ` ${value} `]);
        and.push({ $or: paths.map(({ relation, field }) => ({ [relation]: { [field]: { $in: padded } } })) });
    }

    return and.length ? { $and: and } : undefined;
};

const toCard = (render: GridRenderName, item: any): GridCardProps => {
    const config = GRID_RENDERS[render];
    const image = item?.featuredImage;
    const rawDate = item?.publishDate || item?.eventDate || item?.date || item?.publishedAt;
    return {
        id: `${render}-${item?.documentId}`,
        href: item?.slug ? config.href + item.slug : undefined,
        title: item?.title || item?.name,
        tag: config.tag(item),
        imageSrc: image ? getStrapiMedia(image, "large") : undefined,
        imageAlt: image?.alternativeText || "",
        imageWidth: image?.width,
        imageHeight: image?.height,
        sortDate: rawDate ? new Date(rawDate).getTime() : 0,
        date: rawDate ? format(new Date(rawDate), "do MMMM yyyy") : undefined,
    };
};

// Cards from every requested collection, merged newest first.
// Each collection returns its first page * pageSize items so the merged page is exact.
export const queryGrid = async (params: Params) => {
    const enums = getList(params, "enums");
    const page = Math.max(1, Number(params.get("page") || 1));
    const pageSize = Number(params.get("pageSize") || GRID_PAGE_SIZE);

    const types = getList(params, TYPE_FILTER.key)
        .map((label) => Object.keys(TYPE_LABELS).find((name) => TYPE_LABELS[name as GridRenderName] === label) || label);
    const renders = getList(params, "renders")
        .filter(isGridRender)
        .filter((render) => !types.length || types.includes(render));

    const results = await Promise.all(renders.map(async (render) => {
        const filters = buildFilters(render, params, enums);
        if (filters === null) return { cards: [] as GridCardProps[], total: 0 };
        const config = GRID_RENDERS[render];
        const data = await strapiFetch<StrapiList>(config.url, {
            ...(filters ? { filters } : {}),
            populate: config.populate,
            sort: [`${config.dateField}:desc`, "publishedAt:desc"],
            pagination: { start: 0, limit: page * pageSize },
        });
        return {
            cards: (data?.data || []).map((item) => toCard(render, item)),
            total: data?.meta?.pagination?.total || 0,
        };
    }));

    const total = results.reduce((sum, result) => sum + result.total, 0);
    const data = results
        .flatMap((result) => result.cards)
        .sort((a, b) => b.sortDate - a.sortDate)
        .slice((page - 1) * pageSize, page * pageSize);

    return {
        data,
        pagination: { page, pageSize, pageCount: Math.ceil(total / pageSize), total },
    };
};

type FilterItem = { title?: string | null; name?: string | null };
type FilterList = { data?: FilterItem[]; meta?: { pagination?: { pageCount?: number } } };

// Strapi caps a page at 100, so collections like people need every page
const fetchAllOptions = async ({ url, fields, populate }: { url: string; fields: string[]; populate: Record<string, any> }) => {
    const query = (page: number) => strapiFetch<FilterList>(url, { fields, populate, sort: [`${fields[0]}:asc`], pagination: { page, pageSize: 100 } });
    const first = await query(1);
    const pageCount = first?.meta?.pagination?.pageCount || 1;
    const rest = await Promise.all(Array.from({ length: pageCount - 1 }, (_, i) => query(i + 2)));
    return [first, ...rest].flatMap((list) => list?.data || []);
};

// Dropdown options for the grid's filter_enums, in the shape filtersParser / GeneralFilters use
export const queryGridFilters = async (params: Params) => {
    const enums = getList(params, "enums");
    const renders = getList(params, "renders").filter(isGridRender);

    const filters = await Promise.all(enums.map(async (name) => {
        const config = GRID_FILTERS[name];
        // only filters that apply to at least one of the grid's collections
        if (!config?.options || !renders.some((render) => config.fields[render]?.length)) return null;
        const items = (await fetchAllOptions(config.options))
            .map((item) => ({ title: (item?.title || item?.name || "").trim() }))
            .filter((item) => item.title);
        return items.length ? { key: config.key, title: config.label, items } : null;
    }));

    // "Insights" / "Events" / "Casestudies" in filter_enums → a Type dropdown of the grid's own renders
    const types = renders.filter((render) => enums.includes(render));
    const typeFilter = types.length > 1
        ? [{ key: TYPE_FILTER.key, title: TYPE_FILTER.label, items: types.map((render) => ({ title: TYPE_LABELS[render] })) }]
        : [];

    return [...typeFilter, ...filters.filter(Boolean)];
};

export type GridListing = Awaited<ReturnType<typeof queryGrid>>;
export type GridFilters = Awaited<ReturnType<typeof queryGridFilters>>;
