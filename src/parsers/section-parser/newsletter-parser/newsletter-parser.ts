import { getImgOrVideoType, getStrapiMedia, richTextToMarkdown } from "@/utils/utils"; 
import { NewsletterParserType } from "./newsletter-parser.types";



const newsletterParser = (section: any) => {
    if(!section) return

    // console.log({section})

    return  {
        component: 'components.newsletter',
        props: {
            color: section?.color?.name || 'dark-blue',
            title: richTextToMarkdown(section?.title),
            text: richTextToMarkdown(section?.text),
            cta: {
                text: section?.cta?.text || undefined,
                link: section?.cta?.link || undefined,
                color: section?.cta?.color?.name || 'dark-blue',
                isExternal: section?.cta?.isExternal || false,
                icon: section?.cta?.icon || undefined,
            },
            mediaSrc: getStrapiMedia(section?.media1, 'large'),
            mediaAlt: section?.media1?.alternativeText,
            mediaWidth: section?.media1?.width,
            mediaHeight: section?.media1?.height,
            mediaType: getImgOrVideoType?.(section.media1?.ext) || "image",
            mediaSrc2: getStrapiMedia(section?.media2, 'large'),
            mediaAlt2: section?.media2?.alternativeText,
            mediaWidth2: section?.media2?.width,
            mediaHeight2: section?.media2?.height,
            mediaType2: getImgOrVideoType?.(section.media2?.ext) || "image",
        } as NewsletterParserType["props"]
    } as NewsletterParserType
}

export default newsletterParser;