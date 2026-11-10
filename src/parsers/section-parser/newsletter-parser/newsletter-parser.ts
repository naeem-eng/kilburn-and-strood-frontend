import { getImgOrVideoType, getStrapiMedia, richTextToMarkdown } from "@/utils/utils";
import { NewsletterParserType, StrapiGlobalNewsletter, StrapiNewsletterComponent } from "./newsletter-parser.types";

const EYEBROW = "Newsletter";

/**
 * Editors enter the heading two ways: as `title` ("Ideas worth protecting"), or with
 * title = "Newsletter" and the heading as the first block of `text` ("## Ideas worth protecting"
 * or a plain first line). The eyebrow is always "Newsletter", so in the second case the first
 * block of the text is lifted out as the heading instead of printing "Newsletter" twice.
 */
const splitHeading = (rawTitle?: string, rawText?: string) => {
    const title = rawTitle?.replace(/\u2028/g, "\n").trim();
    const text = rawText?.trim();

    if (title && title.toLowerCase() !== EYEBROW.toLowerCase()) {
        return { title, text };
    }
    if (!text) return { title: undefined, text: undefined };

    const [first, ...rest] = text.split(/\n\s*\n/);
    const firstLine = first.trim();
    const isHeading = /^#{1,6}\s/.test(firstLine) || (rest.length > 0 && firstLine.length <= 60 && !firstLine.includes("\n"));
    if (!isHeading) return { title: undefined, text };

    return {
        title: firstLine.replace(/^#{1,6}\s+/, ""),
        text: rest.join("\n\n").trim() || undefined,
    };
};

const newsletterParser = (section?: StrapiNewsletterComponent | null): NewsletterParserType | undefined => {
    if (!section) return undefined;

    const { title, text } = splitHeading(richTextToMarkdown(section.title), richTextToMarkdown(section.text));
    const cta = section.cta;

    return {
        component: 'components.newsletter',
        props: {
            color: section.color?.name || 'dark-blue',
            eyebrow: EYEBROW,
            title,
            text,
            cta: cta?.text ? {
                text: cta.text,
                link: cta.link || undefined,
                color: cta.color?.name || 'dark-blue',
                isExternal: cta.isExternal || false,
                icon: cta.icon || undefined,
            } : undefined,
            mediaSrc: getStrapiMedia(section.media1, 'large') || undefined,
            mediaAlt: section.media1?.alternativeText || undefined,
            mediaWidth: section.media1?.width || undefined,
            mediaHeight: section.media1?.height || undefined,
            mediaType: getImgOrVideoType(section.media1?.ext || ""),
            mediaSrc2: getStrapiMedia(section.media2, 'large') || undefined,
            mediaAlt2: section.media2?.alternativeText || undefined,
            mediaWidth2: section.media2?.width || undefined,
            mediaHeight2: section.media2?.height || undefined,
            mediaType2: getImgOrVideoType(section.media2?.ext || ""),
        },
    };
};

/**
 * Global newsletter: the first entry of a page's `global_newsletters` relation,
 * rendered with the same component as the `components.newsletter` section.
 */
export const globalNewsletterParser = (
    globalNewsletters?: StrapiGlobalNewsletter | StrapiGlobalNewsletter[] | null
): NewsletterParserType | undefined => {
    const first = Array.isArray(globalNewsletters) ? globalNewsletters[0] : globalNewsletters;
    return newsletterParser(first?.newsletter);
};

export default newsletterParser;
