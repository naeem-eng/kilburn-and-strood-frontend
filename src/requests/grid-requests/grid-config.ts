// Shared by the /api/grid and /api/grid-filters routes and the Grid component.
// Strapi grid section: filter_enums (which filters to show) and grid_renders (which collections to list).

export const GRID_PAGE_SIZE = 6;

export type GridRenderName = "Insights" | "Events" | "Casestudies";

type RenderConfig = {
    url: string;
    href: string;           // card link prefix
    dateField: string;      // sorted newest first
    tag: (item: any) => string | undefined;
    populate: Record<string, any>;
};

// grid_renders → collection
export const GRID_RENDERS: Record<GridRenderName, RenderConfig> = {
    Insights: {
        url: "/api/articles",
        href: "/insights/",
        dateField: "publish_date",
        tag: (item) => item?.articleTypes?.[0]?.title || "Insight",
        populate: { featured_image: { populate: "*" }, article_types: { populate: "*" } },
    },
    Events: {
        url: "/api/events",
        href: "/events/",
        dateField: "event_date",
        tag: (item) => item?.eventTypes?.[0]?.title || "Event",
        populate: { featured_image: { populate: "*" }, event_types: { populate: "*" } },
    },
    Casestudies: {
        url: "/api/casestudies",
        href: "/casestudies/",
        dateField: "date",
        tag: () => "Case study",
        populate: { featured_image: { populate: "*" } },
    },
};

type FilterConfig = {
    key: string;            // query param
    label: string;          // dropdown title
    // populate is a small relation on purpose: with populate left out, Strapi deep-populates everything (people took ~50s)
    options?: { url: string; fields: string[]; populate: Record<string, any> };
    // relation path to filter on, per collection; a collection without one is left out while this filter is active
    fields: Partial<Record<GridRenderName, { relation: string; field: string }[]>>;
};

// filter_enums → dropdown. "Insights" / "Events" / "Casestudies" become one "Type" dropdown of the grid's renders.
export const GRID_FILTERS: Record<string, FilterConfig> = {
    "Sectors": {
        key: "sectors",
        label: "Sectors",
        // sector pages, by name
        options: { url: "/api/sector-pages", fields: ["name"], populate: { services: { fields: ["title"] } } },
        fields: {
            Insights: [{ relation: "sector", field: "name" }],
            Events: [{ relation: "sectors", field: "name" }],
            Casestudies: [{ relation: "sectors", field: "name" }],
        },
    },
    "Sub Sectors": {
        key: "sub_sectors",
        label: "Sub Sectors",
        // the "sectors" collection
        options: { url: "/api/sectors", fields: ["title"], populate: { services: { fields: ["title"] } } },
        fields: {
            Insights: [{ relation: "sub_sectors", field: "title" }],
            Events: [{ relation: "sub_sectors", field: "title" }],
        },
    },
    "Peoples": {
        key: "people",
        label: "People",
        options: { url: "/api/peoples", fields: ["name"], populate: { people_roles: { fields: ["title"] } } },
        fields: {
            Insights: [{ relation: "people", field: "name" }, { relation: "author", field: "name" }],
            Events: [{ relation: "speakers", field: "name" }],
            Casestudies: [{ relation: "people", field: "name" }],
        },
    },
    // "Expertise" and "People Roles" have no relation on articles, events or case studies yet, so they show no dropdown
    "Article Type": {
        key: "article_types",
        label: "Type of insight",
        options: { url: "/api/article-types", fields: ["title"], populate: { color: true } },
        fields: {
            Insights: [{ relation: "article_types", field: "title" }],
        },
    },
    "Event Type": {
        key: "event_types",
        label: "Event Type",
        options: { url: "/api/event-types", fields: ["title"], populate: { color: true } },
        fields: {
            Events: [{ relation: "event_types", field: "title" }],
        },
    },
};

export const TYPE_FILTER = { key: "type", label: "Type" };

export const TYPE_LABELS: Record<GridRenderName, string> = {
    Insights: "Insights",
    Events: "Events",
    Casestudies: "Case studies",
};

export const isGridRender = (name: string): name is GridRenderName => Object.hasOwn(GRID_RENDERS, name);
