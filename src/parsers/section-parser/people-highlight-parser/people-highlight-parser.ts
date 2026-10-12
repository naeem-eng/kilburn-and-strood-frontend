import { getStrapiMedia } from "@/utils/utils";
import { PeopleHighlightParserType } from "./people-highlight-parser.types";



const peopleHighlightParser = (section: any) => {
    if(!section) return

    // // //console.log({section})

    return  {
        component: 'components.people-highlight',
        props: {
            items: section?.items?.map((item: any) => ({
                color: item?.color?.name || 'dark-purple',
                label: item?.label,
                imageSrc: getStrapiMedia(item?.media, 'medium'),
                imageAlt: item?.media?.alternativeText,
                imageWidth: item?.media?.width,
                imageHeight: item?.media?.height,
                patternImageSrc: getStrapiMedia(item?.patternMedia, 'medium'),
                patternImageAlt: item?.patternMedia?.alternativeText,
                patternImageWidth: item?.patternMedia?.width,
                patternImageHeight: item?.patternMedia?.height,
                title: item?.selectType === "New" ? item?.title : item?.person?.name,
                text: item?.text,
                role: item?.peopleRole?.title,
                cta: item?.cta && {
                    text: item?.cta?.text,
                    href: item?.cta?.link,
                    type: item?.cta?.type,
                    icon: item?.cta?.icon
                }
            }))
        } as PeopleHighlightParserType["props"]
    } as PeopleHighlightParserType

    
}

export default peopleHighlightParser;