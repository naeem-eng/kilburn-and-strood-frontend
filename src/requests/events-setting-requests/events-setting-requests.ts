import { strapiFetch } from "../lib/strapi";
import { PageRequestsType } from "./events-setting-requests.types";

const url = "/api/event-setting";

const fetchEventsSetting = async (
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

export default fetchEventsSetting;