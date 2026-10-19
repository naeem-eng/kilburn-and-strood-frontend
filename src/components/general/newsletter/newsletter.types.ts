export type NewsletterProps = {
    isLightAnimation?: boolean;
    isAnimation?: boolean;
    index?: number;
    color?: 'dark-purple' | 'dark-yellow' | 'bright-red' | 'dark-blue' | 'dark-green' | 'dark-red';
    title?: string;
    text?: string;
    cta?: {
        text?: string;
        link?: string;
        color?: 'dark-purple' | 'dark-yellow' | 'bright-red' | 'dark-blue' | 'dark-green' | 'dark-red';
        isExternal?: boolean;
        icon?: string;
    }
    mediaSrc?: string;
    mediaAlt?: string;
    mediaWidth?: number;
    mediaHeight?: number;
    mediaType?: 'image' | 'video';
    mediaSrc2?: string;
    mediaAlt2?: string;
    mediaWidth2?: number;
    mediaHeight2?: number;
    mediaType2?: 'image' | 'video';
}
