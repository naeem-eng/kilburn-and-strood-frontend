export type PeopleHighlightProps = {
    isAnimation?: boolean;
    isLightAnimation?: boolean;
    index?: number;
    items?: Array<{
        imageSrc: string;
        imageAlt: string;
        role?: string;
        imageWidth: number;
        color?: 'dark-purple' | 'dark-yellow' | 'bright-red' | 'dark-blue' | 'dark-green' | 'dark-red';
        imageHeight: number;
        patternImageSrc: string;
        patternImageAlt: string;
        patternImageWidth: number;
        patternImageHeight: number;
        title: string;
        text: string;
        label: string;
        cta: {
            text: string;
            href: string;
            type: 'filled' | 'outlined' | 'text';
            icon: string;
        }
    }>;
}
