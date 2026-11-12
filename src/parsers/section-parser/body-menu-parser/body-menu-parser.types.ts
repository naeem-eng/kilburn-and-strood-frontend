import { BodyMenuColor, BodyMenuProps } from "@/components/general/body-menu/body-menu.types";

export type BodyMenuParserType = {
    component: 'components.body-menu';
    props: BodyMenuProps;
};

type StrapiBodyMenuMedia = {
    url?: string;
    alternativeText?: string | null;
    width?: number | null;
    height?: number | null;
    formats?: Record<string, { url?: string } | undefined> | null;
};

/** Raw `components.body-menu` (Strapi v5, after strapiFetch camelCases the keys). */
export type StrapiBodyMenu = {
    component?: 'components.body-menu';
    name?: string | null;
    title?: unknown;        // plain text, or a Rich text (Blocks) array
    text?: unknown;         // markdown, or a Rich text (Blocks) array
    itemsTitle?: string | null;
    items?: Array<{ text?: string | null; link?: string | null } | null> | null;
    cta?: Array<{
        text?: string | null;
        link?: string | null;
        type?: 'filled' | 'outlined' | 'text' | null;
        icon?: string | null;
        isExternal?: boolean | null;
    } | null> | null;
    color?: { name?: BodyMenuColor } | null;
    media1?: StrapiBodyMenuMedia | null;
    media2?: StrapiBodyMenuMedia | null;
};
