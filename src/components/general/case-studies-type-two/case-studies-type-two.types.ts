export type CaseStudiesTypeTwoProps = {
    isAnimation?: boolean;
    isLightAnimation?: boolean;
    index?: number;
    color?: 'dark-purple' | 'dark-yellow' | 'bright-red' | 'dark-blue' | 'dark-green' | 'dark-red';
    title?: string;
    text?: string;
    cta?: {
        text?: string;
        href?: string;
        type?: 'text' | 'filled' | 'outlined';
        icon?: string;
    }[];
    mediaSrc?: string;
    mediaAlt?: string;
    mediaWidth?: number;
    mediaHeight?: number;
    media2Src?: string;
    media2Alt?: string;
    media2Width?: number;
    media2Height?: number;
    media1Type?: 'image' | 'video';
    media2Type?: 'image' | 'video';
    revealImage?: string;
}
