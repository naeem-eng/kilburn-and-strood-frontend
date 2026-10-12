export type LocationDetailsProps = {
    title?: string;
    tabName?: string;
    className?: string;
    details?: string;
    color?: 'dark-purple' | 'dark-yellow' | 'bright-red' | 'dark-blue' | 'dark-green' | 'dark-red' | 'white' | 'dark-gray';
    cta?: {
        text?: string;
        href?: string;
        type?: 'text' | 'filled';
        isExternal?: boolean;
    }
    imageSrc?: string;
    imageAlt?: string;
    imageWidth?: number;
    imageHeight?: number;
    phone?: string;
    address?: string;
}
