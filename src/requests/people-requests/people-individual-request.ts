import { strapiFetch } from "../lib/strapi";



// api/people/route.ts
const url = "/api/peoples";
const fetchPeopleIndividual = async (
    props: any
): Promise<any> => {

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
    
        return page?.data?.[0];
};

export default fetchPeopleIndividual;