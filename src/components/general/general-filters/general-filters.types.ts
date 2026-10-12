export type GeneralFiltersProps = {
    isSearch?: boolean;
    className?: string;
    isFilter?: boolean;
    onSelectFilters?: (filters: any) => any;
    onSearch?: (search: string|undefined) => any;
    searchText?: string;
    placeholder?: string;
    filters?: Array<{
        title?: string;
        selected?: boolean;
        items?: Array<{
            title?: string;
            selected?: boolean;
        }>
    }>;
}
