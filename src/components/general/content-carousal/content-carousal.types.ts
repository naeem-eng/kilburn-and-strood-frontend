export type ContentCarousalProps = {
    title?: string;
    items: Array<{
        slug?: string;
        url?: string;
        isMedia?: boolean;
        sortDate?: Date;
        title?: string;
        itemType: string  | 'Insights' | 'Events';
        date?: string;
        mediaType: 'image' | 'video' | null;
        mediaSrc?: string;
        mediaAlt?: string;
        mediaWidth?: number;
        mediaHeight?: number;
    }>;
}
