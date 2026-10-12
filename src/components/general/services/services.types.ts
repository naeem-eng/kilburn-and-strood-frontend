export type ServicesProps = {
    isAnimation?: boolean;
    isLightAnimation?: boolean;
    index?: number;
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
    cta?: {
        text: string;
        href: string;
        type: 'filled' | 'outlined' | 'text';
        icon: string;
    };
    servicesList?: Array<Array<{
        title: string;
        href: string;
        backgroundColor: 'dark-purple' | 'dark-yellow' | 'bright-red' | 'dark-blue' | 'dark-green' | 'dark-red' | 'white' | 'dark-gray';
        textColor: 'dark-purple' | 'dark-yellow' | 'bright-red' | 'dark-blue' | 'dark-green' | 'dark-red' | 'white' | 'dark-gray';
    } | {}>> | [];
}
