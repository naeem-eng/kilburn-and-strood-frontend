"use client";

import { Button } from "@/components/helpers/buttons";
import ArticleCard from "../article-card";
import GeneralFilters from "../general-filters";
import { ArticleContainerProps } from "./article-container.types";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import fetchArticles from "@/requests/articles-requests";
import articleListingParser from "@/parsers/article-listing-parser";
import { uniqueObjects } from "@/utils/utils";
import filtersParser from "@/parsers/filters-parser";
import fetchArticleFilters from "@/requests/article-filters-requests";
import { ArticleCardProps } from "../article-card/article-card.types";
import { TextLg } from "@/components/helpers/typography";
import Loading from "@/app/loading";
import { keyMapperReverse } from "@/parsers/filters-parser/filters-parser";
import { useRouter } from "next/navigation";
import { useUrlSearchParams } from "@/utils/use-url-search-params";

const ArticleContainer: React.FC<ArticleContainerProps> = (props) => {

    const router = useRouter();
    const searchParams = useUrlSearchParams();
    const search = searchParams.get("search");

    const [selectedFilters, setSelectedFilters] = useState<any>({});
    const readFiltersFromUrl = (params: URLSearchParams) => {
      const initialFilters: any = { search: params.get("search") || undefined };
      params.forEach((value, key) => {
        const apiKey = keyMapperReverse[key];
        if (apiKey === "article_types") {
          initialFilters[apiKey] = value.split(',').map((item) => item.trim());
        }
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
    const [articles, setArticles] = useState<any>(() => props?.initialData ? articleListingParser(props.initialData.data) : []);
    const [loader, setLoader] = useState<Boolean>(!props?.initialData);
    const [articleLoader, setArticleLoader] = useState<Boolean>(false);
    const [buttonLoader, setButtonLoader] = useState<Boolean>(false);
    const [filterLoader, setFilterLoader] = useState<Boolean>(true);


    const getArticles = useCallback(async () => {
        // Cancel previous request
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
        
        // Create new controller for this request
        abortControllerRef.current = new AbortController();
        try {

          // read before awaiting: the effect clears isFirstFetchRef right after this call starts

          const replaceList = isFilters || isFirstFetchRef.current;

          const resp = await fetchArticles({
            filters,
            pager,
          }, abortControllerRef.current.signal);

          // // //console.log({resp})

          setPagination(resp.pagination);
          const articles = articleListingParser(resp?.data);

          // // //console.log({isFilters, articles})
          // the server-rendered first page is replaced, not merged, when URL filters are applied on load
          if (replaceList) {
            setArticles(articles);
          } else {
            setArticles((prev: any) => uniqueObjects(prev, articles));
          }

          setLoader(false);
          setButtonLoader(false);
          setArticleLoader(false);

        } catch (error: any) {
          if (error?.name === "AbortError") return; // ignore cancelled requests
          setLoader(false);
          setButtonLoader(false);
          setArticleLoader(false);
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
      setArticleLoader(true);
      setIsFilters(true);
      setFilters(fromUrl);
    }, [searchParams]);

    const getFilters = async () => {
        setFilterLoader(true)
        const resp = await fetchArticleFilters(null);
        const todos = filtersParser(resp);
        setList(todos); 
        setFilterLoader(false)
    }

    useEffect(() => {
        if (isFirstFetchRef.current && props?.initialData) {
          const hasUrlFilters = Object.values(filters).some((value: any) => Array.isArray(value) ? value.length : Boolean(value));
          if (!hasUrlFilters) { isFirstFetchRef.current = false; return; }
        }
        getArticles();
        isFirstFetchRef.current = false;
      }, [pager, filters, isFilters]);
    
    useEffect(() => {
      getFilters();
    }, []);

    const onSearch = (search: string|undefined) => {
        setArticleLoader(true)
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
          setArticleLoader(true)
          setIsFilters(true)
          setPager({page: 1, pageSize: 20});
          setFilters({search: search || filters?.search || undefined,  ...createFilter});
        }
      }

      
      const Articles = useMemo(() => {
        const hasMore = pagination ? pager.page < pagination?.pageCount : false;
        // // //console.log({articles})
        if(articles?.length === 0) {
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
              <div className={`flex flex-row flex-wrap gap-x-0 gap-y-xl bg-white justify-start items-start pb-lg content-start -mx-sm px-sm md:px-xl min-h-screen`}>
                  {articles.map((article:ArticleCardProps, index:number) => (
                    <ArticleCard {...article} key={index} />
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
      },[buttonLoader, isFilters, articles])
      
    return (
      <div className={`${props.className || ''} w-full flex flex-col justify-start items-start overflow-x-hidden`}>
        {
          loader ? <div className="relative w-full min-h-[50vh]"><Loading className="absolute!" /></div> : <>
            {/* the list doesn't wait for the filter options, so server-rendered cards show straight away */}
            {filterLoader ? null : <GeneralFilters placeholder="Search insights" onSelectFilters={onSelectFilters} onSearch={onSearch} searchText={search || ''} isSearch isFilter className='mb-xl' filters={list} />}
  
          {articleLoader ? <div className="relative w-full min-h-[50vh]"><Loading className="absolute!" /></div> : <>
            {Articles}
          </>}
          </>
        }
        
      </div>
    );
};

export default ArticleContainer;
