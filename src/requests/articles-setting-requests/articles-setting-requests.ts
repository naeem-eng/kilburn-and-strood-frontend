import { strapiFetch } from "../lib/strapi";
import { PageRequestsType } from "./articles-setting-requests.types";

const url = "/api/article-setting";

const fetchArticlesSetting = async (
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

export default fetchArticlesSetting;