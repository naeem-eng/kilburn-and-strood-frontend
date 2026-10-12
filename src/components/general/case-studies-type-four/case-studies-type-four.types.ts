export type CaseStudiesTypeFourProps = {
    isAnimation?: boolean;
    isLightAnimation?: boolean;
    index?: number;
    cta?: Array<{
        text: string;
        href: string;
        type: 'filled' | 'outlined' | 'text';
        icon: 'right-arrow' | 'left-arrow' | 'external-link' | null;
    }>;
    color?: 'dark-purple' | 'dark-yellow' | 'bright-red' | 'dark-blue' | 'dark-green' | 'dark-red';
    imageSrc?: string;
    imageAlt?: string;
    imageWidth?: number;
    imageHeight?: number;
    image2Src?: string;
    image2Alt?: string;
    image2Width?: number;
    image2Height?: number;
    media3Src?: string;
    media3Alt?: string;
    media3Width?: number;
    media3Height?: number;
    media3Type?: 'image' | 'video';
    title?: string;
    text?: string;
    revealImage?: string;
}
