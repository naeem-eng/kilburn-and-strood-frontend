export type StatsBlockProps = {
    isLightAnimation?: boolean;
    isAnimation?: boolean;
    index?: number;
    color?: 'dark-purple' | 'dark-yellow' | 'bright-red' | 'dark-blue' | 'dark-green' | 'dark-red';
    title?: any;
    text?: any;
    mediaSrc?: string;
    mediaAlt?: string;
    mediaWidth?: number;
    mediaHeight?: number;
    mediaType?: 'image' | 'video';
    stats?: {
        title?: any;
        text?: any;
    }[]
}
