import { getStrapiMedia, richTextToMarkdown } from "@/utils/utils";
import { BodyMenuMedia } from "@/components/general/body-menu/body-menu.types";
import { BodyMenuParserType, StrapiBodyMenu } from "./body-menu-parser.types";

// CMS text uses U+2028 for manual line breaks ("Where IP\u2028adds value"); trailing ones are stray
const cleanLines = (value?: string | null) =>
    value?.replace(/\u2028/g, "\n").trim() || undefined;

const toMedia = (media?: StrapiBodyMenu["media1"]): BodyMenuMedia | undefined => {
    const url = getStrapiMedia(media, 'large');
    if (!url) return undefined;
    return {
        url,
        alt: media?.alternativeText || undefined,
        width: media?.width || undefined,
        height: media?.height || undefined,
    };
};

const bodyMenuParser = (section?: StrapiBodyMenu | null): BodyMenuParserType | undefined => {
    if (!section) return undefined;

    const cta = section.cta?.find((item) => item?.text);
    const items = (section.items || [])
        .map((item) => ({ title: cleanLines(item?.text) || "", href: item?.link || undefined }))
        .filter((item) => item.title);

    return {
        component: 'components.body-menu',
        props: {
            color: section.color?.name || 'bright-red',
            title: cleanLines(richTextToMarkdown(section.title)),
            text: richTextToMarkdown(section.text),
            cta: cta?.text ? {
                text: cta.text,
                href: cta.link || undefined,
                type: cta.type || 'text',
                icon: cta.icon || undefined,
                isExternal: cta.isExternal || false,
            } : undefined,
            menu: items.length ? { title: cleanLines(section.itemsTitle), items } : undefined,
            media1: toMedia(section.media1),
            media2: toMedia(section.media2),
        },
    };
};

export default bodyMenuParser;
