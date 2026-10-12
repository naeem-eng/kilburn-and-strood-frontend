import { getImgOrVideoType, getStrapiMedia } from "@/utils/utils";
import { ArticleHeroParserType } from "./article-hero-parser.types";



const articleHeroParser = (section: any) => {
    if(!section) return

    return  {
        component: 'components.article-hero',
        props: {
            color: section?.color?.name || 'dark-purple',
            heroType: getImgOrVideoType?.(section.media?.ext) || "image",
            mediaSrc: getStrapiMedia(section?.media, 'large'),
            mediaAlt: section?.media?.alternativeText,
            mediaWidth: section?.media?.width,
            mediaHeight: section?.media?.height,
        } as ArticleHeroParserType["props"]
    } as ArticleHeroParserType
}

export default articleHeroParser;