import { strapiFetch } from "@/requests/lib/strapi";

// Server-side listing queries shared by the /api/* proxy routes (client filtering, load more)
// and the listing pages (first page rendered on the server so content is in the HTML).

export const LISTING_PAGE_SIZE = 20;

type Params = URLSearchParams;

// Accepts both `key=a&key=b` and `key[0]=a&key[1]=b` styles
const getList = (params: Params, key: string) =>
  params.getAll(key).length
    ? params.getAll(key)
    : [...params.entries()]
        .filter(([k]) => k.startsWith(`${key}[`))
        .map(([, value]) => value);

const getPager = (params: Params) => ({
  page: Number(params.get("page") || 1),
  pageSize: Number(params.get("pageSize") || LISTING_PAGE_SIZE),
});


const buildPeopleFilters = (sectors: string[], roles: string[], services: string[], offices: string[], expertise: string[], search: string | null) => {
  const filters: any = {};
  const andConditions: any[] = [];

  if (search) {
    andConditions.push({ name: { $containsi: search } });
  }

  if (roles.length > 0) {
    andConditions.push({ people_roles: { title: { $in: roles } } });
  }

  if (expertise.length > 0) {
    andConditions.push({ expertise: { title: { $in: expertise } } });
  }

  if (sectors.length > 0) {
    andConditions.push({ sector: { title: { $in: sectors } } });
  }

  if (services.length > 0) {
    andConditions.push({
      $or: [
        { services: { name:  { $in: services } } },
        { services: { title: { $in: services } } },
      ]
    });
  }

  if (offices.length > 0) {
    andConditions.push({
      $or: [
        { office: { name:  { $in: offices } } },
        { office: { title: { $in: offices } } },
      ]
    });
  }

  if (andConditions.length > 0) {
    filters.$and = andConditions;
  }

  return filters;
};

export const queryPeoples = async (params: Params = new URLSearchParams()) => {
  const filters: any = buildPeopleFilters(
    getList(params, "sectors"),
    getList(params, "roles"),
    getList(params, "services"),
    getList(params, "offices"),
    getList(params, "expertises"),
    params.get("search"),
  );

  const data = await strapiFetch("/api/peoples", {
    ...(Object.keys(filters).length ? { filters } : {}),
    populate: "*",
    sort: ["people_roles.sort_order:asc"],
    pagination: getPager(params),
  });

  return {
    data: data?.data,
    pagination: data?.meta?.pagination,  // { page, pageSize, pageCount, total }
  };
};


// Articles and events share the same "any of" filter shape
const buildTypedFilters = (typeKey: "article_types" | "event_types", sectors: string[], types: string[], services: string[], search: string | null) => {
  const filters: any = {};
  const orConditions: any[] = [];

  if (search) {
    filters.title = { $containsi: search };
  }

  if (types.length > 0) {
    orConditions.push({ [typeKey]: { title: { $in: types } } });
  }

  if (sectors.length > 0) {
    orConditions.push({ sectors: { title: { $in: sectors } } });
  }

  if (services.length > 0) {
    orConditions.push({ services: { name: { $in: services } } });
    orConditions.push({ services: { title: { $in: services } } });
  }

  if (orConditions.length > 0) {
    filters.$or = orConditions;
  }

  return filters;
};

export const queryArticles = async (params: Params = new URLSearchParams()) => {
  const filters: any = buildTypedFilters(
    "article_types",
    getList(params, "sectors"),
    getList(params, "article_types"),
    getList(params, "services"),
    params.get("search"),
  );

  const data = await strapiFetch("/api/articles", {
    ...(Object.keys(filters).length ? { filters } : {}),
    populate: "*",
    sort: ["publish_date:desc"],
    pagination: getPager(params),
  });

  return {
    data: data?.data,
    pagination: data?.meta?.pagination,  // { page, pageSize, pageCount, total }
  };
};

export const queryEvents = async (params: Params = new URLSearchParams()) => {
  const filters: any = buildTypedFilters(
    "event_types",
    getList(params, "sectors"),
    getList(params, "event_types"),
    getList(params, "services"),
    params.get("search"),
  );

  const now = new Date().toISOString();
  const populate = {
    event_types: { populate: "*" },
    featured_image: { populate: "*" },
    cta: { populate: "*" },
  };

  // Upcoming events (event_date > now)
  const upcomingData = await strapiFetch("/api/events", {
    filters: {
      ...filters,
      event_date: { $gt: now },
    },
    populate,
    sort: ["event_date:asc"], // ascending for upcoming
    pagination: {
      page: 1,
      pageSize: 5,
    },
  });

  // Past events (event_date <= now)
  const pastData = await strapiFetch("/api/events", {
    filters: {
      ...filters,
      event_date: { $lte: now },
    },
    populate,
    sort: ["event_date:desc"], // descending for past
    pagination: getPager(params),
  });

  return {
    upcoming: {
      data: upcomingData?.data,
      pagination: upcomingData?.meta?.pagination,
    },
    past: {
      data: pastData?.data,
      pagination: pastData?.meta?.pagination,
    },
  };
};

export type PeopleListing = Awaited<ReturnType<typeof queryPeoples>>;
export type ArticleListing = Awaited<ReturnType<typeof queryArticles>>;
export type EventListing = Awaited<ReturnType<typeof queryEvents>>;
