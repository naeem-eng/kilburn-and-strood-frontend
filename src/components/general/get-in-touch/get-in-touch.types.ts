export type GetInTouchProps = {
    title?: string;
    text?: string;
    embedCode?: string;
    formUrl?: string;
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
