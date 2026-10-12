import { menuParser } from "@/parsers/global-parser";
import { strapiFetch } from "../lib/strapi";
import { PageRequestsType } from "./page-requests.types";


const url = "/api/pages";

const fetchCollections = async (props: PageRequestsType): Promise<any> => {
    const {
        slug = null,
        populate = "*",
        isPreview = true
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

    return page?.data;
}

export default fetchCollections;