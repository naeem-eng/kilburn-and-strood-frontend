import { toQueryString } from "@/utils/utils";

// api/people/route.ts
const url = "/api/article";
const fetchArticles = async (
    props: any,
    signal?: AbortSignal
): Promise<any> => {

    const { filters, pager } = props;
    const query = toQueryString({
        ...filters,
        ...pager
    });

    // // //console.log({query})
    const res = await fetch(url+"?"+query, {
        signal
    });
    const data = await res.json();
    // // //console.log("data", data);

    return data; // Single object
};

export default fetchArticles;