
export type TextWithImageProps = {
    isAnimation?: boolean;
    isLightAnimation?: boolean;
    index?: number;
    color?: 'dark-purple' | 'dark-yellow' | 'bright-red' | 'dark-blue' | 'dark-green' | 'dark-red';
    textOnLeft?: boolean;
    className?: string;
    imageSrc?: string;
    imageAlt?: string;
    title?: string;
    text?: string;
    cta?: {
        text: string;
        href: string;
        type: 'filled' | 'outlined' | 'text';
        icon: string;
    }
}