import { strapiFetch } from "../lib/strapi";

const keys = [
    "article_types"
    ] as string[];

    // "services", "sectors", 


// api/people/route.ts
const fetchArticleFilters = async (
    props: any
): Promise<any> => {
    const res = await fetch(`/api/filters?keys=${keys.join(",")}`);
    const data = await res.json();
    return data; // Single object
};

export default fetchArticleFilters;