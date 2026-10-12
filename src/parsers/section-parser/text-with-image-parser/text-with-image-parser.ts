import { getStrapiMedia } from "@/utils/utils";
import { TextWithImagerParserType } from "./text-with-image-parser.types";



const textWithImagerParser = (section: any) => {
    if(!section) return

    return  {
        component: 'components.text-with-image',
        props: {
            textOnLeft: (section.imagePosition === "left"),
            imageSrc: getStrapiMedia(section?.media1, 'medium'),    
            imageAlt: section?.media1?.alternativeText,
            cta: section?.cta && {
                text: section?.cta?.text,
                href: section?.cta?.link,
                type: section?.cta?.type,
                icon: section?.cta?.icon,
                isExternal: section?.cta?.isExternal
            },
            color: section?.color?.name || "bright-red",
            text: section?.text,
            title: section?.title
        } as TextWithImagerParserType["props"]
    } as TextWithImagerParserType

    
}

export default textWithImagerParser;