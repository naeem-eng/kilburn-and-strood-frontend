"use client";
import { textSafeColor } from "@/parsers";

import { Text, TextMd, TextXl, TitleLg, TitleMd, TitleSm } from "@/components/helpers/typography";
import { TabbedContentProps } from "./tabbed-content.types";
import { useRef, MouseEvent, useState, useEffect, useMemo, useContext, useId } from "react";
import { handleTabKeyDown } from "@/utils/a11y";
import { flushSync } from "react-dom";
import Image from "next/image";
import { Button } from "@/components/helpers/buttons";
import Link from "next/link";
import { LeftArrowIcon, RightArrowIcon } from "@/components/helpers/icons";
import { createIncrementalAnimationAttributes } from "@/components/helpers/animation";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreak from 'remark-breaks';
import BodyMarkdown from "@/components/helpers/body-markdown/BodyMarkdown";
import { FullPageSliderContext } from "@/components/interactive/fullpage";

type TabbedContentFieldKey = "title" | "text" | "button" | "menu"

const tabbedContentAnimatedFieldsOrder: TabbedContentFieldKey[] = ["title", "text", "button", "menu"]

const TabbedContent: React.FC<TabbedContentProps> = (props) => {

    
    const [selectedTab, setSelectedTab] = useState(0);
    const tabsId = useId();
    const [isTransitioning, setIsTransitioning] = useState(false);
    const [nextIndex, setNextIndex] = useState<number | null>(null);
    const [transitionPhase, setTransitionPhase] = useState<"start" | "animating">("start");
    const [isDirectionLeft, setIsDirectionLeft] = useState(false);
    const tabRef = useRef<HTMLElement[]>([]);
    const bottomBorderContainerRef = useRef<HTMLElement>(null);
    const tabsContainerRef = useRef<HTMLDivElement>(null);
    const [showTabsOverflowHint, setShowTabsOverflowHint] = useState({ left: false, right: false });

    const fullPageReinit = useContext(FullPageSliderContext);
    const isInitialMount = useRef(true);

    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return;
        }
        fullPageReinit?.reinit();
    }, [selectedTab, fullPageReinit]);

    const viewTransitionsSupported = typeof document !== "undefined" && "startViewTransition" in document;

    useEffect(() => {
        if (viewTransitionsSupported) return;
        if (!isTransitioning) return;
        const raf = requestAnimationFrame(() => setTransitionPhase("animating"));
        return () => cancelAnimationFrame(raf);
    }, [isTransitioning, viewTransitionsSupported]);

    const changeTab = (index: number) => {
        if (index === selectedTab || isTransitioning) return;
        const directionLeft = index < selectedTab;
        setIsDirectionLeft(directionLeft);
        if (viewTransitionsSupported) {
            document.documentElement.setAttribute("data-active-view-transition", "tabbedContent");
            document.documentElement.setAttribute("data-direction", directionLeft ? "left" : "right");
            const transition = document.startViewTransition(() => {
                flushSync(() => {
                    setSelectedTab(index);
                    setNextIndex(null);
                    setIsTransitioning(false);
                });
            });
            transition.finished.then(() => {
                document.documentElement.removeAttribute("data-active-view-transition");
                document.documentElement.removeAttribute("data-direction");
            });
        } else {
            setNextIndex(index);
            setIsTransitioning(true);
            setTransitionPhase("start");
            setTimeout(() => {
                setSelectedTab(index);
                setNextIndex(null);
                setIsTransitioning(false);
                setTransitionPhase("start");
            }, 500);
        }
    };

    const getTabbedAnimationAttributes = createIncrementalAnimationAttributes<TabbedContentFieldKey>({
        distances: ["-14%", "-12%", "-10%", "-8%"],
        negativeOnReverse: false,
        fieldsOrder: tabbedContentAnimatedFieldsOrder,
    })
    const getMobileTabbedAnimationAttributes = createIncrementalAnimationAttributes<TabbedContentFieldKey>({
        distances: ["10svh", "8svh", "6svh", "4svh"],
        fieldsOrder: tabbedContentAnimatedFieldsOrder,
        negativeOnReverse: false,
        axis: "y",
        screenSize: "mobile-",
        trigger: ".tabbed-content-container",
        start: "top 90%"
    });

    useEffect(() => {
        if (!bottomBorderContainerRef.current || !tabRef.current) return;
        const target = tabRef.current[selectedTab] as HTMLElement;

        bottomBorderContainerRef.current.style.left = (target?.offsetWidth * selectedTab) + 'px';
        bottomBorderContainerRef.current.style.width = (target?.offsetWidth) + 'px';
    }, [selectedTab]);

    useEffect(() => {
        const updateTabsOverflowHint = () => {
            const container = tabsContainerRef.current;
            if (!container || typeof window === "undefined") {
                setShowTabsOverflowHint({ left: false, right: false });
                return;
            }

            const hasOverflow = container.scrollWidth - container.clientWidth > 2;
            const canScrollLeft = container.scrollLeft > 2;
            const canScrollRight = container.scrollLeft < (container.scrollWidth - container.clientWidth - 2);
            const isMobile = window.innerWidth < 768;

            if (!isMobile || !hasOverflow) {
                setShowTabsOverflowHint({ left: false, right: false });
                return;
            }

            setShowTabsOverflowHint({
                left: canScrollLeft,
                right: canScrollRight,
            });
        };

        updateTabsOverflowHint();
        const container = tabsContainerRef.current;
        container?.addEventListener("scroll", updateTabsOverflowHint, { passive: true });
        window.addEventListener("resize", updateTabsOverflowHint);

        return () => {
            container?.removeEventListener("scroll", updateTabsOverflowHint);
            window.removeEventListener("resize", updateTabsOverflowHint);
        };
    }, [props.tabs.length, selectedTab]);

    const onTabsOverflowHintClick = (direction: "left" | "right") => {
        const container = tabsContainerRef.current;
        if (!container) return;

        const scrollAmount = Math.max(container.clientWidth * 0.65, 120);
        container.scrollBy({ left: direction === "left" ? -scrollAmount : scrollAmount, behavior: "smooth" });
    };


    const tab = useMemo(() => {
        return props.tabs[selectedTab];
    }, [selectedTab]);

    const renderTabContent = (
        tabData: (typeof props.tabs)[0],
        slideClass: string,
        absolute = false
    ) => (
        <div className={`relative grid items-start grid-cols-6 grid-rows-[auto_auto] md:grid-rows-[auto_auto_1fr] md:grid-cols-12 gap-x-4 gap-y-0 w-full h-full px-(--space-3xl) transition-all duration-500 ${absolute ? "absolute inset-0" : ""} ${slideClass}`}>
            <div
                data-animation-atoms
                data-from='{"x": "-100%"}'
                data-middle='{"x": "0%"}'
                data-to='{"x": "-100%"}'
                className={`text-container w-[93%] md:w-auto z-2 col-span-full md:col-[1/span_6] row-1 -ml-(--space-3xl) md:min-h-[50vh] md:justify-center bg-white py-xl md:pt-3xl md:pb-(--padding-top) px-sm md:px-(--space-3xl) flex flex-col gap-y-md transition-[clip-path] duration-300 min-h-0 tabbed-content-container overflow-clip`}
            >
                {/* <TitleMd
                    attributes={{ ...getTabbedAnimationAttributes("title"), ...getMobileTabbedAnimationAttributes("title") }}
                >
                    {tabData.content.title}
                </TitleMd> */}
                {tabData.content.title && <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreak]}
                    components={{
                        p: ({ children }) => <TextXl attributes={{ ...getTabbedAnimationAttributes("title"), ...getMobileTabbedAnimationAttributes("title") }}>{children}</TextXl>,
                        strong: ({ children }) => <TextXl as="span" className={`text-${textSafeColor(props?.color || 'yellow')}`}>{children}</TextXl>
                    }}
                >
                    {tabData.content.title}
                </ReactMarkdown>}
                {tabData.content.text && <BodyMarkdown
                    color={props?.color || 'bright-red'}
                    components={{
                        p: ({ children }) => <Text textSize="text-base"
                            className="xl:w-[80%]"
                            attributes={{ ...getTabbedAnimationAttributes("text"), ...getMobileTabbedAnimationAttributes("text") }}>{children}</Text>,
                    }}
                >{tabData.content.text}</BodyMarkdown>}
                {tabData.content?.cta && (
                    <div
                        className="w-full"
                        {...getTabbedAnimationAttributes("button")}
                        {...getMobileTabbedAnimationAttributes("button")}
                    >

                        <Button isExternal={tabData.content?.cta?.isExternal} href={tabData.content?.cta?.href} icon='right-arrow' type={tabData.content?.cta?.type || "text"} textColor={`text-${textSafeColor(props?.color || "bright-red")}`} buttonClassName="mt-0 ">{tabData.content?.cta?.text}</Button>
                    </div>
                )}
            </div>
            {tabData?.content?.type === "image" && tabData?.content?.imageSrc && (
                <div className="content-right z-1 col-span-full md:col-[span_6/-1] md:row-1 -ml-4 self-start min-h-0 h-full">
                    <Image
                        data-animation-atoms
                        data-from='{"clip-path": "inset(100% 0 0%)"}'
                        data-middle='{"clip-path": "inset(0% 0 0%)"}'
                        data-to='{"clip-path": "inset(0% 0 100%)"}'
                        data-mobile-from='{"clip-path": "inset(0 100% 0 0)"}'
                        data-mobile-middle='{"clip-path": "inset(0 0% 0 0)"}'
                        data-mobile-trigger=".content-right"
                        data-mobile-duration="0.4"
                        unoptimized
                        src={tabData?.content?.imageSrc}
                        alt={tabData?.content?.imageAlt || ""}
                        width={tabData?.content?.imageWidth || 731}
                        height={tabData?.content?.imageHeight || 337}
                        className="w-full"
                    />
                </div>
            )}
            {tabData?.content?.type === "menu" &&
                tabData?.content?.menu?.items &&
                tabData?.content?.menu?.items?.length > 0 && (
                    <div
                        className="content-right z-1 col-span-full md:col-[span_6/-1] md:row-[1/span_2] -ml-4 -mr-(--padding-side) md:mr-0 self-start bg-dark-gray px-xl pb-xl pt-2xl overflow-clip"
                        data-animation-atoms
                        data-from='{"x": "20%"}'
                        data-middle='{"x": "0%"}'
                        data-to='{"x": "20%"}'
                        data-mobile-from='{"y": "10%"}'
                        data-mobile-middle='{"y": "0%"}'
                        data-mobile-start="top 25%"
                        data-mobile-duration="0.4"
                    >
                        <div className="pb-sm border-b-[.2vw] border-[#ffffff33] mb-sm">
                            <Text className="text-white font-modern-era-bold text-base">
                                {tabData?.content?.menu?.title}
                            </Text>
                        </div>
                        {tabData?.content?.menu?.items?.map((item: any, idx: number) => (
                            <Link
                                href={item?.href || "#"}
                                key={idx}
                                className="flex justify-between items-center pb-sm border-b-[.2vw] border-[#ffffff33] last:border-b-0 mb-sm hover:px-xs transition-all"
                            >
                                <div className="flex-1">
                                    <Text className="text-white" textSize="text-base">{item?.title}</Text>
                                </div>
                                <RightArrowIcon className="w-sm h-sm" fill="var(--color-bright-red)" />
                            </Link>
                        ))}
                    </div>
                )}
            <div className="media-bottom md:row-span-full col-span-full md:col-[1/span_8] h-full -ml-(--space-3xl)">
                <Image
                    src={props?.media1?.url ? props?.media1?.url : "/images/tabbed-bgimg-2.png"}
                    alt={props?.media1?.alt || ""}
                    width={731}
                    height={337}
                    className="w-full h-full object-cover object-bottom"
                    data-animation-atoms
                    data-from='{"y": "10%"}'
                    data-middle='{"y": "0%"}'
                    data-to='{"y": "10%"}'
                />
            </div>
            {<div
                className="media-side absolute top-0 right-0 w-12 md:w-(--space-3xl)"
                data-animation-atoms
                data-from='{"clip-path": "inset(0% 0 100%)"}'
                data-middle='{"clip-path": "inset(0% 0 0%)"}'
                data-to='{"clip-path": "inset(100% 0 0%)"}'
                data-mobile-from='{"clip-path": "inset(0 0 100%)"}'
                data-mobile-middle='{"clip-path": "inset(0 0 0%)"}'
                data-mobile-to='{"clip-path": "inset(0 0 100%)"}'
                data-mobile-start="top 65%"
                data-mobile-duration="0.4"
            >
                <Image src={props?.media2?.url ? props?.media2?.url : "/images/tabbed-bgimg-3.png"} alt={props?.media2?.alt || ""} width={props?.media2?.width || 67} height={props?.media2?.height || 338} className="w-full" />
            </div>}
        </div>
    );
    const isAnimation = props?.isAnimation || false;
    const isLightAnimation = props?.isLightAnimation || false;
    return (
        <div
            data-animation={isAnimation}
            data-light-animation={isLightAnimation}
            data-animation-component
            data-primary-header
            data-section-type="tabbed-content"
            className={`${props?.className || ''} tabbedContent ${isAnimation || isLightAnimation ? 'invisible' : ''} xl:h-svh bg-white w-full flex flex-col ${(props?.index && props?.index > 0) ? "pt-5" : "pt-(--padding-top)"} relative`}
            style={{
                zIndex: props.index
            }}>

            {
                props?.title && <BodyMarkdown components={{
                    p: ({ children }) => <TitleMd className="pb-4 md:pt-0 mb-6 px-sm md:px-xl">{children}</TitleMd>
                }}>
                    {props?.title}
                </BodyMarkdown>
            }
            {/* tabs */}
            {props.tabs.length > 0 &&
            <div className="w-full relative">
              <div className="tabs-overflow-controls md:hidden absolute inset-0 z-50 pointer-events-none">
                  {showTabsOverflowHint.left && (
                      <button
                          type="button"
                          onClick={() => onTabsOverflowHintClick("left")}
                          aria-label="Scroll tabs left"
                          className="absolute left-0 top-1/2 -translate-y-1/2 h-12 w-12 flex items-center justify-center bg-bright-red pointer-events-auto"
                      >
                          <LeftArrowIcon className="w-lg h-lg" fill="var(--color-white)" />
                      </button>
                  )}
                  {showTabsOverflowHint.right && (
                      <button
                          type="button"
                          onClick={() => onTabsOverflowHintClick("right")}
                          aria-label="Scroll tabs right"
                          className="absolute right-0 top-1/2 -translate-y-1/2 h-12 w-12 flex items-center justify-center bg-bright-red pointer-events-auto"
                      >
                          <RightArrowIcon className="w-lg h-lg" fill="var(--color-white)" />
                      </button>
                  )}
              </div>
              <div
                    ref={tabsContainerRef}
                    className={`tabs-container scroll-container ${props?.isAnimation ? 'md:pt-4xl' : ''} overflow-x-auto flex flex-col justify-between items-start w-auto relative min-h-max shrink-0`}
                >
                    <div role="tablist" className="flex flex-row md:justify-start md:items-center min-w-full md:gap-x-0 gap-x-sm md:px-0 px-sm">
                        {props.tabs.map((tab, index, arr) => {
                            return (
                                <button ref={r => {
                                    tabRef.current[index] = r as any
                                }}
                                    key={index}
                                    type="button"
                                    role="tab"
                                    id={`${tabsId}-tab-${index}`}
                                    aria-selected={selectedTab == index}
                                    aria-controls={`${tabsId}-panel`}
                                    tabIndex={selectedTab == index ? 0 : -1}
                                    onKeyDown={(e) => handleTabKeyDown(e, index, arr.length, changeTab)}
                                    onClick={() => changeTab(index)}
                                    className={`text-center cursor-pointer md:border-r-[.1vw] md:border-r-[#E0E0E0] last:border-r-0 py-xs ${selectedTab == index ? ` border-b-bright-red text-${textSafeColor(props?.color || "bright-red")}` : 'border-b-transparent'} hover:text-${textSafeColor(props?.color || "bright-red")} transition-colors duration-300 ease-in-out md:min-w-0 w-46 md:w-fit bg-light-gray md:bg-transparent px-lg md:px-0 border-b-[.8vw] md:border-b-0 flex-1`}
                                >
                                    <TextMd as="span" className="whitespace-auto">{tab.title}</TextMd>
                                </button>
                            )
                        })}

                    </div>
                    <div className="md:px-xl w-full md:block hidden">
                        <div
                            ref={(r) => {
                                bottomBorderContainerRef.current = r as any;
                            }}
                            className={`absolute bottom-0 h-[.6vw] md:h-[.4vw] bg-${props.color} transition-all duration-300 ease-in-out`}
                        />
                    </div>
                </div>
            </div>
            }
            {/* tabs */}

            {/* content */}
            <div role="tabpanel" id={`${tabsId}-panel`} aria-labelledby={`${tabsId}-tab-${selectedTab}`} className="relative overflow-clip w-full flex-grow min-h-0">
                {!isTransitioning || viewTransitionsSupported ? (
                    renderTabContent(tab, "translate-x-0 opacity-100", false)
                ) : nextIndex !== null ? (
                    <>
                        {renderTabContent(
                            tab,
                            transitionPhase === "start"
                                ? "translate-x-0 opacity-100"
                                : `opacity-0 ${isDirectionLeft ? "translate-x-full" : "-translate-x-full"}`,
                            true
                        )}
                        {renderTabContent(
                            props.tabs[nextIndex],
                            transitionPhase === "start"
                                ? `opacity-0 ${isDirectionLeft ? "-translate-x-full" : "translate-x-full"}`
                                : "translate-x-0 opacity-100",
                            false
                        )}
                    </>
                ) : null}
            </div>
            {/* content */}
        </div>
    );
};

export default TabbedContent;
