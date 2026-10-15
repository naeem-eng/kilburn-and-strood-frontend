"use client";

import { TextMd, TextXl, TitleLg, TitleMd, TitleSm } from "@/components/helpers/typography";
import { TextImageSliderProps } from "./text-image-slider.types";
import { colorParser, textSafeColor } from "@/parsers";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/helpers/buttons";
import { LeftArrowIcon, RightArrowIcon } from "@/components/helpers/icons";
import { createIncrementalAnimationAttributes } from "@/components/helpers/animation";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreak from 'remark-breaks';
import BodyMarkdown from "@/components/helpers/body-markdown/BodyMarkdown";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FullPageSliderContext } from "@/components/interactive/fullpage";

const TextImageSlider: React.FC<TextImageSliderProps> = (props) => {
  const isAnimation = props?.isAnimation || false;
  const isLightAnimation = props?.isLightAnimation || false;
  type AnimatedFieldKey = 'label' | 'title'

  const animatedFieldsOrder: AnimatedFieldKey[] = []
  if (props?.label) animatedFieldsOrder.push('label')
  if (props?.title) animatedFieldsOrder.push('title')

  const getAnimationAttributes = createIncrementalAnimationAttributes<AnimatedFieldKey>({
    distances: ['20svh', '18svh'],
    fieldsOrder: animatedFieldsOrder,
    negativeOnReverse: false
  })

  const getMobileAnimationAttributes = createIncrementalAnimationAttributes<AnimatedFieldKey>({
    distances: ['10svh', '8svh'],
    negativeOnReverse: false,
    fieldsOrder: animatedFieldsOrder,
    screenSize: 'mobile-'
  })

  type SlideTextFieldKey = 'slideTitle' | 'slideText' | 'slideButton'

  const slideTextFieldsOrder: SlideTextFieldKey[] = ['slideTitle', 'slideText', 'slideButton']

  const getSlideTextAnimationAttributes = createIncrementalAnimationAttributes<SlideTextFieldKey>({
    distances: ['20svh', '15svh', '10svh'],
    fieldsOrder: slideTextFieldsOrder,
    negativeOnReverse: false
  })

  const getSlideTextMobileAnimationAttributes = createIncrementalAnimationAttributes<SlideTextFieldKey>({
    distances: ['15svh', '10svh', '5svh'],
    negativeOnReverse: false,
    fieldsOrder: slideTextFieldsOrder,
    screenSize: 'mobile-'
  })

  const [currentIndex, setCurrentIndex] = useState(0);
  const [mobileSliderHeight, setMobileSliderHeight] = useState<number | null>(null);
  const sliderContainerRef = useRef<HTMLDivElement>(null);
  const innerSliderContainerRef = useRef<HTMLDivElement>(null);
  const slideRefs = useRef<Array<HTMLDivElement | null>>([]);

  const fullPageReinit = useContext(FullPageSliderContext);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    fullPageReinit?.reinit();
  }, [props?.items?.length, fullPageReinit]);

  const nextTrigger = () => {
    if (currentIndex >= props?.items?.length - 1) return;
    setCurrentIndex(currentIndex + 1);
    ScrollTrigger.refresh();
  }

  const prevTrigger = () => {
    if (currentIndex <= 0) return;
    setCurrentIndex(currentIndex - 1);
    ScrollTrigger.refresh();
  }

  const bulletTrigger = (index: number) => {
    setCurrentIndex(index);
    ScrollTrigger.refresh();
  }

  const updateMobileSliderHeight = useCallback(() => {
    if (typeof window === "undefined") return;

    if (window.innerWidth >= 768) {
      setMobileSliderHeight(null);
      return;
    }

    const activeSlide = slideRefs.current[currentIndex];
    if (!activeSlide) return;

    // Wait a frame so layout and media sizing settle before measuring.
    requestAnimationFrame(() => {
      setMobileSliderHeight(activeSlide.offsetHeight);
    });
  }, [currentIndex]);

  useEffect(() => {
    updateMobileSliderHeight();
  }, [updateMobileSliderHeight, props?.items?.length]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const onResize = () => updateMobileSliderHeight();
    window.addEventListener("resize", onResize);

    return () => window.removeEventListener("resize", onResize);
  }, [updateMobileSliderHeight]);

  useEffect(() => {
    if (typeof window === "undefined" || window.innerWidth >= 768) return;

    const activeSlide = slideRefs.current[currentIndex];
    if (!activeSlide || typeof ResizeObserver === "undefined") return;

    const resizeObserver = new ResizeObserver(() => updateMobileSliderHeight());
    resizeObserver.observe(activeSlide);

    return () => resizeObserver.disconnect();
  }, [currentIndex, updateMobileSliderHeight]);


  const TextImageSliderItemComponent = useCallback(({ item, active, textActive, activeIndex, index }: { item: TextImageSliderProps['items'][0], active: boolean, textActive: boolean, activeIndex: number, index: number }) => {
    return (
      <div
        ref={(el) => {
          slideRefs.current[index] = el;
        }}
        inert={activeIndex !== index}
        aria-roledescription="slide"
        aria-label={`${index + 1} of ${props?.items?.length}`}
        className={`h-full min-w-[80vw] w-[80vw] flex-col md:flex-row flex md:gap-x-lg transform ${active ? 'scale-100 opacity-100' : 'scale-60 md:translate-y-[-8vw]'} origin-top-left transition-all duration-500 ease-in-out `}
      >
        {item.imageSrc && <div
          className="flex-1 aspect-video md:aspect-auto md:min-h-full md:min-w-[45vw] md:w-[45vw] w-[94%] min-w-[94%] relative z-1"
          data-animation-atoms
          data-from={active ? '{"y": "50%"}' : '{"x": "50%"}'}
          data-middle='{"y": "0%", "x": "0%" }'
          data-to={active ? '{"y": "-50%"}' : '{"x": "50%"}'}
          data-mobile-from='{"y": "50%"}'
          data-mobile-middle='{"y": "0%", "x": "0%" }'
          data-mobile-to='{"y": "-50%"}'
        >
          <Image unoptimized={true} src={item.imageSrc} alt={item.imageAlt || ""} width={item?.imageWidth || 710} height={item?.imageHeight || 473} className="absolute inset-0 w-full h-full object-cover" />
        </div>}
        <div className={
          `flex-1 flex gap-y-sm flex-col mt-2xl md:mt-0 md:mr-2xl px-sm md:px-0 transition-all md:pb-sm  ${textActive ? 'duration-500 opacity-100' : 'duration-300 transition-delay-1000 opacity-0'} ${activeIndex === index ? 'translate-y-0' : activeIndex > index ? 'translate-y-1/4 -translate-x-full' : '-translate-y-1/4 translate-x-full'}`
        }>
          {item.title && (

            <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreak]}
              components={{
                p: ({ children }) => <TextXl attributes={textActive ? { ...getSlideTextAnimationAttributes('slideTitle'), ...getSlideTextMobileAnimationAttributes('slideTitle') } : {}} className={`text-dark-gray  ${isAnimation ? 'line-clamp-10' : ''}`}>{children}</TextXl>,
                strong: ({ children }) => <TextXl as="span" className={`text-${textSafeColor(props?.color || 'dark-gray')}`}>{children}</TextXl>
              }}
            >
              {item.title}
            </ReactMarkdown>
          )}
          
          {item.text && <BodyMarkdown
            color={props?.color || 'bright-red'}
            components={{
              p: ({ children }) => <TextMd
                className={`text-dark-gray line-clamp-10 ${isAnimation ? 'xl:line-clamp-10' : ''}`}
                attributes={textActive ? { ...getSlideTextAnimationAttributes('slideText'), ...getSlideTextMobileAnimationAttributes('slideText') } : {}}
              >
                {children}
              </TextMd>,
            }}
          >{item.text}</BodyMarkdown>}
          {
            item.cta && <Button icon='right-arrow' textColor={`text-${textSafeColor(props?.color || 'dark-gray')}`} buttonClassName="mt-0" type={item.cta.type} href={item.cta.href} attributes={{ ...getSlideTextAnimationAttributes('slideButton'), ...getSlideTextMobileAnimationAttributes('slideButton') }} >
              {item.cta.text}
            </Button>
          }
        </div>
      </div>
    )
  }, []);

  return (
    <div
      data-animation={isAnimation}
      data-light-animation={isLightAnimation}
      data-section-type="text-image-slider"
      data-animation-component
      className={`${isAnimation || isLightAnimation ? 'invisible' : ''} ${props?.className || ''} overflow-hidden md:min-h-full xl:min-h-svh w-full relative pt-(--padding-top) justify-start items-start grid grid-cols-6 md:grid-cols-12 gap-x-4 gap-y-8 grid-rows-[auto_1fr_var(--padding-side)]`} style={{
        zIndex: props.index
      }}>

      <div className="w-full flex flex-col gap-y-sm px-(--padding-side) col-span-full md:col-span-10">
        {props?.label &&
          <TextMd
            className={`text-${textSafeColor(props?.color || 'dark-gray')} `}
            attributes={{ ...getAnimationAttributes('label'), ...getMobileAnimationAttributes('label') }}
          >
            {props?.label}
          </TextMd>
        }

        <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreak]}
          components={{
            p: ({ children }) => <TitleSm attributes={{ ...getAnimationAttributes('title'), ...getMobileAnimationAttributes('title') }} className="text-dark-gray text-left max-w-fit">{children}</TitleSm>,
            strong: ({ children }) => <TitleSm as="span" className={`text-${textSafeColor(props?.color || 'dark-gray')}`}>{children}</TitleSm>
          }}
        >
          {props.title}
        </ReactMarkdown>

      </div>

      <div
        ref={sliderContainerRef}
        className="w-full md:h-full lg:mt-md mt-0 relative md:flex col-span-full"
      >
        <div
          className=" w-full md:h-full lg:mt-md mt-0 relative md:flex col-span-full transition-[height] duration-300"
          style={{ height: mobileSliderHeight ? `${mobileSliderHeight}px` : undefined }}
        >
          <div
            ref={innerSliderContainerRef}
            className="relative flex flex-row w-full gap-x-0 justify-start transform transition-transform duration-500 ease-in-out min-h-full md:items-stretch"
            style={{ transform: `translateX(-${currentIndex * 80}vw)` }}
          >
            {props?.items?.map((item, index) => {
              return <TextImageSliderItemComponent active={currentIndex >= index} key={index} textActive={currentIndex === index} item={item} activeIndex={currentIndex} index={index} />;
            })}
          </div>
        </div>
        <div className="relative z-20 md:absolute px-sm md:px-2xl bottom-5 md:bottom-0 right-0 w-full md:w-[55.5vw] flex flex-row items-center md:items-end justify-center md:mt-0 mt-2xl pointer-events-auto flex-wrap gap-5">
          <div className="flex flex-1 flex-row gap-x-xs items-start justify-start overflow-x-auto">
            {props?.items?.length > 1 && props?.items?.map((item, index) => {
              return <button type="button" onClick={() => bulletTrigger(index)} aria-label={`Go to slide ${index + 1}`} aria-current={index === currentIndex ? "true" : undefined} key={index} className={`cursor-pointer w-[4vw] h-[1vw] md:w-[1.2vw] md:h-[.24vw] bg-dark-gray opacity-20 ${index == currentIndex ? "w-[8vw] md:w-[2.8vw] opacity-100" : "hover:opacity-50"} transition-all duration-500 ease-in-out`} ></button>;
            })}
          </div>
          {props?.items?.length > 1 && <div className="flex gap-x-sm mr-0 ml-auto">
            {<button onClick={prevTrigger} aria-label="Previous Slide" className="disabled:opacity-50 w-12 h-12 md:w-auto md:h-auto flex items-center justify-center rounded-md border border-transparent" type="button" disabled={currentIndex > 0 ? false : true}><LeftArrowIcon className={`w-xl h-xl md:w-md md:h-md text-dark-gray`} /></button>}
            {<button aria-label="Next Slide" className="disabled:opacity-50 w-12 h-12 md:w-auto md:h-auto flex items-center justify-center rounded-md border border-transparent" onClick={nextTrigger} disabled={currentIndex < props?.items?.length - 1 ? false : true} type="button"><RightArrowIcon className={`w-xl h-xl md:w-md md:h-md text-dark-gray`} /></button>}
          </div>}
        </div>
      </div>
    </div>
  );
};

export default TextImageSlider;
