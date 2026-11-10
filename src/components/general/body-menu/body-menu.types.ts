export type BodyMenuColor = 'dark-purple' | 'dark-yellow' | 'bright-red' | 'dark-blue' | 'dark-green' | 'dark-red' | 'white' | 'dark-gray';

export type BodyMenuMedia = {
    url: string;
    alt?: string;
    width?: number;
    height?: number;
};

export type BodyMenuProps = {
    isAnimation?: boolean;
    isLightAnimation?: boolean;
    index?: number;
    className?: string;
    color?: BodyMenuColor;
    title?: string;
    text?: string;
    cta?: {
        text: string;
        href?: string;
        type?: 'filled' | 'outlined' | 'text';
        icon?: string;
        isExternal?: boolean;
    };
    menu?: {
        title?: string;
        items: Array<{ title: string; href?: string }>;
    };
    media1?: BodyMenuMedia;
    media2?: BodyMenuMedia;
};
