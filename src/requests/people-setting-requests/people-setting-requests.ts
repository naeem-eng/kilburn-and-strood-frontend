import { strapiFetch } from "../lib/strapi";
import { PageRequestsType } from "./people-setting-requests.types";

const url = "/api/people-setting";

const fetchPeopleSetting = async (
    props: PageRequestsType
): Promise<any> => {

    const {
        populate = "*",
        isPreview = true
    } = props;

    const response = await strapiFetch(
        url,
        { populate },
        undefined,
        isPreview
    );

    return response?.data; // Single object
};

export default fetchPeopleSetting;