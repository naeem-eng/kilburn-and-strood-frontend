import { getStrapiMedia } from "@/utils/utils";
import { TextImageSliderParserType } from "./text-image-slider-parser.types";



const textImageSliderParser = (section: any) => {
    if(!section) return
    // // //console.log("textImageSliderParser", section)
    if(section?.viewType === "articles") {
        return {
                component: 'components.text-image-slider',
                props: {
                    color: section?.color?.name || "bright-red",
                    label: section?.label,
                    title: section?.title,
                    items: section?.articles?.map((item: any) => ({
                        imageSrc: getStrapiMedia(item?.featuredImage, 'medium'),
                        imageAlt: item?.featuredImage?.alternativeText,
                        imageWidth: item?.featuredImage?.width,
                        imageHeight: item?.featuredImage?.height,
                        title: item?.title,
                        text: item?.textSmall || item?.text || item?.name,
                        cta: item?.cta &&  {
                            text: "Read more",
                            href: "/insights/" + item?.slug,
                            type: "text",
                            isExternal: false
                        }
                    }))
                } as TextImageSliderParserType["props"]
            } as TextImageSliderParserType
    }

    if(section?.viewType === "events") {
        return {
                component: 'components.text-image-slider',
                props: {
                    color: section?.color?.name || "bright-red",
                    label: section?.label,
                    title: section?.title,
                    items: section?.articles?.map((item: any) => ({
                        imageSrc: getStrapiMedia(item?.featuredImage, 'medium'),
                        imageAlt: item?.featuredImage?.alternativeText,
                        imageWidth: item?.featuredImage?.width,
                        imageHeight: item?.featuredImage?.height,
                        title: item?.title,
                        text: item?.textSmall || item?.text || item?.name,
                        cta: item?.cta &&  {
                            text: "Read more",
                            href: "/events/" + item?.slug,
                            type: "text",
                            isExternal: false
                        }
                    }))
                } as TextImageSliderParserType["props"]
            } as TextImageSliderParserType
    }

    if(section?.viewType === "general") {
        return {
                component: 'components.text-image-slider',
                props: {
                    color: section?.color?.name || "bright-red",
                    label: section?.label,
                    title: section?.title,
                    items: section?.articles?.map((item: any) => ({
                        imageSrc: getStrapiMedia(item?.media, 'medium'),
                        imageAlt: item?.media?.alternativeText,
                        imageWidth: item?.media?.width,
                        imageHeight: item?.media?.height,
                        title: item?.title,
                        text: item?.text || item?.name,
                        cta: item?.cta &&  {
                            text: "Read more",
                            href: "/events/" + item?.slug,
                            type: "text",
                            isExternal: false
                        }
                    }))
                } as TextImageSliderParserType["props"]
            } as TextImageSliderParserType
    }

    return  {
        component: 'components.text-image-slider',
        props: {
            color: section?.color?.name || "bright-red",
            label: section?.label,
            title: section?.title,
            items: section?.items?.map((item: any) => ({
                imageSrc: getStrapiMedia(item?.media, 'medium'),
                imageAlt: item?.media?.alternativeText,
                imageWidth: item?.media?.width,
                imageHeight: item?.media?.height,
                title: item?.title,
                text: item?.text,
                cta: item?.cta &&  {
                    text: item?.cta?.text,
                    href: item?.cta?.link,
                    type: item?.cta?.type,
                    isExternal: item?.cta?.isExternal
                }
            }))
        } as TextImageSliderParserType["props"]
    } as TextImageSliderParserType

    
}

export default textImageSliderParser;