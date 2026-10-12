import { getImgOrVideoType, getStrapiMedia } from "@/utils/utils";
import { HomepageHeaderParserType } from "./homepage-header-parser.types";


const homepageHeaderParser = (section: any) => {
    if(!section) return
    // // //console.log("homepageHeaderParser", {section}, section.color)
    return  {
        component: 'components.homepage-header',
        props: {
            leftMediaSrc: getStrapiMedia(section?.media1, 'medium'),
            leftMediaAlt: section?.media1?.alternativeText,
            leftMediaWidth: section?.media1?.width,
            leftMediaHeight: section?.media1?.height,
            rightMediaSrc: getStrapiMedia(section?.media2, 'medium'),
            rightMediaAlt: section?.media2?.alternativeText,
            rightMediaWidth: section?.media2?.width,
            rightMediaHeight: section?.media2?.height,
            leftMediaType: getImgOrVideoType(section?.media1?.ext) || "image",
            rightMediaType: getImgOrVideoType(section?.media2?.ext) || "image",
            title: section?.title,
            text: section?.text,
            color: section?.color?.name || "dark-yellow",
            cta: section?.cta && section?.cta?.map((cta: any) => ({
                text: cta?.text,
                href: cta?.toContactForm ? '#contactForm' : cta?.link,
                type: cta?.type,
                icon: cta?.icon,
                toContactForm: cta?.toContactForm
            }))
        }
    } as HomepageHeaderParserType
}

export default homepageHeaderParser;