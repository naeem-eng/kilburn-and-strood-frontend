import { toQueryString } from "@/utils/utils";

// api/people/route.ts
const url = "/api/search";
const fetchSearch = async (
    props: any
): Promise<any> => {

    const { q, pager, collections } = props;
    const query = toQueryString({
        q,
        collections: collections || undefined,
        ...pager
    });

    // //console.log({query})
    const res = await fetch(url+"?"+query);
    const data = await res.json();
    // // //console.log("data", data);

    return data; // Single object
};

export default fetchSearch;