"use client";

import { TextLg, TitleMd, TitleSm } from "@/components/helpers/typography";
import GeneralFilters from "../general-filters";
import { EventContainerProps } from "./event-container.types";
import EventFullCards from "../event-full-cards";
import { Button } from "@/components/helpers/buttons";
import ArticleCard from "../article-card";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import fetchEvents from "@/requests/events-requests";
import { uniqueObjects } from "@/utils/utils";
import { useRouter } from "next/navigation";
import { useUrlSearchParams } from "@/utils/use-url-search-params";
import filtersParser from "@/parsers/filters-parser";
import fetchEventFilters from "@/requests/events-filters-requests";
import { keyMapperReverse } from "@/parsers/filters-parser/filters-parser";
import eventListingParser from "@/parsers/event-listing-parser";
import { EventFullCardsProps } from "../event-full-cards/event-full-cards.types";
import { ArticleCardProps } from "../article-card/article-card.types";
import Loading from "@/app/loading";

const EventContainer: React.FC<EventContainerProps> = (props) => {
    const router = useRouter();
    const searchParams = useUrlSearchParams();
    const search = searchParams.get("search");

    const [selectedFilters, setSelectedFilters] = useState<any>({});
    const readFiltersFromUrl = (params: URLSearchParams) => {
      const initialFilters: any = { search: params.get("search") || undefined };
      params.forEach((value, key) => {
        const apiKey = keyMapperReverse[key];
        if (["services", "sectors", "event_types"].includes(apiKey)) {
          initialFilters[apiKey] = value.split(',').map((item) => item.trim());
        }
      });
      return initialFilters;
    };
    const [filters, setFilters] = useState<any>(() => readFiltersFromUrl(searchParams));
    
    const [list, setList] = useState<any>({});
    const [pager, setPager] = useState<any>({
      page: 1,
      pageSize: 5 
    });

    const [pagination, setPagination] = useState<any>(props?.initialData ? props.initialData.past?.pagination : null);
    const [isFilters, setIsFilters] = useState<boolean>(false);
    
    const abortControllerRef = useRef<AbortController | null>(null);
    const isFirstFetchRef = useRef(true);
    // first page comes from the server (props.initialData) so it is in the static HTML
    const [events, setEvents] = useState<any>(() => props?.initialData ? (eventListingParser(props.initialData) || []) : []);
    const [loader, setLoader] = useState<Boolean>(!props?.initialData);
    const [eventLoader, setEventLoader] = useState<Boolean>(false);
    const [buttonLoader, setButtonLoader] = useState<Boolean>(false);
    const [filterLoader, setFilterLoader] = useState<Boolean>(true);


    const getEvents = useCallback(async () => {
        // Cancel previous request
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
        
        // Create new controller for this request
        abortControllerRef.current = new AbortController();
        try {

          // read before awaiting: the effect clears isFirstFetchRef right after this call starts

          const replaceList = isFilters || isFirstFetchRef.current;

          const resp = await fetchEvents({
            filters,
            pager,
          }, abortControllerRef.current.signal);


          setPagination(resp.past.pagination);
          const events =  (eventListingParser(resp) || []) as [];


          // the server-rendered first page is replaced, not merged, when URL filters are applied on load


          if (replaceList) {
            setEvents(events);
          } else {
            setEvents((prev: any) => uniqueObjects(prev, events));
          }

          setLoader(false);
          setButtonLoader(false);
          setEventLoader(false);

        } catch (error: any) {
          if (error?.name === "AbortError") return; // ignore cancelled requests
          setLoader(false);
          setButtonLoader(false);
          setEventLoader(false);
        }

    }, [filters, pager, isFilters]);


    const handleLoadMore = () => {
      setIsFilters(false)
      const nextPage = pager.page + 1;
      setPager({page: nextPage, pageSize: pager.pageSize});
      // //console.log("load more", isFilters)
    };
    
    // shared links (e.g. ?Role=Partner): apply the URL filters once the real query string is known
    useEffect(() => {
      if (!searchParams.toString()) return;
      const fromUrl = readFiltersFromUrl(searchParams);
      const hasFilters = Object.values(fromUrl).some((value: any) => Array.isArray(value) ? value.length : Boolean(value));
      if (!hasFilters) return;
      setEventLoader(true);
      setIsFilters(true);
      setFilters(fromUrl);
    }, [searchParams]);

    const getFilters = async () => {
        setFilterLoader(true)
        const resp = await fetchEventFilters(null);
        const todos = filtersParser(resp);
        setList(todos); 
        setFilterLoader(false)
    }

    useEffect(() => {
        // // //console.log("useEffect", isFilters)
        if (isFirstFetchRef.current && props?.initialData) {
          const hasUrlFilters = Object.values(filters).some((value: any) => Array.isArray(value) ? value.length : Boolean(value));
          if (!hasUrlFilters) { isFirstFetchRef.current = false; return; }
        }
        getEvents();
        isFirstFetchRef.current = false;
      }, [pager, filters, isFilters]);
    
    useEffect(() => {
      getFilters();
    }, []);

    


    const onSearch = (search: string|undefined) => {
        setEventLoader(true)
        setIsFilters(true)
        const params = new URLSearchParams(window.location.search);
        if (search) {
          params.set('search', search);
        } else {
          params.delete('search');
        }
        router.replace('?' + params.toString(), { scroll: false });
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
          router.replace(newUrl, { scroll: false });
        }

        if(JSON.stringify({search: search || filters?.search || undefined, ...createFilter}) !== JSON.stringify(filters)) {
          setEventLoader(true)
          setIsFilters(true)
          setPager({page: 1, pageSize: 20});
          setFilters({search: search || filters?.search || undefined,  ...createFilter});
        }
      }

    const getUpcomingEvents = useMemo(()=>{
      return events.filter((event:any)=>event?.isUpcoming);
    },[events])

    const getPastEvents = useMemo(()=>{
      return events.filter((event:any)=>!event?.isUpcoming);
    },[events])

    const UpcomingEventList = useCallback(()=>{
      if(!getUpcomingEvents?.length) return;
      return (
        <>
            <TitleSm as="h2" className="text-dark-gray mb-lg">
              {"Upcoming Events"} 
            </TitleSm>
            <div className={`w-full flex gap-y-xl flex-col`}>
                {getUpcomingEvents?.map((event:EventFullCardsProps, index:number) => (
                  <EventFullCards {...event} key={index} />
                ))}
            </div>
          
        </>
      )
    },[getUpcomingEvents])


    const EventList = useCallback(()=>{ 
      const hasMore = pagination ? pager.page < pagination?.pageCount : false;

     
      return (
          <>
          <TitleSm as="h2" className="text-dark-gray mb-lg">
            Past Events
          </TitleSm>
          {
            getPastEvents?.length === 0 ? <div className="w-full text-center mb-10">
                <TextLg className="text-dark-gray">
                    No results found
                </TextLg>
            </div> : <>
              <div className={`flex flex-row flex-wrap gap-x-0 gap-y-xl bg-white justify-start items-start pb-lg content-start -mx-sm`}>
                  {getPastEvents?.map((event:ArticleCardProps, index:number) => (
                    <ArticleCard as="event" {...event} key={index} />
                  ))}
              </div>
              {hasMore && <div className="flex justify-center items-center my-lg w-full">
                  <Button onClick={()=>{
                      setButtonLoader(true);
                      handleLoadMore();
                  }} loader={Boolean(buttonLoader)} buttonClassName="gap-x-2xs!" type="filled" backgroundColor="bg-bright-red">
                    Load More<span className="text-md min-h-0 leading-sm ">+</span>
                  </Button>
                </div>}
            </>
          }
          
          </>
      )
    }, [buttonLoader, isFilters, getPastEvents])

    return (
      <div className={`${props.className || ''} w-full flex flex-col justify-start items-start overflow-x-hidden  min-h-screen`}>
        
          {
                    loader ? <div className="relative w-full min-h-[50vh]"><Loading className="absolute!" /></div> : <>
                      {/* the list doesn't wait for the filter options, so server-rendered cards show straight away */}
            {filterLoader ? null : <GeneralFilters placeholder="Search events" onSelectFilters={onSelectFilters} onSearch={onSearch} searchText={search || ''} isSearch isFilter className='mb-xl' filters={list} />}
            
                    {eventLoader? <div className="relative w-full min-h-[50vh]"><Loading className="absolute!" /></div> : <>
                      <div className="mt-0 px-sm md:px-xl flex-1 w-full  ">
                          <UpcomingEventList />
                      </div>


                      <div className="mt-3xl px-sm md:px-xl flex-1 w-full  ">
                          <EventList />
                      </div>
                    </>}
                    </>
                  }

          

      </div>
    );
};

export default EventContainer;
