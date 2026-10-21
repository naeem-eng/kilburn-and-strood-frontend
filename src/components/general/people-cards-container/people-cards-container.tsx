
"use client";
import { TextLg, TextMd, TitleMd, TitleSm } from "@/components/helpers/typography";
import GeneralFilters from "../general-filters";
import PeopleCard from "../people-card/people-card";
import { PeopleCardsContainerProps } from "./people-cards-container.types";
import fetchPeopleFilters from "@/requests/people-filters-requests";
import { memo, useCallback, useEffect, useMemo, useRef, useState } from "react";
import fetchPeoples from "@/requests/people-requests"; 
import TabbedBodyContent from "../tabbed-body-content";
import { PeopleCardProps } from "../people-card/people-card.types";
import { Button } from "@/components/helpers/buttons";
import Loading from "@/app/loading";
import filtersParser from "@/parsers/filters-parser";
import peopleListingParser from "@/parsers/people-listing-parser";
import { keyMapperReverse } from "@/parsers/filters-parser/filters-parser";
import { uniqueObjects } from "@/utils/utils";
import { useUrlSearchParams } from "@/utils/use-url-search-params";

const PEOPLE_FILTER_KEYS = new Set(["roles", "expertises", "sectors", "services", "offices"]);

const PeopleCardsContainer: React.FC<PeopleCardsContainerProps> = (props) => {
  const searchParams = useUrlSearchParams();
  const search = searchParams.get("search");
  const readFiltersFromUrl = (params: URLSearchParams) => {
    const initialFilters: any = { search: params.get("search") || undefined };
    params.forEach((value, key) => {
      if (key === "search") return;
      const apiKey = keyMapperReverse[key];
      if (!apiKey || !PEOPLE_FILTER_KEYS.has(apiKey)) return;
      initialFilters[apiKey] = value.split(',').map((item) => item.trim());
    });
    return initialFilters;
  };
  const [filters, setFilters] = useState<any>(() => readFiltersFromUrl(searchParams));

  const [list, setList] = useState<any>({});
  const [pager, setPager] = useState<any>({
    page: 1,
    pageSize: 20
  });
  const [pagination, setPagination] = useState<any>(props?.initialData ? props.initialData.pagination : null);
  const [isFilters, setIsFilters] = useState<boolean>(false);

  const abortControllerRef = useRef<AbortController | null>(null);
    const isFirstFetchRef = useRef(true);

  // first page comes from the server (props.initialData) so it is in the static HTML
    const [peoples, setPeoples] = useState<any>(() => props?.initialData ? peopleListingParser(props.initialData.data) : []);
  const [loader, setLoader] = useState<Boolean>(!props?.initialData);
  const [peopleLoader, setPeopleLoader] = useState<Boolean>(false);
  const [buttonLoader, setButtonLoader] = useState<Boolean>(false);
  const [filterLoader, setFilterLoader] = useState<Boolean>(true);


  const getPeoples = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();
    try {

      // read before awaiting: the effect clears isFirstFetchRef right after this call starts

      const replaceList = isFilters || isFirstFetchRef.current;

      const resp = await fetchPeoples({
        filters,
        pager,
      }, abortControllerRef.current.signal);

      setPagination(resp.pagination);
      const peoples = peopleListingParser(resp?.data);

      // // //console.log({isFilters})
      // the server-rendered first page is replaced, not merged, when URL filters are applied on load
      if (replaceList) {
        setPeoples(peoples);
      } else {
        setPeoples((prev: any) => uniqueObjects(prev, peoples));
      }

      setLoader(false);
      setButtonLoader(false);
      setPeopleLoader(false);

    } catch (error: any) {
      if (error?.name === "AbortError") return; // ignore cancelled requests
      setLoader(false);
      setButtonLoader(false);
      setPeopleLoader(false);
    }

  }, [filters, pager, isFilters]);


  const handleLoadMore = () => {
    setIsFilters(false)
    const nextPage = pager.page + 1;
    setPager({page: nextPage, pageSize: pager.pageSize});
    // // //console.log("load more", isFilters)
  };


  // shared links (e.g. ?Role=Partner): apply the URL filters once the real query string is known
  useEffect(() => {
    if (!searchParams.toString()) return;
    const fromUrl = readFiltersFromUrl(searchParams);
    const hasFilters = Object.values(fromUrl).some((value: any) => Array.isArray(value) ? value.length : Boolean(value));
    if (!hasFilters) return;
    setPeopleLoader(true);
    setIsFilters(true);
    setFilters(fromUrl);
  }, [searchParams]);

  const getFilters = async () => {
    setFilterLoader(true)
    const resp = await fetchPeopleFilters(null);
    const todos = filtersParser(resp);
    setList(todos); 
    setFilterLoader(false)
  }

  useEffect(() => {
    if (isFirstFetchRef.current && props?.initialData) {
      const hasUrlFilters = Object.values(filters).some((value: any) => Array.isArray(value) ? value.length : Boolean(value));
      if (!hasUrlFilters) { isFirstFetchRef.current = false; return; }
    }
    getPeoples();
    isFirstFetchRef.current = false;
  }, [pager, filters, isFilters]);

  useEffect(() => {
    getFilters();
  }, []);

  
  const onSearch = (search: string|undefined) => {
    setPeopleLoader(true)
    setIsFilters(true)
    const params = new URLSearchParams(window.location.search);
    if (search) {
      params.set('search', search);
    } else {
      params.delete('search');
    }
    window.history.replaceState(window.history.state, '', '?' + params.toString());
    setTimeout(()=>{
      setPager({page: 1, pageSize: 20});
      setFilters({
        ...filters,
        search: search || undefined
      })
    }, 300)
  }


  const onSelectFilters = (filtersTodos: any) => {
    const createFilter = {} as any;
    const params = new URLSearchParams();
    const currentSearch = new URLSearchParams(window.location.search).get('search');
    if (currentSearch) params.set('search', currentSearch);

    Object.keys(filtersTodos).map((key: string) => {
      const values = filtersTodos[key];
      const check = values?.items?.filter((v:any)=>v?.selected);
      if(check?.length) {
        createFilter[keyMapperReverse?.[values?.title?.trim()] || values?.title?.trim()] = check?.map((v:any)=>v?.title);
        params.set(values?.title?.trim(), check?.map((v:any)=>v?.title).join(','));
      }
    })

    const newUrl = '?' + params.toString();
    const currentUrl = window.location.search || '?';
    if (newUrl !== currentUrl) {
      window.history.replaceState(window.history.state, '', newUrl);
    }

    if(JSON.stringify({search: search || filters?.search || undefined, ...createFilter}) !== JSON.stringify(filters)) {
      setPeopleLoader(true)
      setIsFilters(true)
      setPager({page: 1, pageSize: 20});
      setFilters({search: search || filters?.search || undefined, ...createFilter});
    }
  }

  const Partners = useMemo(() => {
    const hasMore = pagination ? pager.page < pagination?.pageCount : false;

    if(peoples?.length === 0) {
      return(
          <div className="w-full h-screen flex flex-col justify-center items-center">
              <TextLg className="text-dark-gray">
                  No results found
              </TextLg>
          </div>
      )
    }
    return (
      <>
        {props?.title && <TitleSm className="text-dark-gray mb-lg px-sm md:px-xl">
          {props?.title}
        </TitleSm>}
        <div className={`px-sm md:px-xl flex flex-row flex-wrap gap-y-md bg-white justify-start items-start pb-lg content-start -mx-xs min-w-full`}>
          {peoples.map((person: PeopleCardProps, index: number) => (
            <PeopleCard {...person} key={index} />
          ))}
        </div>
        {hasMore && <div className="flex justify-center items-center my-lg w-full">
          <Button onClick={()=>{
              setButtonLoader(true);
              handleLoadMore();
          }} loader={Boolean(buttonLoader)} buttonClassName="gap-x-2xs!" type="filled" backgroundColor="bg-bright-red">
            Load More<span className="text-md min-h-0 leading-sm">+</span>
          </Button>
        </div>}
      </>
    )
  }, [peoples, buttonLoader, isFilters])

  

  // fetching for filters
  return (
    <div className={`${props.className || ''} bg-white w-full flex flex-col justify-start items-start overflow-x-hidden min-h-screen relative`}>
      {
        loader ? <div className="relative w-full min-h-[50vh]"><Loading className="absolute!" /></div> : <>
          {/* the list doesn't wait for the filter options, so server-rendered cards show straight away */}
          {props?.isFilters && !filterLoader && <GeneralFilters placeholder={"Search by name"} searchText={search || ''} onSelectFilters={onSelectFilters} onSearch={onSearch} isSearch isFilter className='mb-xl' filters={list} />}

        {peopleLoader ? <div className="relative w-full min-h-[50vh]"><Loading className="absolute!" /></div> : <>
          {Partners}
        </>}
        </>
      }
     
    </div>
  );
};

export default memo(PeopleCardsContainer);
