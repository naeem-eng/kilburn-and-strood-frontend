import { NewsletterProps } from "@/components/general/newsletter/newsletter.types";

export type NewsletterParserType = {
    component: 'components.newsletter';
    props: NewsletterProps
}

type StrapiNewsletterMedia = {
    url?: string;
    ext?: string;
    alternativeText?: string | null;
    width?: number | null;
    height?: number | null;
    formats?: Record<string, { url?: string } | undefined> | null;
};

/** Raw `components.newsletter` (Strapi v5, after strapiFetch camelCases the keys). */
export type StrapiNewsletterComponent = {
    __component?: 'components.newsletter';
    name?: string | null;
    title?: unknown;   // plain text, or a Rich text (Blocks) array
    text?: unknown;    // markdown, or a Rich text (Blocks) array
    color?: { name?: NewsletterProps["color"] } | null;
    cta?: {
        text?: string | null;
        link?: string | null;
        isExternal?: boolean | null;
        icon?: string | null;
        color?: { name?: NewsletterProps["color"] } | null;
    } | null;
    media1?: StrapiNewsletterMedia | null;
    media2?: StrapiNewsletterMedia | null;
};

/** Raw `global newsletter` entry, as returned through a `global_newsletters` relation. */
export type StrapiGlobalNewsletter = {
    name?: string | null;
    newsletter?: StrapiNewsletterComponent | null;
};
