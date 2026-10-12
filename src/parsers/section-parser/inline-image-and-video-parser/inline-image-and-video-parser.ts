import { getImgOrVideoType, getStrapiMedia } from "@/utils/utils";
import { InlineImageAndVideosParserType } from "./inline-image-and-video-parser.types";



const inlineImageAndVideoParser = (section: any) => {
    if(!section) return

    return  {
        component: 'components.inline-image-and-video',
        props: {
            title: section?.name,
            mediaSrc: getStrapiMedia(section?.media, 'medium'),
            mediaAlt: section?.media?.alternativeText,
            mediaWidth: section?.media?.width,
            mediaHeight: section?.media?.height,
            mediaType: getImgOrVideoType?.(section.media?.ext) || "image",
        } as InlineImageAndVideosParserType["props"]
    } as InlineImageAndVideosParserType
}

export default inlineImageAndVideoParser;