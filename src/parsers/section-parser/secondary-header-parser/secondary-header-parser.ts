import { getImgOrVideoType, getStrapiMedia } from "@/utils/utils";
import { SecondaryHeaderParserType } from "./secondary-header-parser.types";


const secondaryHeaderParser = (section: any) => {
    if(!section) return
    // // //console.log("secondaryHeaderParser", {section}, section.color)
    return  {
        component: 'components.secondary-header',
        props: {
            leftImageSrc: getStrapiMedia(section?.media1, 'medium'),
            leftImageAlt: section?.media1?.alternativeText,
            leftImageWidth: section?.media1?.width,
            leftImageHeight: section?.media1?.height,
            rightImageSrc: getStrapiMedia(section?.media2, 'medium'),
            rightImageAlt: section?.media2?.alternativeText,
            rightImageWidth: section?.media2?.width,
            rightImageHeight: section?.media2?.height,
            title: section?.title,
            text: section?.text,
            media3: {
                url: getStrapiMedia(section?.media3, 'medium'),
                alt: section?.media3?.alternativeText,
                width: section?.media3?.width,
                height: section?.media3?.height,
                type: getImgOrVideoType(section?.media3?.ext) || "image"
            },
            goBackCta: section?.goBackCTA ? {
                text: section?.goBackCTA?.text,
                href: section?.goBackCTA?.href,
                type: section?.goBackCTA?.type,
                icon: section?.goBackCTA?.icon
            } : null,
            cta: section?.cta?.map((cta: any) => ({
                text: cta?.text,
                href: cta?.toContactForm ? '#contactForm' : cta?.link,
                type: cta?.type,
                icon: cta?.icon,
                isExternal: cta?.isExternal,
                toContactForm: cta?.toContactForm
            })),
            color: section?.color?.name || "bright-red"
        } as SecondaryHeaderParserType["props"]
    } as SecondaryHeaderParserType
}

export default secondaryHeaderParser;