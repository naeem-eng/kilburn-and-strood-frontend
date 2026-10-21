import type { ArticleListing } from "@/requests/listing-requests/listing-queries";

export type ArticleContainerProps = {
    initialData?: ArticleListing; // first page, rendered on the server
    color?: 'dark-purple' | 'dark-yellow' | 'bright-red' | 'dark-blue' | 'dark-green' | 'dark-red' | 'white' | 'dark-gray';
    className?: string;
    
    // articles: Array<{
    //     title: string;
    //     tag: string;
    //     color?: 'dark-purple' | 'dark-yellow' | 'bright-red' | 'dark-blue' | 'dark-green' | 'dark-red' | 'white' | 'dark-gray';
    //     date: string;
    //     imageSrc: string;
    //     imageAlt: string;
    //     imageWidth: number;
    //     imageHeight: number;
    // }>;
}
