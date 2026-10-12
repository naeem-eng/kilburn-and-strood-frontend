"use client";

import SearchAside from '@/components/general/search-aside';
import SearchHeader from '@/components/general/search-header';
import fetchSearch, { fetchAsideSearch } from '@/requests/search-request';
import { useSearchParams } from 'next/navigation';
import { Fragment, memo, useCallback, useEffect, useMemo, useState } from 'react';
import Loading from '../loading';
import SearchPagination from '@/components/general/search-pagination';
import { TextMd, Text, TitleSm, TextLg, Small } from '@/components/helpers/typography';
import { Button } from '@/components/helpers/buttons';
import Link from 'next/link';
import Image from 'next/image';
import { getStrapiMedia } from '@/utils/utils';

const SearchPage = () => {
    const searchParams = useSearchParams();
    const q = searchParams.get("q") ?? "";
    const [pager, setPager] = useState<any>({
        page: 1,
        pageSize: 10
    });
    const [pagination, setPagination] = useState<any>(null);
    const [asideData, setAsideData] = useState<any>(null);
    const [collections, setCollections] = useState<string | null>(null);

    const [results, setResults] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [called, setCalled] = useState(0);


    useEffect(() => {
        // //console.log( q, pager, collections )
        setLoading(true);
        setCalled((c)=>c+1);
        const callAPI = async () => {
            await fetchAsideSearch({
                q,
                pager,
                collections
            }).then(data => {
                //console.log("fetchAsideSearch" , data);
                setAsideData(data.meta?.totals);
                setCalled((c)=>c-1);
            }).catch(err => {
                console.error("Search error:", err);
            })
        }

        callAPI();

    }, [q]);

    useEffect(() => {
        setLoading(true);
        setCalled((c)=>c+1);
        const callAPI = async () => {
            await fetchSearch({
                q,
                pager,
                collections
            }).then(data => {
                //console.log(data);
                setResults(data?.data);

                const totalAll = Math.max(
                    ...Object.values(data.pagination as Record<string, any>).map(p => p?.total ?? 0)
                );


                setPagination(collections ? data.pagination?.[collections] : {
                    page:      data.meta.page,
                    pageSize:  data.meta.pageSize,
                    total:     totalAll,
                    pageCount: Math.ceil(totalAll / data.meta.pageSize),
                });
                setCalled((c)=>c-1);
            }).catch(err => {
                console.error("Search error:", err);
            })
        }
        callAPI();

    }, [q, pager, collections]);


    useEffect(() => {
        if(called <= 0) {
            setLoading(false);
        }
    }, [called]);


    const parsedResults = useMemo(() => {
        if (!results) return [];
        
        return Object.entries(results).flatMap(([type, items]: [string, any]) => {
            if (!Array.isArray(items)) return [];
            return items.map((item: any) => ({
                type,
                id:    item.id,
                title: type === "peoples" ? item.name : (item.title || item.name),
                headerPhoto: (getStrapiMedia(item.headerPhoto, 'large') || ""),
                role: item.title || "",
                text:  item.text || item.biography || item.introduction || "",
                slug:  `${type === "peoples" ? 'people': type}/${item.slug}`,
            }));
        }).sort((a:any, b:any) => {
            const dateA = new Date(a.createdAt ?? 0).getTime();
            const dateB = new Date(b.createdAt ?? 0).getTime();
            return dateB - dateA; // desc
        });
    }, [results]);

    // //console.log({parsedResults})

    const handleCollectionChange = (page: number) => {
        // setCollections(col);
        setPager((prev: any) => ({ ...prev, page })); // reset page
    };

    const GeneralRow = ({ id, title, text, slug, type }: any) => {
        return (
            <Link href={`/${slug}`} className={`border-t-light-gray border-t-2 pt-lg mb-lg flex flex-col`}>
                <Small className="text-dark-blue capitalize mb-sm">{type}</Small>
                <TextLg className='text-dark-gray'>{title}</TextLg>
                {text && <Text className='text-dark-gray mt-md line-clamp-3'>{text}</Text>}
            </Link>
        )
    };

    const PeopleRow = ({ id, title, text, slug, type, role, headerPhoto  }: any) => {
        //console.log({role, headerPhoto})
        return (
            <Link href={`/${slug}`} className={`border-t-light-gray border-t-2 pt-lg mb-lg flex flex-col`}>
                <div className='flex flex-row justify-start items-center'>
                    {headerPhoto && <div className='min-w-[20%] max-w-[20%] flex-1'>
                        <Image
                            unoptimized={true}
                            src={headerPhoto}
                            alt={title}
                            width={105}
                            height={141}
                            className="w-full h-full object-cover aspect-[35/47]"
                        />
                    </div>}
                    <div className='flex flex-col justify-start items-start ml-lg'>
                        <Small className="text-dark-blue capitalize mb-sm">{type}</Small>
                        <TextLg className='text-dark-gray'>{title}</TextLg>
                        {role && <TextMd className='text-dark-gray mt-sm'>{role}</TextMd>}
                    </div>
                </div>
            </Link>
        )
    };
    const onChangeCollection = (collection: string | null) => {
        setCollections(collection);
        setPager((pager:any)=>({...pager, page: 1}));
        setResults([]);
    }
    

    return (
        <div className="relative z-1 bg-white mt-20 px-sm md:px-xl min-h-screen">
            <SearchHeader q={q} />
            <div className='relative w-full min-h-screen flex flex-col justify-stretch'>
                {loading ? <Loading className="absolute! w-full h-full" /> : <div className="w-full flex flex-col justify-stretch min-h-0 items-start relative ">
                    <div className="flex flex-row justify-between items-start w-full gap-x-12 relative min-h-0">
                        <SearchAside selected={collections} setCollection={onChangeCollection} data={asideData} />

                        {parsedResults?.length ? <div className="flex-1 relative mt-12 min-h-full max-w-[70%] w-[70%] min-w-0">
                            <div className=''>
                                {parsedResults?.map(v=>{
                                    if(["services",  "events", "insights"].includes(v.type)) {
                                        return <GeneralRow {...v} key={v.id} />
                                    }
                                    if(["peoples"].includes(v.type)) {
                                        return <PeopleRow {...v} key={v.id} />
                                    }
                                    return <Fragment key={v.id} />    
                                })}
                            </div>
                            <SearchPagination page={pagination?.page} pageCount={pagination?.pageCount || 1} onChange={handleCollectionChange} />
                        </div> : <div className="flex-1 relative mt-12 min-h-full">
                            <div className="flex flex-col justify-center items-center">
                                <TextLg className="text-dark-gray mb-md md">No results found</TextLg>
                            </div>
                        </div>}
                         
                    </div> 
                </div>}
            </div>
        </div>
    );
};

export default SearchPage;