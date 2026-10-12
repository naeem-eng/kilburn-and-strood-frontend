import { EventFullCardsProps } from "../event-full-cards/event-full-cards.types";

export type EventContainerProps = {
    color?: 'dark-purple' | 'dark-yellow' | 'bright-red' | 'dark-blue' | 'dark-green' | 'dark-red' | 'white' | 'dark-gray';
    className?: string;
    events?: {
        title?: string;
        loadMore?: boolean;
        color?: 'dark-purple' | 'dark-yellow' | 'bright-red' | 'dark-blue' | 'dark-green' | 'dark-red' | 'white' | 'dark-gray';
        list?: Array<EventFullCardsProps>
    };
    pastEvents?: {
        title: string;
        color?: 'dark-purple' | 'dark-yellow' | 'bright-red' | 'dark-blue' | 'dark-green' | 'dark-red' | 'white' | 'dark-gray';
        list?: Array<{
                title: string;
                tag: string;
                color?: 'dark-purple' | 'dark-yellow' | 'bright-red' | 'dark-blue' | 'dark-green' | 'dark-red' | 'white' | 'dark-gray';
                date: string;
                imageSrc: string;
                imageAlt: string;
                imageWidth: number;
                imageHeight: number;
            }>;
    }; 
}
