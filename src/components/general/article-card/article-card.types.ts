export type ArticleCardProps = {
    title: string;
    as?: string;
    id: string;
    tag: string;
    color?: 'dark-purple' | 'dark-yellow' | 'bright-red' | 'dark-blue' | 'dark-green' | 'dark-red' | 'white' | 'dark-gray';
    date: string;
    imageSrc: string;
    isUpcoming?: boolean;
    imageAlt: string;
    slug: string;
    imageWidth: number;
    imageHeight: number;
}
