import { getStrapiMedia } from "@/utils/utils";
import { LocationParserType } from "./location-parser.types";



const locationParser = (section: any) => {
    if(!section) return

    return  {
        component: 'components.location',
        props: {
            title: section?.title,
            details: section?.text,
            color: section?.color?.name || 'dark-purple',
            cta: section?.cta && {
                text: section?.cta?.text,
                href: section?.cta?.link,
                type: section?.cta?.type,
                isExternal: section?.cta?.isExternal
            },
            imageSrc: getStrapiMedia(section?.media, 'medium'),
            imageAlt: section?.media?.alternativeText,
            imageWidth: section?.media?.width,
            imageHeight: section?.media?.height,
            address: section?.address,
            phone: section?.phone
        } as LocationParserType["props"]
    } as LocationParserType
}

export default locationParser;