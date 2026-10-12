

export type TextImageSliderProps = {
    isAnimation?: boolean;
    isLightAnimation?: boolean;
    index?: number;
    color?: 'dark-purple' | 'dark-yellow' | 'bright-red' | 'dark-blue' | 'dark-green' | 'dark-red';
    label?: string;
    title?: string;
    className?: string;
    items: {
        imageSrc: string;
        imageAlt: string;
        imageWidth: number;
        imageHeight: number;
        title?: string;
        text: string;
        cta?: {
            text: string;
            href: string;
            isExternal?: boolean;
            type?: 'text' | 'filled' | 'outlined';
        };
    }[];
}
