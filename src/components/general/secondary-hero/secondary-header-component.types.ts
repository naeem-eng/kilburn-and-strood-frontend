export type SecondaryHeaderComponentProps = {
    isAnimation?: boolean;
    isLightAnimation?: boolean;
    index?: number;
    leftImageSrc?: string;
    leftImageAlt?: string;
    leftImageWidth?: number;
    leftImageHeight?: number;
    rightImageSrc?: string;
    rightImageAlt?: string;
    rightImageWidth?: number;
    rightImageHeight?: number;
    color?: "yellow" | "bright-red" | "dark-purple" | "dark-gray" | "light-gray";
    media3?: {
        alt?: string;
        url?: string;
        width?: number;
        height?: number;
        type?: "image" | "video";
    };
    title?:  string;
    text?: string;
    goBackCta?: {
        text?:  string;
        href?: string;
        type?: 'filled' | 'text' | 'outlined';
        icon?: 'right-arrow' | 'left-arrow' | 'external-link' | null;
    };
    cta?: Array<{
        text?:  string;
        href?: string;
        type?: 'filled' | 'text' | 'outlined';
        icon?: 'right-arrow' | 'left-arrow' | 'external-link' | null;
    }>
}
