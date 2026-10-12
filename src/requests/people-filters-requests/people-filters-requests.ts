import { strapiFetch } from "../lib/strapi";

const keys = [
    "expertises", "sectors", "roles",
      "services",
        "offices"
    ] as string[];


// api/people/route.ts
const fetchPeopleFilters = async (
    props: any
): Promise<any> => {
    const res = await fetch(`/api/filters?keys=${keys.join(",")}`);
    const data = await res.json();
    return data; // Single object
};

export default fetchPeopleFilters;