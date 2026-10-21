import type { PeopleListing } from "@/requests/listing-requests/listing-queries";

export type PeopleCardsContainerProps = {
    initialData?: PeopleListing; // first page, rendered on the server
    color?: 'dark-purple' | 'dark-yellow' | 'bright-red' | 'dark-blue' | 'dark-green' | 'dark-red' | 'white' | 'dark-gray';
    isFilters?: boolean;
    isTabbed?: boolean;
    title?: string;
    isLoadMore?: boolean;
    className?: string;
}
