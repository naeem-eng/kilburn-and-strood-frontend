export type EventFullCardsProps = {
    title?: string;
    spentTime?: string;
    description?: string;
    color?: 'dark-purple' | 'dark-yellow' | 'bright-red' | 'dark-blue' | 'dark-green' | 'dark-red' | 'white' | 'dark-gray';
    date?: string;
    eventDate?: string;
    slug?: string;
    noLink?: boolean;
    type?: string;
    status?: null |  string;
    imageSrc: string;
    imageAlt: string;
    imageWidth: number;
    imageHeight: number;
    attending?: boolean;
    isUpcoming?: boolean;
    cta?: {
        text: string;
        href: string;
        type: "text" | "filled";
        icon: string;
    }[]
}
