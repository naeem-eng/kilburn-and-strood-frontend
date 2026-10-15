"use client";

import { Small, TextLg, TextMd, TitleMd, TitleSm } from "@/components/helpers/typography";
import { ContentCarousalProps } from "./content-carousal.types";
import Image from "next/image";
import { LeftArrowIcon, RightArrowIcon } from "@/components/helpers/icons";
import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";

const ContentCarousal: React.FC<ContentCarousalProps> = (props) => {

  const colsRefs = useRef<Array<HTMLDivElement>>([]);
  const contentCarousalRef = useRef<HTMLDivElement>(null);
  const [colsNumber, setColsNumber] = useState(props?.items?.length > 3 ? 4 : 3);
  const [selectedIndex, setSelectedIndex] = useState(0);

  // //console.log({colsNumber})



  const isDragging = useRef(false);
  const startX = useRef(0);
  const dragOffset = useRef(0);


  useEffect(() => {
    const runResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        setColsNumber(1);
      } else if (width < 768) {
        setColsNumber(3);
      } else {
        setColsNumber(props?.items?.length > 3 ? 4 : 3);
      }
    }

    window.addEventListener('resize', runResize);

    // Initial run
    runResize();

    return () => {
      window.removeEventListener('resize', runResize);
    };

  }, []);


  const getTranslateForIndex = (index: number) => {
    const getWidthForIndex = (i: number) => {
      if (colsNumber === 3) return i % 4 === 0 ? 46 : 33;
      if (colsNumber === 1) return 90;
      return i % 4 === 0 ? 36 : 23;
    };

    let translate = 0;
    for (let i = 0; i < index; i++) {
      translate += getWidthForIndex(i);
    }
    return translate;
  };


  useEffect(() => {
    if (!contentCarousalRef.current || isDragging.current) return;

    const translate = getTranslateForIndex(selectedIndex);

    contentCarousalRef.current.style.transition = "transform 500ms ease-in-out";
    contentCarousalRef.current.style.transform = `translateX(-${translate}vw)`;
  }, [selectedIndex, colsNumber]);





  const getParsedItems = useMemo(() => {
    let cols: Array<Array<ContentCarousalProps['items'][0]>> = []
    let index = 0
    let takeTwo = false; // false = take 1 item, true = take 2 items

    props?.items?.forEach((item, i) => {
      // create bucket if not exists
      if (!cols[index]) cols[index] = [];

      // push item
      cols[index].push(item);

      // if this row should take 1 item → move to next index
      if (props?.items?.length > 3) {
        if (!takeTwo) {
          index++;
        }
        // if this row should take 2 items → wait for one more
        else {
          if (cols[index].length === 2) {
            index++;
          }
        }

        // toggle 1 → 2 → 1 → 2 pattern
        if (cols[index - 1]?.length === (takeTwo ? 2 : 1)) {
          takeTwo = !takeTwo;
        }
      } else {
        index++;
      }

    });

    const temp = cols?.map((v: any) => {
      return v.map((item: any, i: number) => ({
        ...item,
        isMedia: !(v.length > 1)
      }));
    });
    // // //console.log({temp})
    return temp;
  }, [props?.items])


  const onLeftAnimate = () => {
    if (selectedIndex === 0) return;
    setSelectedIndex(selectedIndex - 1);
  }

  const onRightAnimate = () => {
    if (selectedIndex === getParsedItems.length - colsNumber + 1) return;
    setSelectedIndex(selectedIndex + 1);
  }



  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!contentCarousalRef.current) return;

    isDragging.current = true;
    startX.current = e.clientX;
    dragOffset.current = 0;

    contentCarousalRef.current.style.transition = "none";
    contentCarousalRef.current.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current || !contentCarousalRef.current) return;

    dragOffset.current = e.clientX - startX.current;

    const vwOffset =
      (dragOffset.current / window.innerWidth) * 100;

    const baseTranslate = getTranslateForIndex(selectedIndex);

    contentCarousalRef.current.style.transform = `translateX(-${baseTranslate - vwOffset}vw)`;
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!isDragging.current || !contentCarousalRef.current) return;

    isDragging.current = false;

    const deltaX = dragOffset.current;

    // snap threshold
    if (deltaX < -60 && selectedIndex < getParsedItems.length - colsNumber + 1) {
      setSelectedIndex((i) => i + 1);
    } else if (deltaX > 60 && selectedIndex > 0) {
      setSelectedIndex((i) => i - 1);
    } else {
      // snap back
      const translate = getTranslateForIndex(selectedIndex);
      contentCarousalRef.current.style.transition = "transform 300ms ease-out";
      contentCarousalRef.current.style.transform = `translateX(-${translate}vw)`;
    }

    contentCarousalRef.current.releasePointerCapture(e.pointerId);
  };

  // // //console.log(getParsedItems?.length)

  return (
    <section aria-roledescription="carousel" aria-label={props?.title || "Related content"} className={`w-full relative flex flex-col py-2xl justify-center items-start bg-white flex-1 overflow-hidden `}>

      <div className="px-sm md:px-xl mb-xl">
        <TitleSm>
          {props?.title}
        </TitleSm>
      </div>

      <div className="overflow-hidden w-full relative">

        <div ref={contentCarousalRef}
          className="carousel-drag flex flex-row gap-x-0 md:px-lg px-xs w-fit transition-transform duration-500 ease-in-out cursor-grab active:cursor-grabbing"
        // onPointerDown={onPointerDown}
        // onPointerMove={onPointerMove}
        // onPointerUp={onPointerUp} 
        // onPointerLeave={onPointerUp}

        >
          {getParsedItems.map((col, index, arr) => {
            let colsDivider = props?.items?.length < 4 ? "[body.tablet_&]:min-w-[46vw] [body.tablet_&]:w-[46vw] [body.tablet_&]:max-w-[46vw] md:min-w-[36vw] md:w-[36vw] md:max-w-[36vw] sm:min-w-[46vw] sm:w-[46vw] sm:max-w-[46vw]" : ((index) % 4 === 0 ? "[body.tablet_&]:min-w-[46vw] [body.tablet_&]:w-[46vw] [body.tablet_&]:max-w-[46vw] md:min-w-[36vw] md:w-[36vw] md:max-w-[36vw] sm:min-w-[46vw] sm:w-[46vw] sm:max-w-[46vw]" : "[body.tablet_&]:min-w-[33vw] [body.tablet_&]:w-[33vw] [body.tablet_&]:max-w-[33vw] md:min-w-[23vw] md:w-[23vw] md:max-w-[23vw] sm:min-w-[33vw] sm:w-[33vw] sm:max-w-[33vw]")

            // // //console.log(colsDivider, arr?.length)
            if (!col?.length) return <></>
            return (
              <div ref={(r: HTMLDivElement) => {
                colsRefs.current.push(r)
              }} key={index} className={`${colsDivider} w-[90vw] min-w-[90vw] max-w-[90vw] px-xs flex flex-col gap-y-2sm flex-1 justify-start items-stretch`}>
                {
                  col.map((item: ContentCarousalProps['items'][0], i: number) => {
                    
                    const showImage = item?.isMedia;

                    return (
                      <Link href={`${item?.url || '#'}`} key={i} onFocus={() => setSelectedIndex(Math.max(0, Math.min(index, getParsedItems.length - colsNumber + 1)))} className="w-full group bg-light-gray flex-1 h-auto flex flex-col text-left">
                        {
                          item?.mediaType === 'image' && item?.mediaSrc && showImage && (
                            <div className="overflow-hidden h-[40%] md:h-[46%] xl:h-[56%]">
                              <Image draggable={false}
                                unoptimized={true} src={item?.mediaSrc} alt={item?.mediaAlt || ''} width={731} height={337} className="w-full group-hover:scale-120 transition-all duration-600 ease-in-out h-full object-cover" />
                            </div>
                          )
                        }
                        {
                          item?.mediaType === 'video' && item?.mediaSrc && showImage && (
                            <div className="">
                              <video autoPlay loop muted playsInline aria-hidden="true" draggable={false} src={item?.mediaSrc} width={731} height={337} className="w-full  object-cover" />
                            </div>
                          )
                        }

                        <div className="p-md flex flex-col gap-y-sm flex-1 min-h-0 group-hover:bg-dark-gray transition-colors duration-600 ease-in-out">
                          <Small className="text-dark-gray/75 group-hover:text-white transition-colors duration-600 ease-in-out">{item?.itemType}</Small>

                          <TextMd fontClassName={'font-gt-ultra! text-md! leading-md!'} className="transition-colors duration-600 ease-in-out text-dark-gray line-clamp-4 mb-sm  group-hover:text-white ">{item?.title}</TextMd>

                          <Small className="transition-colors duration-600 ease-in-out text-dark-gray/75 mt-auto  group-hover:text-white">{item?.date}</Small>
                        </div>
                      </Link>
                    )
                  })
                }
              </div>
            )
          })}
        </div>
        {/* arrows */}
        <div className="h-auto py-md sm:h-0 w-ful flex flex-row justify-end items-center gap-x-sm sm:px-0 px-md sm:mt-0 mt-md">
          {<button type="button" aria-label="Previous items" disabled={selectedIndex > 0 ? false : true} onClick={onLeftAnimate} className="sm:absolute top-1/2 transform sm:-translate-y-1/2 left-0 sm:w-[4vw] sm:h-[4vw] sm:bg-bright-red flex justify-center items-center cursor-pointer disabled:md:opacity-0 disabled:opacity-50">
            <LeftArrowIcon className="h-xl w-xl sm:h-md sm:w-md sm:fill-white fill-dark-gray" fill="inherit" />
          </button>}
          {/* {// //console.log(selectedIndex,cols.length,colsNumber)} */}
          {<button type="button" aria-label="Next items" disabled={selectedIndex <= getParsedItems.length - (colsNumber == 1 ? 2 : colsNumber) ? false : true} onClick={onRightAnimate} className="sm:absolute top-1/2 transform sm:-translate-y-1/2 right-0 sm:w-[4vw] sm:h-[4vw] sm:bg-bright-red flex justify-center items-center cursor-pointer disabled:md:opacity-0 disabled:opacity-50">
            <RightArrowIcon className="h-xl w-xl sm:h-md sm:w-md sm:fill-white fill-dark-gray" fill="inherit" />
          </button>}
        </div>
        {/* arrows */}
      </div>

    </section>
  );
};

export default ContentCarousal;
