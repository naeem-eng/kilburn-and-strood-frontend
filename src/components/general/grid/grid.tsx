"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/helpers/buttons";
import { TextLg } from "@/components/helpers/typography";
import Loading from "@/app/loading";
import GeneralFilters from "../general-filters";
import GridCard from "./grid-card";
import { fetchGrid, fetchGridFilters } from "@/requests/grid-requests";
import { uniqueObjects } from "@/utils/utils";
import { GridCardProps, GridProps } from "./grid.types";

type FilterOption = { key: string; title: string; items: { title: string }[] };

// Cards from the grid's renders (insights, events, case studies), newest first, 6 at a time with Load more.
// Filters come from filter_enums; search from allow_search.
const Grid: React.FC<GridProps> = ({ name, allowFilters, allowSearch, filterEnums, renders, className }) => {
    const [cards, setCards] = useState<GridCardProps[]>([]);
    const [page, setPage] = useState(1);
    const [pageCount, setPageCount] = useState(0);
    const [search, setSearch] = useState<string>();
    const [selected, setSelected] = useState<Record<string, string[]>>({});
    const [filterOptions, setFilterOptions] = useState<FilterOption[]>([]);
    const [loader, setLoader] = useState(true);
    const [buttonLoader, setButtonLoader] = useState(false);
    const abortControllerRef = useRef<AbortController | null>(null);

    const query = useMemo(() => ({
        renders: renders || [],
        enums: filterEnums || [],
    }), [renders, filterEnums]);

    const getCards = useCallback(async (nextPage: number) => {
        abortControllerRef.current?.abort();
        abortControllerRef.current = new AbortController();
        try {
            const resp = await fetchGrid({ ...query, page: nextPage, search, filters: selected }, abortControllerRef.current.signal);
            setPageCount(resp?.pagination?.pageCount || 0);
            setCards((prev) => nextPage === 1 ? resp?.data || [] : uniqueObjects(prev, resp?.data || []));
        } catch (error: any) {
            if (error?.name === "AbortError") return; // ignore cancelled requests
        }
        setLoader(false);
        setButtonLoader(false);
    }, [query, search, selected]);

    // page 1 again whenever search or filters change
    useEffect(() => {
        setPage(1);
        getCards(1);
    }, [getCards]);

    useEffect(() => {
        if (!allowFilters || !query.enums.length) return;
        fetchGridFilters(query).then((resp) => setFilterOptions(Array.isArray(resp) ? resp : []));
    }, [allowFilters, query]);

    const onSearch = (value?: string) => {
        if ((value || undefined) === search) return; // unchanged: no refetch, so don't show the loader
        setLoader(true);
        setSearch(value || undefined);
    };

    const onSelectFilters = (filtersTodos: any) => {
        const next: Record<string, string[]> = {};
        Object.values(filtersTodos || {}).forEach((filter: any) => {
            const key = filterOptions.find((option) => option.title === filter?.title?.trim())?.key;
            const values = filter?.items?.filter((item: any) => item?.selected).map((item: any) => item?.title);
            if (key && values?.length) next[key] = values;
        });
        if (JSON.stringify(next) === JSON.stringify(selected)) return;
        setLoader(true);
        setSelected(next);
    };

    const onLoadMore = () => {
        const nextPage = page + 1;
        setButtonLoader(true);
        setPage(nextPage);
        getCards(nextPage);
    };

    if (!query.renders.length) return null;

    const showFilters = allowFilters && filterOptions.length > 0;

    return (
        <section aria-label={name || "Grid"} className={`no-section w-full py-xl overflow-x-hidden flex flex-col justify-start items-start ${className || ''}`}>
            {/* GeneralFilters is sticky (for the full listing pages); a wrapper of its own height keeps it in place here,
                so a long dropdown (e.g. People) scrolls with the page */}
            {(showFilters || allowSearch) && (
                <div className="relative w-full mb-xl">
                <GeneralFilters
                    placeholder="Search"
                    onSelectFilters={onSelectFilters}
                    onSearch={onSearch}
                    searchText={search || ''}
                    isSearch={!!allowSearch}
                    isFilter={showFilters}
                    filters={showFilters ? filterOptions : []}
                />
                </div>
            )}

            {loader ? (
                <div className="relative w-full min-h-[50vh]"><Loading className="absolute!" /></div>
            ) : cards.length === 0 ? (
                <div className="w-full min-h-[30vh] flex flex-col justify-center items-center">
                    <TextLg className="text-dark-gray">No results found</TextLg>
                </div>
            ) : (
                <>
                    <div className="flex flex-row flex-wrap gap-y-xl justify-start items-start content-start self-stretch -mx-sm px-sm md:px-xl">
                        {cards.map((card) => <GridCard {...card} key={card.id} />)}
                    </div>
                    {page < pageCount && (
                        <div className="flex justify-center items-center mt-xl w-full">
                            <Button onClick={onLoadMore} loader={buttonLoader} buttonClassName="gap-x-2xs!" type="filled" backgroundColor="bg-bright-red">
                                Load more<span className="text-md min-h-0 leading-sm">+</span>
                            </Button>
                        </div>
                    )}
                </>
            )}
        </section>
    );
};

export default Grid;
