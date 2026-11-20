export type GetInTouchProps = {
    // h1 when this block is the page's title (e.g. /contact), h2 when it sits under a page header (offices…)
    headingAs?: "h1" | "h2";
    title?: string;
    text?: string;
    enableForm?: boolean;
    formType?: "contact" | "signup"; // from Strapi form_type
    index?: number;
    className?: string;
    cta?: {
        text?: string;
        href?: string;
        type?: "filled" | "outlined" | "text";
        icon?: string;
        textColor?: 'dark-purple' | 'dark-yellow' | 'bright-red' | 'dark-blue' | 'dark-green' | 'dark-red';
        backgroundColor?: 'dark-purple' | 'dark-yellow' | 'bright-red' | 'dark-blue' | 'dark-green' | 'dark-red';
    }[]
}
