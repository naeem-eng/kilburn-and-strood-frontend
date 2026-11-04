import { strapiFetch } from "../lib/strapi";

const keys = [
    "expertises", "sub_sectors", "roles",
      "services",
        // "offices" — the offices collection was removed from Strapi (404), and an unknown key fails the whole request
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