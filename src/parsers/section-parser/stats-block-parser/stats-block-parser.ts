import { getImgOrVideoType, getStrapiMedia, richTextToMarkdown } from "@/utils/utils"; 
import { StatsBlockParserType } from "./stats-block-parser.types";



const statsBlockParser = (section: any) => {
    if(!section) return
    console.log({section})

    return  {
        component: 'components.stats-block',
        props: {
            color: section?.color?.name || 'dark-blue',
            title: section?.title,
            text: section?.text,
            mediaSrc: getStrapiMedia(section?.media, 'large'),
            mediaAlt: section?.media?.alternativeText,
            mediaWidth: section?.media?.width,
            mediaHeight: section?.media?.height,
            mediaType: getImgOrVideoType?.(section.media?.ext) || "image",
            stats: section?.stats?.map((stat: any) => ({
                title: (stat?.title),
                text: (stat?.text)
            })) || []
        } as StatsBlockParserType["props"]
    } as StatsBlockParserType
}

export default statsBlockParser;