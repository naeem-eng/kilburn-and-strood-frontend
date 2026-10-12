import { getDayAndMonth, getImgOrVideoType, getStrapiMedia } from "@/utils/utils";
import { LatestContentParserType } from "./latest-content-parser.types";



const latestContentParser = (section: any) => {
    if(!section) return


    // //console.log({section})

    return  {
        component: 'components.latest-content',
        props: {
            title: (section?.type == "event" ? section?.event?.title : section?.article?.title) || section?.title,
            color: section?.color?.name,
            titleAbovemedia: section?.titleAbovemedia,
            titleAboveText: section?.titleAboveText,
            text: (section?.type == "event" ? section?.event?.introduction : section?.article?.text) || section?.text,
            type: section?.type,
            mediaSrc: getStrapiMedia(section?.media, 'medium'),
            mediaAlt: section?.media?.alternativeText,
            mediaSrcBottom: getStrapiMedia(section?.mediaBottom, 'medium'),
            mediaAltBottom: section?.mediaBottom?.alternativeText,
            mediaWidth: section?.media?.width,
            mediaHeight: section?.media?.height,
            mediaWidthBottom: section?.mediaBottom?.width,
            mediaHeightBottom: section?.mediaBottom?.height,
            media1Type: getImgOrVideoType(section?.media?.ext) || "image",
            mediaBottomType: getImgOrVideoType(section?.mediaBottom?.ext) || "image",
            cta: section?.cta && {
                text: section?.cta?.text,
                href: section?.cta?.link,
                type: section?.cta?.type,
                icon: section?.cta?.icon
            },
            topCta: section?.topCta &&  {
                text: section?.topCta?.text,
                href: section?.topCta?.link,
                type: section?.topCta?.type,
                icon: section?.topCta?.icon
            },
            card: section?.type == "event" && {
                title: getDayAndMonth(section?.event?.eventDate)?.day,
                text: getDayAndMonth(section?.event?.eventDate)?.month
            },
            article: section?.type == "article" ? section?.article : undefined,
            event: section?.type == "event" ? section?.event : undefined
        } as LatestContentParserType["props"]
    } as LatestContentParserType

    
}

export default latestContentParser;