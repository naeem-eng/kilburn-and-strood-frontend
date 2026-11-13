export type GetInTouchProps = {
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
