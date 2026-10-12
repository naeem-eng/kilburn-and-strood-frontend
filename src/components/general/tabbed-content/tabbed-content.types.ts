export type TabbedContentProps = {
    isAnimation?: boolean;
    isLightAnimation?: boolean;
    index?: number;
    className?: string;
    color?: 'dark-purple' | 'dark-yellow' | 'bright-red' | 'dark-blue' | 'dark-green' | 'dark-red' | 'white' | 'dark-gray';
    title: string;
    media1?: {
        url: string;
        alt: string;
        width: number;
        height: number;
    };
    media2?: {
        url: string;
        alt: string;
        width: number;
        height: number;
    };
    tabs: Array<{
        id: string;
        title: string;
        content: {
            title: string;
            text: string;
            cta: {
                text: string;
                href: string;
                type: 'filled' | 'outlined' | 'text';
                icon: string;
                isExternal: boolean;
            };
            type?: 'image' | 'menu';
            imageSrc?: string;
            imageAlt?: string;
            imageWidth?: number;
            imageHeight?: number;
            menu?: {
                title: string;
                items: Array<{
                    title: string;
                    href: string;
                }>;
            }
        };
    }>;
}
