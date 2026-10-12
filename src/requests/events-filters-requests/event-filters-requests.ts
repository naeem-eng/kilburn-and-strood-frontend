import { strapiFetch } from "../lib/strapi";

const keys = [
    "services", "sectors", "event_types"
    ] as string[];


// api/people/route.ts
const fetchEventFilters = async (
    props: any
): Promise<any> => {
    const res = await fetch(`/api/filters?keys=${keys.join(",")}`);
    const data = await res.json();
    return data; // Single object
};

export default fetchEventFilters;