"use client";

import { useState, useEffect, useContext, useRef } from "react"
import { PeopleHighlightProps } from "./people-highlight.types"
import { Text, TitleLg } from "@/components/helpers/typography"
import { colorParser, textSafeColor, textColorParser } from "@/parsers";
import { Button } from "@/components/helpers/buttons"
import Image from "next/image"
import { LeftArrowIcon, RightArrowIcon } from "@/components/helpers/icons"
import { createIncrementalAnimationAttributes, DEFAULT_VERTICAL_DISTANCES } from "@/components/helpers/animation"
import { flushSync } from "react-dom"
import BodyMarkdown from "@/components/helpers/body-markdown/BodyMarkdown";
import { FullPageSliderContext } from "@/components/interactive/fullpage";

const PeopleHighlight: React.FC<PeopleHighlightProps> = (props) => {
  const isAnimation = props?.isAnimation || false;
  const isLightAnimation = props?.isLightAnimation || false;
  const items = props?.items || [];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [nextIndex, setNextIndex] = useState<number | null>(null);
  const [isDirectionLeft, setIsDirectionLeft] = useState(false);
  const [transitionPhase, setTransitionPhase] = useState<'start' | 'animating'>('start')
  const [paginationDisplayIndex, setPaginationDisplayIndex] = useState(0);
  const [paginationStartIndex, setPaginationStartIndex] = useState(0);

  const fullPageReinit = useContext(FullPageSliderContext);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    fullPageReinit?.reinit();
  }, [selectedIndex, fullPageReinit]);

  const activeItem = items?.[selectedIndex]
  const nextItem = nextIndex !== null ? items?.[nextIndex] : null
  const maxVisiblePaginationItems = 7
  const maxCollapsedPaginationItems = 3

  const paginationWindowSize = Math.min(maxVisiblePaginationItems, items.length)
  const paginationEndIndex = paginationStartIndex + paginationWindowSize
  const paginationActiveIndex = paginationDisplayIndex

  const getWindowStartForActiveIndex = (activeIndex: number, currentStart: number) => {
    if (paginationWindowSize <= 0) return 0
    const maxStart = Math.max(0, items.length - paginationWindowSize)
    const normalizedStart = Math.max(0, Math.min(currentStart, maxStart))
    const windowEnd = normalizedStart + paginationWindowSize - 1

    if (activeIndex < normalizedStart) {
      return activeIndex
    }

    if (activeIndex > windowEnd) {
      return activeIndex - (paginationWindowSize - 1)
    }

    return normalizedStart
  }

  const targetPaginationStartIndex = getWindowStartForActiveIndex(
    nextIndex !== null ? nextIndex : paginationActiveIndex,
    paginationStartIndex
  )
  const visiblePaginationItems = items.slice(paginationStartIndex, paginationEndIndex).map((_, offset) => ({
    index: paginationStartIndex + offset
  }))
  const hiddenPaginationItemsBeforeCount = paginationStartIndex
  const hiddenPaginationItemsAfterCount = items.length - paginationEndIndex
  const leftCollapsedPaginationCount = Math.min(hiddenPaginationItemsBeforeCount, maxCollapsedPaginationItems)
  const rightCollapsedPaginationCount = Math.min(hiddenPaginationItemsAfterCount, maxCollapsedPaginationItems)
  const leftCollapsedPaginationItems = Array.from({ length: leftCollapsedPaginationCount }, (_, offset) => ({
    index: paginationStartIndex - leftCollapsedPaginationCount + offset
  }))
  const rightCollapsedPaginationItems = Array.from({ length: rightCollapsedPaginationCount }, (_, offset) => ({
    index: paginationEndIndex + offset
  }))
  const paginationRailItems = Array.from(
    { length: leftCollapsedPaginationCount + paginationWindowSize + rightCollapsedPaginationCount },
    (_, offset) => {
      const index = paginationStartIndex - leftCollapsedPaginationCount + offset
      const isPreviewLeft = index < paginationStartIndex
      const isPreviewRight = index >= paginationEndIndex
      const variant: 'visible' | 'preview' = isPreviewLeft || isPreviewRight ? 'preview' : 'visible'
      const previewDirection: 'left' | 'right' | undefined = isPreviewLeft
        ? 'left'
        : isPreviewRight
          ? 'right'
          : undefined
      const previewPosition = isPreviewLeft
        ? index - (paginationStartIndex - leftCollapsedPaginationCount)
        : isPreviewRight
          ? index - paginationEndIndex
          : undefined
      const previewTotal = previewDirection === 'left'
        ? leftCollapsedPaginationCount
        : previewDirection === 'right'
          ? rightCollapsedPaginationCount
          : undefined

      return { index, variant, previewDirection, previewPosition, previewTotal }
    }
  )
  const hiddenPaginationItemsBeforeOverflowCount = hiddenPaginationItemsBeforeCount - leftCollapsedPaginationCount
  const hiddenPaginationItemsAfterOverflowCount = hiddenPaginationItemsAfterCount - rightCollapsedPaginationCount
  const isPaginationSlidingForward = targetPaginationStartIndex > paginationStartIndex
  const isPaginationSlidingBackward = targetPaginationStartIndex < paginationStartIndex
  const paginationRailOffsetClass = isTransitioning && transitionPhase === 'animating'
    ? isPaginationSlidingForward
      ? '-translate-x-[1.2rem]'
      : isPaginationSlidingBackward
        ? 'translate-x-[1.2rem]'
        : 'translate-x-0'
    : 'translate-x-0'

  const viewTransitionsSupported = typeof document !== 'undefined' && 'startViewTransition' in document;

  useEffect(() => {
    if (items.length === 0 || paginationWindowSize <= 0) {
      if (paginationStartIndex !== 0) {
        setPaginationStartIndex(0)
      }
      return
    }

    setPaginationStartIndex((currentStart) => getWindowStartForActiveIndex(paginationActiveIndex, currentStart))
  }, [items.length, paginationWindowSize, paginationActiveIndex])

  useEffect(() => {
    if (viewTransitionsSupported) return;
    if (!isTransitioning) return
    const raf = requestAnimationFrame(() => setTransitionPhase('animating'))
    return () => cancelAnimationFrame(raf)
  }, [isTransitioning, viewTransitionsSupported])

  const goToSlide = (index: number) => {
    if (index === selectedIndex || isTransitioning) return
    const directionLeft = (selectedIndex === index + 1) || (selectedIndex === 0 && index === items.length - 1)
    setIsDirectionLeft(directionLeft)
    if (viewTransitionsSupported) {
      document.documentElement.setAttribute('data-direction', directionLeft ? 'left' : 'right')
    }
    // Update active marker in the same batch — browser transitions from previous paint value
    setPaginationDisplayIndex(index)
    setNextIndex(index)
    setIsTransitioning(true)
    setTransitionPhase('start')
    setTimeout(() => {
      setSelectedIndex(index)
      setNextIndex(null)
      setIsTransitioning(false)
      setTransitionPhase('start')
    }, 500)
  }

  const changeSlides = (index: number) => {
    if (index === selectedIndex || isTransitioning) return
    if (viewTransitionsSupported) {
      const directionLeft = (selectedIndex === index + 1) || (selectedIndex === 0 && index === items.length - 1)
      document.documentElement.setAttribute('data-active-view-transition', 'peopleHighlight')
      document.documentElement.setAttribute('data-direction', directionLeft ? 'left' : 'right')
      // Update active marker NOW so browser paints one frame of the button expanding
      // before startViewTransition shifts the window (delayed by one rAF)
      setPaginationDisplayIndex(index)
      requestAnimationFrame(() => {
        const transition = document.startViewTransition(() => {
          flushSync(() => {
            setSelectedIndex(index)
            setNextIndex(null)
            setIsTransitioning(false)
            setIsDirectionLeft(directionLeft)
          })
        })
        transition.finished.then(() => {
          document.documentElement.removeAttribute('data-active-view-transition')
          document.documentElement.removeAttribute('data-direction')
        })
      })
    } else {
      goToSlide(index)
    }
  }

  const nextTrigger = () => {
    if (!props?.items) return;
    if (selectedIndex >= props?.items?.length - 1) return;
    const newIndex = selectedIndex + 1;
    changeSlides(newIndex);
  }

  const prevTrigger = () => {
    if (selectedIndex <= 0) return;
    const newIndex = selectedIndex - 1;
    changeSlides(newIndex);
  }

  const bulletTrigger = (index: number) => {
    changeSlides(index)
  }

  const getPreviewPaginationClasses = (direction: 'left' | 'right', position: number, total: number) => {
    // Sizes/opacities match the original OverflowIndicator bars: xxs → xs → s
    const widthScale  = ['w-[0.45rem]', 'w-[0.7rem]', 'w-[0.95rem]']
    const opacityScale = ['opacity-30',  'opacity-45', 'opacity-60']
    // Left: bars increase left→right (outermost = smallest)
    // Right: bars decrease left→right (innermost = largest, adjacent to window)
    const scaleIndex = direction === 'left'
      ? (3 - total) + position          // when total < 3, shift right so last bar is always index 2
      : (total - 1) - position          // first bar rendered is the largest on the right side
    const i = Math.max(0, Math.min(scaleIndex, 2))
    return `${widthScale[i]} ${opacityScale[i]}`
  }

  const getPaginationButtonClasses = (
    index: number,
    variant: 'visible' | 'preview' = 'visible',
    previewDirection?: 'left' | 'right',
    previewPosition?: number,
    previewTotal?: number
  ) => {
    const isActive = index === paginationActiveIndex
    const isShrinkingVisibleItem = variant === 'visible' && (
      (isPaginationSlidingForward && index === paginationStartIndex) ||
      (isPaginationSlidingBackward && index === paginationEndIndex - 1)
    )
    const isCrossingBoundaryItem =
      (isPaginationSlidingForward && index === paginationEndIndex) ||
      (isPaginationSlidingBackward && index === paginationStartIndex - 1)

    if (isActive) {
      return 'opacity-100 w-7'
    }

    if (variant === 'preview' && previewDirection !== undefined && previewPosition !== undefined && previewTotal !== undefined) {
      const basePreviewClasses = getPreviewPaginationClasses(previewDirection, previewPosition, previewTotal)
      if (isCrossingBoundaryItem) {
        return `${basePreviewClasses} ${isPaginationSlidingForward ? '-translate-x-[0.25rem]' : 'translate-x-[0.25rem]'}`
      }
      return basePreviewClasses
    }

    if (isShrinkingVisibleItem) {
      return 'opacity-55 w-[0.7rem]'
    }

    return 'opacity-35 w-[1rem] hover:opacity-50 duration-100 hover:duration-300'
  }

  const OverflowIndicator = ({ count }: { direction: 'left' | 'right', count: number }) => (
    <span
      aria-hidden="true"
      className="text-xxs duration-300 font-medium tracking-[0.12em] text-dark-gray/55 md:text-white/55"
    >
      {count}
    </span>
  )

  type AnimatedFieldKey = 'label' | 'title' | 'text' | 'button'

  const animationY = DEFAULT_VERTICAL_DISTANCES

  const renderContent = (item: typeof items[0], slideClass: string, absolute = true, index?: number) => {
    const itemFieldsOrder: AnimatedFieldKey[] = []
    if (item?.label) itemFieldsOrder.push('label')
    if (item?.title) itemFieldsOrder.push('title')
    if (item?.text) itemFieldsOrder.push('text')
    if (item?.cta) itemFieldsOrder.push('button')

    const getItemAnimationAttributes = createIncrementalAnimationAttributes<AnimatedFieldKey>({
      distances: animationY,
      fieldsOrder: itemFieldsOrder,
      axis: 'x'
    })
    const getMobileItemAnimationAttributes = createIncrementalAnimationAttributes<AnimatedFieldKey>({
      distances: ['10svh', '8svh', '6svh', '4svh'],
      fieldsOrder: itemFieldsOrder,
      negativeOnReverse: false,
      axis: 'y',
      screenSize: 'mobile-',
      trigger: '.text-container',
      start: 'top 90%',
      delay: 0.1,
      stagger: true,
      staggerAmount: 0.05
    })

    return (
      <div
        key={index !== undefined ? `item-${index}` : `item-${String(item?.title || 'content')}`}
        className={`grid grid-cols-6 grid-rows-[1fr_3rem_auto_3.25rem] md:grid-cols-12 md:grid-rows-[auto_1fr] items-start gap-x-4 w-full h-full transition-all duration-500 ${absolute ? 'absolute inset-0' : 'relative'} ${slideClass}`}
      >
        {/* leftBox */}
        <div
          data-animation-atoms
          data-from={`{"x": "-20%"}`}
          data-middle='{"x": "0%"}'
          data-to={`{"x": "-20%"}`}
          className="text-container relative z-1 col-span-full md:col-[1/span_6] row-[2/span_2] md:row-1 w-[96%] md:w-auto -ml-(--padding-side) overflow-clip"
        >
          <div
            className="bg-white p-8 pt-6 pr-6 md:p-(--padding-side) md:min-h-[20rem] xl:min-h-[50vh] md:pr-5 flex flex-col gap-y-6 justify-center items-start"
            data-animation-atoms
            data-mobile-from={`{"y": "100%"}`}
            data-mobile-middle='{"y": "0%"}'
            data-mobile-trigger=".text-container"
            data-mobile-start="top 90%"
          >
            <div className="text-content flex flex-col gap-y-4">
              {item?.label && (
                <Text
                  textSize="text-base"
                  attributes={{ ...getItemAnimationAttributes('label'), ...getMobileItemAnimationAttributes('label') }}
                >
                  {item?.label}
                </Text>
              )}
              {(item?.title && item?.role) && (
                <TitleLg
                  attributes={{ ...getItemAnimationAttributes('title'), ...getMobileItemAnimationAttributes('title') }}
                  className="[&_span]:text-[var(--dynamic-text-colors)]"
                  style={{
                    "--dynamic-colors": colorParser(item?.color || 'dark-purple'),
                                    "--dynamic-text-colors": textColorParser(item?.color || 'dark-purple')
                  }}>
                  {item?.title}<br /><span>{item?.role}</span>
                </TitleLg>
              )}
              {item.text &&
                <BodyMarkdown
                  color={item?.color || "bright-red"}
                  components={{
                    p: ({ children }) => <Text
                      as={"p"}
                      textSize="text-base"
                    >{children}</Text>,
                  }}
                >{item?.text}</BodyMarkdown>
              }

            </div>
            {item?.cta && (
              <div className="w-full link" {...getItemAnimationAttributes('button')} {...getMobileItemAnimationAttributes('button')}>
                <Button
                  href={item?.cta?.href}
                  icon='right-arrow'
                  type={item?.cta?.type || "text"}
                  textColor={
                    `text-${textSafeColor(item?.color)}`
                  }
                  dynamicIconColor={colorParser(item?.color)}

                >
                  {item?.cta?.text}
                </Button>
              </div>
            )}
          </div>
        </div>
        {/* leftBox */}
        {/* rightBottomPatternBox */}
        {item?.imageSrc && <div className="relative col-span-full md:col-[span_8/-1] row-[1/span_2] md:row-[1/-1] h-full -mr-(--padding-side) md:mt-0">
          <Image
            unoptimized
            src={item?.imageSrc}
            alt={item?.imageAlt || ''}
            width={item?.imageWidth || 731}
            height={item?.imageHeight || 337}
            className="image-1 absolute inset-0 ml-auto w-[93%] md:w-full h-full object-cover"
            data-animation-atoms
            data-from={`{"clip-path": "inset(0 100% 0 0)"}`}
            data-middle='{"clip-path": "inset(0 0% 0 0%)"}'
            data-to={`{"clip-path": "inset(0 0% 0 100%)"}`}
            data-mobile-from={`{"x": "10%", "opacity": 1}`}
            data-mobile-middle={'{"x": "0%", "opacity": 1}'}
          />
        </div>}
        {/* rightBottomPatternBox */}

        {/* leftBottomPatternBox */}
        {item?.patternImageSrc && <div className="relative col-span-full h-full md:col-span-4 row-[span_2/-1] md:row-2 -mx-(--padding-side) md:ml-0 md:-mr-5 overflow-clip">
          <Image
            unoptimized
            src={item?.patternImageSrc}
            // presentational image, no alt text needed
            alt=""
            width={item?.patternImageWidth || 731}
            height={item?.patternImageHeight || 337}
            className="image-2 absolute inset-0 w-full h-full object-cover object-center"
            data-animation-atoms
            data-from={`{"y": "100%"}`}
            data-middle='{"y": "0%"}'
            data-to={`{"y": "-100%"}`}
            data-mobile-from={`{"scale": "1.15"}`}
            data-mobile-middle={'{"scale": "1"}'}
            data-mobile-trigger=".text-container"
            data-mobile-start="top 90%"
          />
        </div>}
        {/* leftBottomPatternBox */}
      </div>
    )
  }

  return (
    <div
      data-animation={isAnimation}
      data-light-animation={isLightAnimation}
      data-section-type="people-highlight"
      data-animation-component
      className={`peopleHighlight ${isAnimation || isLightAnimation ? 'invisible' : ''} pt-(--padding-top) grid grid-rows-[1fr_auto] md:flex md:min-h-[35rem] md:flex-col h-[45rem] sm:h-[50rem] md:h-[30rem] xl:h-svh w-full relative`} style={{
        zIndex: props.index
      }}>

      {activeItem && (
        <div className="relative overflow-y-clip col-span-full md:row-span-full px-(--padding-side) flex-grow">
          {!isTransitioning || viewTransitionsSupported ? (
            renderContent(activeItem, 'translate-x-0 opacity-100', false, selectedIndex)
          ) : nextItem && nextIndex !== null ? (
            <>
              {renderContent(
                activeItem,
                transitionPhase === 'start'
                  ? 'translate-x-0 opacity-100'
                  : `opacity-0 ${isDirectionLeft ? 'translate-x-full' : '-translate-x-full'}`,
                true,
                selectedIndex
              )}
              {renderContent(
                nextItem,
                transitionPhase === 'start'
                  ? `opacity-0 ${isDirectionLeft ? '-translate-x-full' : 'translate-x-full'}`
                  : 'translate-x-0 opacity-100',
                false,
                nextIndex
              )}
            </>
          ) : renderContent(activeItem, 'translate-x-0 opacity-100', false, selectedIndex)}
        </div>
      )}


      <div
        data-animation-atoms
        data-from={`{"x": "100%"}`}
        data-middle='{"x": "0%"}'
        data-to={`{"x": "100%"}`}
        className="controls-container h-auto py-6 md:py-0 px-(--padding-side) md:px-0 md:absolute bottom-xl right-(--padding-side) grid grid-cols-[auto_3rem_3rem] md:grid-cols-[3.5vw_auto_3.5vw] md:gap-x-2 items-center shrink-0">
        <div className="flex flex-row justify-start items-center gap-x-xs md:col-2 row-1 max-w-full overflow-hidden select-none">
          {hiddenPaginationItemsBeforeOverflowCount > 0 && <OverflowIndicator direction="left" count={hiddenPaginationItemsBeforeOverflowCount} />}
          <div className="overflow-hidden">
            <div className={`flex flex-row items-center gap-x-xs transition-transform duration-500 ${paginationRailOffsetClass}`}>
              {paginationRailItems.map(({ index, variant, previewDirection, previewPosition, previewTotal }) => (
                <button
                  aria-current={index === paginationActiveIndex ? "true" : undefined}
                  aria-label={`Go to slide ${index + 1}`}
                  onClick={() => bulletTrigger(index)}
                  key={index}
                  className={`cursor-pointer transition-all duration-500 h-[3px] bg-dark-gray md:bg-white ${getPaginationButtonClasses(index, variant, previewDirection, previewPosition, previewTotal)}`}
                ></button>
              ))}
            </div>
          </div>
          {hiddenPaginationItemsAfterOverflowCount > 0 && <OverflowIndicator direction="right" count={hiddenPaginationItemsAfterOverflowCount} />}
        </div>
        {props?.items && selectedIndex > 0 && (
          <button
            aria-label="Previous Slide"
            className={`group/button cursor-pointer bg-white w-12 h-12 md:w-auto md:h-auto md:aspect-square flex justify-center items-center md:col-1 row-1`}
            onClick={prevTrigger}
            type="button"
          >
            <LeftArrowIcon className={`w-xl aspect-square md:w-md md:h-md text-dark-gray group-hover/button:-translate-x-1 transition-all duration-100 hover:duration-300`} fill="currentColor" />
          </button>
        )}
        {props?.items && selectedIndex < props?.items?.length - 1 && (
          <button
            aria-label="Next Slide"
            className={`group/button cursor-pointer bg-white w-12 h-12 md:w-auto md:h-auto md:aspect-square flex justify-center items-center col-3 row-1`}
            onClick={nextTrigger}
            type="button"
          >
            <RightArrowIcon
              className={`w-xl aspect-square md:w-md md:h-md text-dark-gray group-hover/button:translate-x-1 transition-all duration-100 hover:duration-300`}
              fill="currentColor"
            />
          </button>
        )}

      </div>
    </div>
  );
};

export default PeopleHighlight;
