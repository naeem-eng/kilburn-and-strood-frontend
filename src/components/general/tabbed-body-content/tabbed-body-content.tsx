"use client";
import { handleTabKeyDown } from "@/utils/a11y";

import { TabbedBodyContentProps } from "./tabbed-body-content.types";
import { useRef, MouseEvent, useState, useEffect, useMemo, memo } from "react";
import { Text, TextLg, TextMd, TitleLg, TitleMd } from "@/components/helpers/typography";
import { colorParser, textSafeColor, textColorParser } from "@/parsers";
import BodyMarkdown from "@/components/helpers/body-markdown/BodyMarkdown";
import Body from "../body";
import LocationDetails from "../location-details";

const TabbedBodyContent: React.FC<TabbedBodyContentProps> = (props) => {

    const [selectedTab, setSelectedTab] = useState(0);
    const tabRef = useRef<HTMLElement[]>([]);
    const bottomBorderContainerRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if(!bottomBorderContainerRef.current || !tabRef.current) return;
        const target = tabRef.current[selectedTab] as HTMLElement;

        const styles = getComputedStyle(target as HTMLElement);
        bottomBorderContainerRef.current.style.left = ((target?.offsetLeft+(parseFloat(styles.paddingLeft))) + 'px');
        bottomBorderContainerRef.current.style.width = (target?.clientWidth-parseFloat(styles.paddingLeft)-parseFloat(styles.paddingRight))+'px';

    }, [selectedTab]);

    const onMouseOver = (e: MouseEvent<HTMLElement, MouseEvent>, index: number) => {
        const target = e.target as HTMLElement;
        if(!bottomBorderContainerRef.current) return;
        

        const styles = getComputedStyle(target as HTMLElement);
        bottomBorderContainerRef.current.style.left = ((target?.offsetLeft+(parseFloat(styles.paddingLeft))) + 'px');
        bottomBorderContainerRef.current.style.width = (target?.clientWidth-parseFloat(styles.paddingLeft)-parseFloat(styles.paddingRight))+'px';
    }

    const onMouseOut = (e: MouseEvent<HTMLElement, MouseEvent>, index: number) => {
        if(!bottomBorderContainerRef.current || !tabRef.current) return;
        const target = tabRef.current[selectedTab] as HTMLDivElement;
        

        const styles = getComputedStyle(target as HTMLElement);
        bottomBorderContainerRef.current.style.left = ((target?.offsetLeft+(parseFloat(styles.paddingLeft))) + 'px');
        bottomBorderContainerRef.current.style.width = (target?.clientWidth-parseFloat(styles.paddingLeft)-parseFloat(styles.paddingRight))+'px';
    }

    if(props?.tabsType === 'vertical' && props?.tabs) {
        return (
            <div className={`${props?.className  || ''} pt-(--padding-top)  w-full flex flex-col md:flex-col bg-white py-xl px-sm md:px-xl `} >
                {
                    props?.title && <BodyMarkdown components={{
                        p: ({children})=><TitleLg className={props?.index == 0 ? "pt-12 mb-4" : "mb-4"}>{children}</TitleLg>
                    }}>
                        {props?.title}
                    </BodyMarkdown>
                }
                <div className={`flex flex-col md:flex-row ${props?.title ? "mt-xl" : "mt-0"}`}>   
                    {/* tabs */}
                    {props?.tabs.length > 0 && <div className={`${props?.tabsClassName  || ''} scroll-container overflow-x-auto flex flex-row md:flex-col justify-start items-start md:min-w-[30%] md:w-[30%] md:max-w-[30%] relative`}>
                        <div role="tablist" className={` flex flex-row md:flex-col justify-start items-start w-full md:mb-0 mb-lg`}>
                            {props.tabs.map((tab, index, arr) => {
                            return (
                                <button ref={r=>{
                                    tabRef.current[index] = r as any
                                }} 
                                key={index}
                                onMouseEnter={e=>onMouseOver(e as any,index)} 
                                onMouseLeave={(e)=>onMouseOut(e as any, index)} 
                                type="button"
                                role="tab"
                                aria-selected={selectedTab == index}
                                tabIndex={selectedTab == index ? 0 : -1}
                                onKeyDown={(e) => handleTabKeyDown(e, index, arr.length, setSelectedTab)}
                                onClick={()=>setSelectedTab(index)} 
                                className={`
                                    text-center
                                    cursor-pointer
                                    md:border-r-[0]
                                    md:border-l-[.2vw]
                                    md:pl-md
                                    first:md:pl-md
                                    md:mb-md
                                    md:pr-0
                                    ${props?.singleTabClassName || ''}
                                    px-md
                                    first:pl-0
                                    last:md:mb-0
                                    border-r-[.2vw]
                                    border-r-dark-gray
                                    last:border-r-0
                                    ${selectedTab == index ? `md:border-l-[var(--dynamic-colors)]
                                    text-[var(--dynamic-text-colors)]` : ''} 
                                    hover:text-[var(--dynamic-text-colors)]
                                    transition-colors 
                                    duration-300 
                                    ease-in-out 
                                    md:min-w-full  
                                    relative
                                    md:bg-transparent`} 
                                    style={{
                                        "--dynamic-colors": colorParser(props?.color || 'bright-red'),
                                    "--dynamic-text-colors": textColorParser(props?.color || 'bright-red'),
                                    } as React.CSSProperties}
                                >
                                    {props?.TabsTitleComponent ? props.TabsTitleComponent(tab.title) : <TextLg as="span" className={selectedTab == index ? "font-modern-era-medium! text-left" : "font-modern-era  text-left"}>{tab.title}</TextLg>}
                                    {
                                        selectedTab == index ? <div className={`md:hidden bg-[var(--dynamic-colors)] h-[.4vw] w-full relative top-xs`}></div> : <div className={`md:hidden bg-transparent h-[.4vw] w-full relative top-xs`}></div>
                                    }
                                </button>
                            )
                        })}
                        </div>
                    </div>}
                    {/* tabs */}

                    {/* content */}
                    <div className="relative">
                        {props.tabs?.[selectedTab]?.content && <Body className="w-full! m-0! p-0!" content={props.tabs?.[selectedTab]?.content} />}
                    </div>
                </div> 
            </div>
            );
    }

    // // //console.log({props})
    if(props?.variant === "map-content" && props?.mapTabs) {
        return (
            <div className={`${props?.className  || ''} pt-(--padding-top-small) w-full flex flex-col bg-white px-sm md:p-xl`} >
                {
                    props?.title && <BodyMarkdown components={{
                        p: ({children})=><TitleLg className="pt-18 md:pt-10 mb-6">{children}</TitleLg>
                    }}>
                        {props?.title}
                    </BodyMarkdown>
                }

                {/* tabs */}
                {props?.mapTabs?.length > 0 && <div className={`${props?.tabsClassName  || ''} scroll-container overflow-x-auto flex flex-col justify-between items-start w-auto relative md:mx-0 ${props?.title ? "pt-0" : "pt-xl"} pb-2xs md:pb-sm ml-0 mb-lg`}>
                    <div role="tablist" className={` flex flex-row md:justify-start md:items-center w-full md:gap-x-0 gap-x-sm ${props?.tabsContainerClassName || ''}`}>
                        {props.mapTabs.map((tab, index, arr) => {
                        return (
                            <button ref={r=>{
                                tabRef.current[index] = r as any
                            }} 
                            key={index}
                            onMouseEnter={e=>onMouseOver(e as any,index)} 
                            onMouseLeave={(e)=>onMouseOut(e as any, index)} 
                            type="button"
                                role="tab"
                                aria-selected={selectedTab == index}
                                tabIndex={selectedTab == index ? 0 : -1}
                                onKeyDown={(e) => handleTabKeyDown(e, index, arr.length, setSelectedTab)}
                                onClick={()=>setSelectedTab(index)} 
                            className={`flex-1 text-center cursor-pointer md:border-r-[.15vw] md:border-r-[#E0E0E0] last:border-r-0 py-2xs hover:text-${textSafeColor(props?.color || "bright-red")} transition-colors duration-300 ease-in-out md:min-w-0 min-w-fit bg-light-gray md:bg-transparent px-lg first:md:pl-0 last:md:pr-0  md:border-b-0 ${props?.tabClass || ''} ${selectedTab == index ? `text-${textSafeColor(props?.color || "bright-red")}` : ""}`} 
                            style={{
                                //   width: props?.contentFit ? 'fit-content' : 100 / arr.length + '%',
                            }}>
                                {<TextMd>{tab?.tabName}</TextMd>}
                            </button>
                        )
                    })}
                    </div>
                    <div className="md:px-xl w-full md:block hidden ">
                        <div ref={(r)=>{
                            bottomBorderContainerRef.current = r as any;
                        }} className={`absolute bottom-0 h-[.6vw] md:h-[.4vw] bg-${props.color || "bright-red"} transition-all duration-300 ease-in-out`} style={{
                            //   width: props?.contentFit ? 'fit-content' : ((100 / props.tabs.length) )+ '%',
                        }}/>
                    </div>
                </div>}
                {/* tabs */}

                {/* content */}
                <div className="relative ">
                        {props.mapTabs?.[selectedTab] && <LocationDetails className="px-0! " {...props.mapTabs?.[selectedTab]} />}
                </div>
            </div>
        )
    }
    
    if(props.tabs) {
        return (
            <div className={`${props?.className  || ''}  w-full px-sm sm:px-xl flex flex-col bg-white ${props?.contentLayout === "compact" ? 'w-full xl:max-w-[70%]! px-sm! sm:px-xl! mx-auto!' : ''}`} >
                
                {
                    props?.title && <BodyMarkdown components={{
                        p: ({children})=><TitleLg className={props?.index == 0 ? "pt-18 md:pt-10 mb-6" : "mb-xl"}>{children}</TitleLg>
                    }}>
                        {props?.title}
                    </BodyMarkdown>
                }

                {/* tabs */}
                {props.tabs.length > 0 && <div className={`${props?.tabsClassName  || ''} scroll-container overflow-x-auto flex flex-col justify-between items-start w-auto relative md:mx-0 ${props?.title ? "pt-0" : "pt-xl"} pb-2xs md:pb-sm ml-0 mb-xl`}>
                    <div role="tablist" className={` flex flex-row md:justify-start md:items-center ${props?.contentFit ? 'w-fit-content' : 'w-full'} md:gap-x-0 gap-x-sm ${props?.tabsContainerClassName || ''}`}>
                        {props.tabs.map((tab, index, arr) => {
                        return (
                            <button ref={r=>{
                                tabRef.current[index] = r as any
                            }} 
                            key={index}
                            onMouseEnter={e=>onMouseOver(e as any,index)} 
                            onMouseLeave={(e)=>onMouseOut(e as any, index)} 
                            type="button"
                                role="tab"
                                aria-selected={selectedTab == index}
                                tabIndex={selectedTab == index ? 0 : -1}
                                onKeyDown={(e) => handleTabKeyDown(e, index, arr.length, setSelectedTab)}
                                onClick={()=>setSelectedTab(index)} 
                            className={`text-center cursor-pointer md:border-r-[.15vw] md:border-r-[#E0E0E0] last:border-r-0 py-2xs hover:text-${textSafeColor(props?.color || "bright-red")} transition-colors duration-300 ease-in-out md:min-w-0 min-w-fit ${props?.contentLayout == 'compact' ? '':'flex-1'} bg-light-gray md:bg-transparent px-lg first:md:pl-0 last:md:pr-0  md:border-b-0 ${props?.tabClass || ''} ${selectedTab == index ? `text-${textSafeColor(props?.color || "bright-red")}` : ""}`} 
                            style={{
                                //   width: props?.contentFit ? 'fit-content' : 100 / arr.length + '%',
                            }}>
                                {props?.TabsTitleComponent ? props.TabsTitleComponent(tab.title) : <TextMd>{tab.title}</TextMd>}
                            </button>
                        )
                    })}
                    </div>
                    <div className="md:px-xl w-full md:block hidden ">
                        <div ref={(r)=>{
                            bottomBorderContainerRef.current = r as any;
                        }} className={`absolute bottom-0 h-[.6vw] md:h-[.4vw] bg-${props.color || "bright-red"} transition-all duration-300 ease-in-out`} style={{
                            //   width: props?.contentFit ? 'fit-content' : ((100 / props.tabs.length) )+ '%',
                        }}/>
                    </div>
                </div>}
                {/* tabs */}

                {/* content */}
                <div className="relative ">
                        {props.tabs?.[selectedTab]?.content && <Body content={props.tabs?.[selectedTab]?.content} className={`!py-0 !px-xs ${props?.contentTabsLayout == 'compact' ? 'w-full max-w-full! px-0!' : ''} `} />}
                </div>
            </div>
            );
    }

    return <></>
    
}; 

export default memo(TabbedBodyContent);
