import { getDayAndMonth, getImgOrVideoType, getStrapiMedia } from "@/utils/utils";
import { CaseStudyHighlightTypeFourParserType, CaseStudyHighlightTypeOneParserType, CaseStudyHighlightTypeThreeParserType, CaseStudyHighlightTypeTwoParserType } from "./casestudy-highlight-parser.types";



const caseStudyHighlightParser = (section: any) => {
    if(!section) return

    if(section?.variant === "type-1") { 
        return  {
            component: 'components.casestudy-highlight',
            variant: 'type-1',
            props: {
                color: section?.color?.name || 'bright-red',
                cta: section?.cta && section?.cta?.map((cta: any) => ({
                    text: cta?.text,
                    href: cta?.link,
                    type: cta?.type,
                    icon: cta?.icon
                })),
                revealImage: getStrapiMedia(section?.revealMedia, 'large'),
                mediaSrc: getStrapiMedia(section?.media1, 'large'),
                mediaAlt: section?.media1?.alternativeText,
                mediaWidth: section?.media1?.width,
                mediaHeight: section?.media1?.height,
                media2Src: getStrapiMedia(section?.media2, 'large'),
                media2Alt: section?.media2?.alternativeText,
                media2Width: section?.media2?.width,
                media2Height: section?.media2?.height,
                media1Type: getImgOrVideoType(section?.media1?.ext) || "image",
                media2Type: getImgOrVideoType(section?.media2?.ext) || "image",
                title: section?.title,
                text: section?.text,
            } as CaseStudyHighlightTypeOneParserType["props"]
        } as CaseStudyHighlightTypeOneParserType
    }
    
    if(section?.variant === "type-2") { 
        return  {
            component: 'components.casestudy-highlight',
            variant: 'type-2',
            props: {
                color: section?.color?.name || 'bright-red',
                cta: section?.cta &&  section?.cta?.map((cta: any) => ({
                    text: cta?.text,
                    href: cta?.link,
                    type: cta?.type,
                    icon: cta?.icon
                })),
                revealImage: getStrapiMedia(section?.revealMedia, 'large'),
                title: section?.title,
                text: section?.text,
                mediaSrc: getStrapiMedia(section?.media1, 'large'),
                mediaAlt: section?.media1?.alternativeText,
                mediaWidth: section?.media1?.width,
                mediaHeight: section?.media1?.height,
                media2Src: getStrapiMedia(section?.media2, 'large'),
                media2Alt: section?.media2?.alternativeText,
                media2Width: section?.media2?.width,
                media2Height: section?.media2?.height,
                media1Type: getImgOrVideoType(section?.media1?.ext) || "image",
                media2Type: getImgOrVideoType(section?.media2?.ext) || "image",
            } as CaseStudyHighlightTypeTwoParserType["props"]
        } as CaseStudyHighlightTypeTwoParserType
    }


     if(section?.variant === "type-3") { 
        return  {
            component: 'components.casestudy-highlight',
            variant: 'type-3',
            props: {
                color: section?.color?.name || 'bright-red',
                cta: section?.cta && section?.cta?.map((cta: any) => ({
                    text: cta?.text,
                    href: cta?.link,
                    type: cta?.type,
                    icon: cta?.icon
                })),
                title: section?.title,
                text: section?.text,
                revealImage: getStrapiMedia(section?.revealMedia, 'large'),
                mediaSrc: getStrapiMedia(section?.media1, 'large'),
                mediaAlt: section?.media1?.alternativeText,
                mediaWidth: section?.media1?.width,
                mediaHeight: section?.media1?.height,
                media2Src: getStrapiMedia(section?.media2, 'large'),
                media2Alt: section?.media2?.alternativeText,
                media2Width: section?.media2?.width,
                media2Height: section?.media2?.height,
                media1Type: getImgOrVideoType(section?.media1?.ext) || "image",
                media2Type: getImgOrVideoType(section?.media2?.ext) || "image",
                media3Src: getStrapiMedia(section?.media3, 'large'),
                media3Alt: section?.media3?.alternativeText,
                media3Width: section?.media3?.width,
                media3Height: section?.media3?.height,
                media3Type: getImgOrVideoType(section?.media3?.ext) || "image"
            } as CaseStudyHighlightTypeThreeParserType["props"]
        } as CaseStudyHighlightTypeThreeParserType
    }



    if(section?.variant === "type-4") { 
        return  {
            component: 'components.casestudy-highlight',
            variant: 'type-4',
            props: {
                color: section?.color?.name || 'bright-red',
                cta: section?.cta && section?.cta?.map((cta: any) => ({
                    text: cta?.text,
                    href: cta?.link,
                    type: cta?.type,
                    icon: cta?.icon
                })),
                title: section?.title,
                text: section?.text,
                revealImage: getStrapiMedia(section?.revealMedia, 'large'),
                imageSrc: getStrapiMedia(section?.media1, 'large'),
                imageAlt: section?.media1?.alternativeText,
                imageWidth: section?.media1?.width,
                imageHeight: section?.media1?.height,
                image2Src: getStrapiMedia(section?.media2, 'large'),
                image2Alt: section?.media2?.alternativeText,
                image2Width: section?.media2?.width,
                image2Height: section?.media2?.height,
                media3Src: getStrapiMedia(section?.media3, 'large'),
                media3Alt: section?.media3?.alternativeText,
                media3Width: section?.media3?.width,
                media3Height: section?.media3?.height,
                media3Type: getImgOrVideoType(section?.media3?.ext) || "image"
            } as CaseStudyHighlightTypeFourParserType["props"]
        } as CaseStudyHighlightTypeFourParserType
    }

    return {
        component: 'components.casestudy-highlight',
        props: null
    }
    
}

export default caseStudyHighlightParser;