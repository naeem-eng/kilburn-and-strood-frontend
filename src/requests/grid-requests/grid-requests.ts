import { toQueryString } from "@/utils/utils";

type GridQuery = {
    renders: string[];
    enums: string[];
    page?: number;
    search?: string;
    filters?: Record<string, string[]>;
};

const toParams = ({ renders, enums, page, search, filters }: GridQuery) => toQueryString({
    renders: renders.join(","),
    enums: enums.join(","),
    ...(page ? { page } : {}),
    ...(search ? { search } : {}),
    ...Object.fromEntries(Object.entries(filters || {}).map(([key, values]) => [key, values.join(",")])),
});

export const fetchGrid = async (query: GridQuery, signal?: AbortSignal) => {
    const res = await fetch(`/api/grid?${toParams(query)}`, { signal });
    return res.ok ? res.json() : { data: [], pagination: null };
};

export const fetchGridFilters = async (query: GridQuery) => {
    const res = await fetch(`/api/grid-filters?${toParams(query)}`);
    return res.ok ? res.json() : []; // no dropdowns rather than a broken section
};
