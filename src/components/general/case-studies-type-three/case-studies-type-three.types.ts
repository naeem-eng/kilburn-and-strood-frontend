export type CaseStudiesTypeThreeProps = {
    isAnimation?: boolean;
    isLightAnimation?: boolean;
    index?: number;
    cta?: Array<{
        text: string;
        href: string;
        type: 'filled' | 'outlined' | 'text';
        icon: string;
    }>;
    color?: 'dark-purple' | 'dark-yellow' | 'bright-red' | 'dark-blue' | 'dark-green' | 'dark-red';
    mediaSrc?: string;
    mediaAlt?: string;
    mediaWidth?: number;
    mediaHeight?: number;
    media2Src?: string;
    media2Alt?: string;
    media2Width?: number;
    media2Height?: number;
    media3Src?: string;
    media3Alt?: string;
    media3Width?: number;
    media3Height?: number;
    media3Type?: 'media' | 'video';
    media1Type?: 'image' | 'video';
    media2Type?: 'image' | 'video';
    title?: string;
    text?: string;
    revealImage?: string;
}
