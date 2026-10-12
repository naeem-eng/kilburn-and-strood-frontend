import { menuParser } from "@/parsers/global-parser";
import { strapiFetch } from "../lib/strapi";
import { PageRequestsType } from "./page-requests.types";


const url = "/api/pages";

const fetchSingle = async (props: PageRequestsType): Promise<any> => {
    const {
        slug = null,
        populate = "*",
        isPreview = true,
    } = props;

    let filters = undefined;

    if(slug) {
        filters = {
            slug: {
                $eq: slug
            }
        }
    }
    const page = await strapiFetch(
        url,
        {
            filters,
            populate
        }, undefined, isPreview);
    
    // //console.log({page})

    return page?.data?.[0];
}

export default fetchSingle;