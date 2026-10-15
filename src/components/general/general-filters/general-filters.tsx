"use client";

import { Text, TextLg, TextMd, TitleSm } from "@/components/helpers/typography";
import { GeneralFiltersProps } from "./general-filters.types";
import { CloseIcon, DropdownIcon, FilterIcon, SearchIcon } from "@/components/helpers/icons";
import { memo, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Button } from "@/components/helpers/buttons";
import { useSearchParams, useRouter } from "next/navigation";



const GeneralFilters: React.FC<GeneralFiltersProps> = (props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [filters, setFilters] = useState<any[]>(() => {
    const raw = props.filters;
    if (!raw?.length) return raw || [];
    return raw.map((filter: any) => {
      const urlValues = searchParams.get(filter.title?.trim())?.split(',').map((s: string) => s.trim()) || [];
      return {
        ...filter,
        items: filter?.items?.map((v: any) => ({
          ...v,
          title: v.title.trim(),
          selected: urlValues.includes(v.title.trim()),
        }))?.sort((a: any, b: any) => a.title.localeCompare(b.title)),
        selected: false,
      };
    });
  });
  const buttonRefs = useRef<Array<any>>([]);
  const [mounted, setMounted] = useState(false);
  const [portalEl, setPortalEl] = useState<HTMLElement | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleClear = () => {
    if (inputRef.current) {
      inputRef.current.value = "";
    }
    props?.onSearch?.("");
  };

  useEffect(() => {
    setMounted(false);

    let el = document.getElementById('filters-portal');
    if (!el) {
      el = document.createElement('div');
      el.id = 'filters-portal';
      document.body.appendChild(el);
    }

    setPortalEl(el);
  }, []);


  useEffect(() => {
    if (!props?.filters?.length) return;
    setFilters(
      props?.filters?.map((filter) => {
        const filterTitle = filter.title?.trim();
        const urlValues = filterTitle
          ? searchParams.get(filterTitle)?.split(',').map((s: string) => s.trim()) || []
          : [];
        return {
          ...filter,
          items: filter?.items?.map((v: any) => ({
            ...v,
            title: v.title.trim(),
            selected: urlValues.includes(v.title.trim()),
          }))?.sort((a: any, b: any) => a.title.localeCompare(b.title)),
          selected: false,
        };
      })
    );
  }, [props.filters]);



  useEffect(() => {
    const onWindowClick = () => {
      setFilters(prev => prev.map(filter => ({ ...filter, selected: false })));
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      const openIndex = filters.findIndex(filter => filter.selected);
      if (openIndex !== -1) {
        setFilters(prev => prev.map(filter => ({ ...filter, selected: false })));
        buttonRefs.current[openIndex]?.focus();
      }
    };
    window.addEventListener('click', onWindowClick);
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('click', onWindowClick);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [filters]);

  const onTrigger = (index: number) => {
    setFilters(filters.map((filter, i) => {
      if (i === index) return { ...filter, selected: !filter.selected };

      return { ...filter, selected: false };
    }))
  }

  // const selectedIndex = filters?.findIndex(filter => filter.selected);

  const getLeft = (index: number) => {
    if (!buttonRefs.current?.length) return 0;
    const left = buttonRefs.current?.[index].getBoundingClientRect().left || 0;
    return left
  }

  const getCols = (items: any[], maxPerCol = 7, maxCols = 3) => {
    // Case 1: small list → single column
    if (items.length <= maxPerCol) {
      return [items];
    }

    // Determine how many columns we actually need (max 3)
    const totalCols = Math.min(
      maxCols,
      Math.ceil(items.length / maxPerCol)
    );

    const cols: any[][] = Array.from({ length: totalCols }, () => []);

    let colIndex = 0;

    items.forEach((item, index) => {
      cols[colIndex]?.push(item);

      // Move to next column after maxPerCol items
      if (cols[colIndex]?.length === maxPerCol) {
        colIndex++;
      }
    });

    return cols;
  };

  const resetUrl = () => {
    if (!props?.searchText) return;
    handleClear();
    const params = new URLSearchParams(searchParams.toString());
    params.delete("search");
    router.replace('?' + params.toString());
  }


  const onItemsTrigger = (index: number, x: string) => {
    const nextFilters = filters.map((filter, i) => {
      if (i === index) {
        const items = filter.items.map((item: any) => {
          if (item.title === x) {
            return { ...item, selected: !item.selected };
          }
          return item;
        })
        return { ...filter, items };
      }
      // return {...filter, selected: false};
      return filter;
    });

    setFilters(nextFilters);
    props?.onSelectFilters?.(nextFilters);
  }




  const mobileTriggerRef = useRef<HTMLButtonElement>(null);
  const mobileCloseRef = useRef<HTMLButtonElement>(null);

  const onTriggerMobileFilter = () => {
    setMounted(true);
    // move focus into the drawer once it is no longer inert
    requestAnimationFrame(() => mobileCloseRef.current?.focus());
  }

  const onClose = () => {
    setMounted(false);
    mobileTriggerRef.current?.focus();
  }


  return (
    <div className={`${props.className || ''} w-full px-sm md:px-xl sticky! top-0 z-999`}>
      <div className="flex flex-row [body.tablet_&]:flex-col-reverse flex-wrap justify-start items-stretch gap-x-sm md:gap-md relative">
        {filters?.length && <div onClick={(e) => e.stopPropagation()} className="hidden flex-1/3 md:min-w-[66%] md:w-[66%] bg-light-gray md:flex flex-row justify-start items-center [body.tablet_&]:flex-1 [body.tablet_&]:min-w-0 [body.tablet_&]:w-full [body.tablet_&]:max-w-full">
          {filters?.length && filters?.map((filter: any, index: number) => {
            const cols = getCols(filter?.items, 7, 3);
            return (
              <div className="" key={index}>
                <button ref={r => {
                  buttonRefs.current[index] = r;
                }} type="button" aria-expanded={!!filter?.selected} aria-controls={`filter-panel-${index}`} onClick={() => onTrigger(index)} className={`ml-md pl-2 py-sm cursor-pointer flex flex-row justify-start items-center relative after:absolute after:bottom-0 after:content-[''] after:block after:w-0 after:left-0 after:h-[.23vw] after:bg-bright-red  hover:after:w-full after:origin-left after:transition-all after:duration-300 ${filter?.selected ? 'after:w-full' : ''}`}>
                  <Text className={`transition-colors font-modern-era-medium! relative ${'text-dark-gray'}`}>{filter.title}</Text>
                  <DropdownIcon fill={"var(--color-dark-gray)"} className={`w-md h-md relative  transition duration-300 rotate-0 ${filter?.selected ? 'rotate-180' : 'rotate-0'} `} />
                </button>

                {<div id={`filter-panel-${index}`} inert={!filter?.selected} className={`${filter?.selected ? 'opacity-100 h-auto transition-opacity' : 'opacity-0 h-0 transition-all'}  overflow-hidden  duration-300  bg-dark-gray  absolute top-full ${cols.length >= 3 ? 'left-0 right-0' : ''}`} key={index}>
                  <div className="py-lg flex flex-row">
                    {cols.map((col: any, i: number) => {
                      return (
                        <div className={`min-w-[25vw] w-[25vw] flex-1 flex flex-col justify-start items-start text-left gap-y-sm px-lg border-r last:border-r-0 border-r-[#464646]`} key={i}>
                          {col.map((item: any, i: number) => {
                            if (item?.title?.trim() === "") return;
                            return (
                              <label key={i} htmlFor={`filter-${index}-${item.title}-desktop`} className={`cursor-pointer flex flex-row gap-x-xs select-none items-center`}>
                                <input onChange={() => onItemsTrigger(index, item.title)} checked={!!item?.selected} id={`filter-${index}-${item.title}-desktop`} type="checkbox" className={`sr-only peer`} />

                                <div className={`min-w-sm w-sm h-sm border border-light-gray ${item?.selected ? 'bg-white' : ''} flex justify-center items-center peer-focus-visible:outline-2 peer-focus-visible:outline-white peer-focus-visible:outline-offset-2`}>
                                  <svg aria-hidden="true" width="11" height="8" viewBox="0 0 11 8" fill="none">
                                    <path d="M0.652344 3.67578L4.15234 6.67578L9.65234 0.675781" stroke="#333333" strokeWidth="2" />
                                  </svg>
                                </div>

                                <Text as="span" className={`text-white transition-colors font-modern-era-medium! relative`}>{item?.title?.trim()}</Text>
                              </label>
                            )
                          })}
                        </div>
                      )
                    })}
                  </div>
                </div>}

              </div>
            )
          })}
        </div>}
        {filters?.length && <div className={`relative flex md:hidden bg-light-gray`}>
          <button ref={mobileTriggerRef} type="button" aria-haspopup="dialog" aria-expanded={mounted} onClick={onTriggerMobileFilter} className="flex flex-row justify-center items-center  p-md cursor-pointer">
            <TextMd className={`transition-colors font-modern-era-medium! relative text-dark-gray/75`}>Filters</TextMd>
            <FilterIcon className={`w-md h-md relative transition ml-sm`} />
          </button>

        </div>}
        <div onClick={e => e.stopPropagation()} className="flex-1 min-w-0 bg-light-gray min-h-0 relative flex flex-row justify-start items-center pr-0 md:max-w-1/2 after:absolute after:left-0 after:bottom-0 after:h-[.2vw] after:w-full
    after:scale-x-0 after:origin-left after:bg-dark-blue
    after:transition-transform after:duration-300
    focus-within:after:scale-x-100 group">
          <input onFocus={resetUrl} defaultValue={props?.searchText} ref={inputRef} onChange={(e) => {
            props?.onSearch?.(e.target.value)
          }} type="search" aria-label={props?.placeholder || "Search by name"} placeholder={props?.placeholder || "Search by name"} className="flex-1 w-full min-w-full max-w-auto h-full pl-md py-sm ring-0 bg-transparent focus:ring-0 text-md font-modern-era-medium text-dark-gray/75 pr-xl" />

          {
            props?.searchText ? (props?.searchText?.length > 0 &&
              <button type="button" aria-label="Clear search" onClick={() => handleClear()} className="absolute right-sm cursor-pointer">
                <CloseIcon
                  fill="var(--color-dark-gray)"
                  className="w-sm h-sm
                      transition-all duration-200
                      opacity-100 scale-100
                      "/>
              </button>) : <>
              <SearchIcon className="absolute right-sm w-sm h-sm
                        transition-all duration-200
                        opacity-100 scale-100
                        group-focus-within:opacity-0
                        group-focus-within:scale-75
                        pointer-events-none"/>

              <CloseIcon
                onClick={() => handleClear()}
                fill="var(--color-dark-gray)"
                className="
                            absolute right-sm w-sm h-sm pointer-events-none group-focus-within:pointer-events-auto
                            transition-all duration-200
                            opacity-0 scale-75
                            group-focus-within:opacity-100
                            group-focus-within:scale-100
                            cursor-pointer
                          "
              />
            </>
          }


        </div>
      </div>

      {(portalEl) && createPortal(
        <div onClick={(e) => e.stopPropagation()} onKeyDown={(e) => { if (e.key === 'Escape') onClose(); }} role="dialog" aria-modal="true" aria-labelledby="filters-dialog-title" inert={!mounted} className={`${mounted ? 'opacity-100 top-0 transition-opacity bg-[#33333380]' : 'top-full opacity-0 transition-all bg-transparent'} duration-500 fixed bottom-0 left-0 right-0  z-100`}>
          <div className={`${mounted ? 'translate-y-0' : 'translate-y-full'} transition-transform delay-150 duration-500 bg-dark-gray absolute top-[14vw] left-0 right-0 bottom-0 flex flex-col justify-start items-start pt-sm`}>
            <div className=" flex flex-row justify-between items-center p-sm py-lg mb-md w-full">
              <TitleSm attributes={{ id: "filters-dialog-title" }} className="text-white font-gt-ultra">Filters</TitleSm>
              <button ref={mobileCloseRef} type="button" aria-label="Close filters" onClick={onClose} className="">
                <CloseIcon className="w-md h-md" />
              </button>
            </div>
            <div className="flex-1 w-full px-sm overflow-y-auto flex flex-col justify-start items-start pb-3xl">
              {
                filters?.length && filters?.map((filter: any, index: number) => {
                  return (
                    <div className="border-t border-t-[#595959] w-full py-sm" key={index}>
                      <button type="button" aria-expanded={!!filter?.selected} onClick={() => onTrigger(index)} className="flex w-full flex-row justify-between items-center">
                        <TextLg className="text-white font-modern-era-medium!">{filter.title}</TextLg>
                        {<DropdownIcon fill="var(--color-white)" className={`w-lg h-lg transition duration-300 rotate-0 ${filter?.selected ? 'rotate-180' : 'rotate-0'}`} />}
                      </button>
                      {filter?.selected && <div className={`p-sm flex flex-col gap-y-sm`}>
                        {filter.items.map((item: any, i: number) => {
                          return (
                            <label key={i} htmlFor={`filter-${index}-${item.title}-mobile`} className={
                              `cursor-pointer flex flex-row items-center justify-start select-none`
                            }>
                              <input onChange={() => onItemsTrigger(index, item.title)} checked={!!item?.selected} id={`filter-${index}-${item.title}-mobile`} type="checkbox" className="sr-only peer" />
                              <div className={`min-w-sm w-sm h-sm border border-light-gray ${item?.selected ? 'bg-white' : ''} flex justify-center items-center mr-sm peer-focus-visible:outline-2 peer-focus-visible:outline-white peer-focus-visible:outline-offset-2`}>
                                <svg aria-hidden="true" width="11" height="8" viewBox="0 0 11 8" fill="none">
                                  <path d="M0.652344 3.67578L4.15234 6.67578L9.65234 0.675781" stroke="#333333" strokeWidth="2" />
                                </svg>
                              </div>
                              <TextMd className="text-white transition-colors font-modern-era-medium! relative">{item.title}</TextMd>
                            </label>
                          )
                        })}
                      </div>}
                    </div>
                  )
                })
              }
            </div>
          </div>

          {mounted && <div className="fixed bottom-0 left-0 right-0 flex flex-row justify-center items-center gap-x-md py-md z-9">
            <Button onClick={onClose} type="filled" backgroundColor="bg-bright-red">
              Apply Filters
            </Button>
          </div>}
        </div>, portalEl)}
    </div>
  )
};

export default memo(GeneralFilters);
