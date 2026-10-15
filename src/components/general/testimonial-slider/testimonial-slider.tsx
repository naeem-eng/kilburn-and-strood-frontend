"use client";
import { Small, Text, TitleMd } from "@/components/helpers/typography";
import Image from "next/image";
import { useState, useEffect } from "react";
import { TestimonialSliderProps } from "./testimonial-slider.types";
import { flushSync } from "react-dom";
import { LeftArrowIcon, RightArrowIcon } from "@/components/helpers/icons";
import Button from "@/components/helpers/buttons/buttons";
import { createIncrementalAnimationAttributes } from "@/components/helpers/animation";

const TestimonialSlider: React.FC<TestimonialSliderProps> = (props) => {
  const isAnimation = props?.isAnimation || false;
  const isLightAnimation = props?.isLightAnimation || false;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [nextIndex, setNextIndex] = useState<number | null>(null);
  const [isDirectionLeft, setIsDirectionLeft] = useState(false);
  const [transitionPhase, setTransitionPhase] = useState<'start' | 'animating'>('start')

  if (!props.testimonials || props.testimonials.length === 0) return null;

  const currentTestimonial = props.testimonials[currentIndex];

  const viewTransitionsSupported = typeof document !== 'undefined' && 'startViewTransition' in document;

  useEffect(() => {
    if (viewTransitionsSupported) return;
    if (!isTransitioning) return
    const raf = requestAnimationFrame(() => setTransitionPhase('animating'))
    return () => cancelAnimationFrame(raf)
  }, [isTransitioning])

  const goToSlide = (index: number) => {
    if (index === currentIndex || isTransitioning) return
    const directionLeft = (currentIndex === index + 1) || (currentIndex === 0 && index === props.testimonials.length - 1)
    setIsDirectionLeft(directionLeft)
    if (viewTransitionsSupported) {
      document.documentElement.setAttribute('data-direction', directionLeft ? 'left' : 'right')
    }
    setNextIndex(index)
    setIsTransitioning(true)
    setTransitionPhase('start')
    setTimeout(() => {
      setCurrentIndex(index)
      setNextIndex(null)
      setIsTransitioning(false)
      setTransitionPhase('start')
    }, 500)
  };

  const changeSlides = (index: number) => {
    if (index === currentIndex || isTransitioning) return
    if (viewTransitionsSupported) {
      const directionLeft = (currentIndex === index + 1) || (currentIndex === 0 && index === props.testimonials.length - 1)
      document.documentElement.setAttribute('data-active-view-transition', 'testimonialSlider')
      document.documentElement.setAttribute('data-direction', directionLeft ? 'left' : 'right')
      const transition = document.startViewTransition(() => {
        flushSync(() => {
          setCurrentIndex(index)
          setNextIndex(null)
          setIsTransitioning(false)
          setIsDirectionLeft(directionLeft)
        })
      })
      transition.finished.then(() => {
        document.documentElement.removeAttribute('data-active-view-transition')
        document.documentElement.removeAttribute('data-direction')
      })
    } else {
      goToSlide(index)
    }
  }

  const goToPrevious = () => {
    const newIndex =  currentIndex - 1;
    changeSlides(newIndex);
  };

  const goToNext = () => {
    const newIndex = (currentIndex + 1);
    changeSlides(newIndex);
  };

  type BlockquoteFieldKey = 'quote' | 'name' | 'role' | 'controls'

  const blockquoteAnimatedFieldsOrder: BlockquoteFieldKey[] = ['quote', 'name', 'role', 'controls']

  const getBlockquoteAnimationAttributes = createIncrementalAnimationAttributes<BlockquoteFieldKey>({
    distances: ['14%', '12%', '10%', '8%'],
    negativeOnReverse: false,
    fieldsOrder: blockquoteAnimatedFieldsOrder,
    axis: 'x'
  })
  const getMobileBlockquoteAnimationAttributes = createIncrementalAnimationAttributes<BlockquoteFieldKey>({
    distances: ['10%', '8%', '6%', '4%'],
    negativeOnReverse: false,
    fieldsOrder: blockquoteAnimatedFieldsOrder,
    axis: 'x',
    screenSize: 'mobile-',
    trigger: '.blockquote-container',
    start: 'top 95%'
  })

  const getGridColClass = (quote: string) => {
    const quoteLength = quote.length;
    if (quoteLength < 100) {
      return 'md:col-[span_6/13] xl:col-[span_3/10]'; // small
    } else if (quoteLength < 280) {
      return 'md:col-[span_7/12] xl:col-[span_4/11]'; // default
    } else if (quoteLength < 420) {
      return 'md:col-[span_7/12] xl:col-[span_5/12]';
     } else {
      return 'md:col-[span_7/14]'; // large
    }
  };

  const renderBlockquote = (
    testimonial: (typeof props.testimonials)[0],
    slideClass: string,
    absolute = true,
  ) => (
    <blockquote
      key={testimonial.name}
      className={`flex flex-col gap-4 text-white transition-all duration-500 ${absolute ? "absolute inset-0" : "relative"} ${slideClass}`}
    >
      <Text
        className="!font-gt-ultra blockquote"
        textSize="text-md"
        attributes={{
          ...getBlockquoteAnimationAttributes("quote"),
          ...getMobileBlockquoteAnimationAttributes("quote"),
        }}
      >
        {testimonial.publicationLink ? (
          <a
            href={testimonial.publicationLink}
            target="_blank"
            rel="noopener noreferrer"
            className="group block"
          >
            <span dangerouslySetInnerHTML={{ __html: testimonial.quote }} />
          </a>
        ) : (
          <span dangerouslySetInnerHTML={{ __html: testimonial.quote }} />
        )}
      </Text>
      <cite className="not-italic mt-auto cite flex flex-col gap-1">
        <Small
          className="font-modern-era font-bold leading-[1.5]"
          attributes={{
            ...getBlockquoteAnimationAttributes("name"),
            ...getMobileBlockquoteAnimationAttributes("name"),
          }}
        >
          {testimonial.profileLink ? (
            <Button
              type="text"
              icon="right-arrow"
              href={testimonial.profileLink}
              isExternal={testimonial.isExternalProfile}
              attributes={testimonial.isExternalProfile ? { rel: "noopener noreferrer" } : undefined}
              textColor="text-white"
              dynamicIconColor="white"
              buttonClassName="font-bold leading-[1.5] !text-xs sm:!text-sm font-modern-era"
            >
              {testimonial.name}
            </Button>
          ) : (
            testimonial.name
          )}
        </Small>
        <Small
          className="font-modern-era leading-[1.5]"
          attributes={{
            ...getBlockquoteAnimationAttributes("role"),
            ...getMobileBlockquoteAnimationAttributes("role"),
          }}
        >
          {testimonial.role}
        </Small>
      </cite>
    </blockquote>
  );

  return (
    <div
      data-animation={isAnimation}
      data-light-animation={isLightAnimation}
      data-section-type="testimonial-slider"
      data-animation-component
      data-primary-header
      className={`${isAnimation || isLightAnimation ? 'invisible' : ''} testimonialSlider min-h-[45rem] md:min-h-[40rem] w-full xl:h-svh relative grid items-end grid-cols-6 grid-rows-[auto_1fr_3.25rem_auto] md:grid-rows-[auto_1fr] md:grid-cols-12 gap-x-4 gap-y-0 md:gap-y-8 pt-(--padding-top) pb-8 xl:pb-16 px-(--padding-side) background-white overflow-clip`}
      style={{ zIndex: props.index }}
    >
      {props.title &&
        <TitleMd
          data-animation-atoms
          data-from='{"y": "-60%"}'
          data-middle='{"y": "0%" }'
          data-to='{"y": "60%"}'
          className="col-span-full md:col-span-8 row-1 pb-6 md:pb-0"
        >
          {props.title}
        </TitleMd>}
      {/* LEFT IMAGE SECTION */}
      <div
        className={`relative h-full col-span-full md:col-[1/span_7] row-[2/span_2] md:row-2 -ml-(--padding-side)`}
        data-animation-atoms
        data-from='{"y": "60%"}'
        data-middle='{"y": "0%" }'
        data-to='{"y": "-60%"}'
        data-mobile-from='{"y": "10%"}'
        data-mobile-middle='{"y": "0%"}'
      >
        <div className="relative w-[95%] h-full overflow-clip">
          {currentTestimonial.imageSrc && <Image
            key={currentIndex}
            src={currentTestimonial.imageSrc}
            alt={currentTestimonial.imageAlt || ""}
            fill
            className={`image w-full h-full object-cover`}
            data-animation-atoms
            data-mobile-from='{"scale": "1.1"}'
            data-mobile-middle='{"scale": "1"}'
          />}
          <img
            src="/icons/quote.svg" alt="" className="quote absolute top-6 md:top-16 left-(--padding-side) w-8 md:w-16 h-auto"
            data-animation-atoms
            data-mobile-from='{"y": "100%"}'
            data-mobile-middle='{"y": "0%"}'
          />
        </div>
      </div>
      {/* RIGHT TEXT SECTION */}
      <div className={`col-span-full ${getGridColClass(currentTestimonial.quote)} row-[3/span_2] md:row-2 blockquote-container md:pt-(--padding-top)`}>
        <div
          className={`w-full relative flex flex-col gap-6 md:gap-10 justify-end items-start p-(--spacing-xl) pr-6 md:pr-(--padding-side) md:pb-8 bg-dark-red overflow-clip`}
          data-animation-atoms
          data-from='{"x": "60%"}'
          data-middle='{"x": "0%"}'
          data-to='{"x": "60%"}'
        >
          <div className="text-container relative overflow-clip">
            {!isTransitioning || viewTransitionsSupported ? (
              renderBlockquote(currentTestimonial, 'translate-x-0 opacity-100', false)
            ) : nextIndex !== null ? (
              <>
                {renderBlockquote(
                  currentTestimonial,
                  transitionPhase === 'start'
                    ? 'translate-x-0 opacity-100'
                    : `opacity-0 ${isDirectionLeft ? 'translate-x-full' : '-translate-x-full'}`,
                  true
                )}
                {renderBlockquote(
                  props.testimonials[nextIndex],
                  transitionPhase === 'start'
                    ? `opacity-0 ${isDirectionLeft ? '-translate-x-full' : 'translate-x-full'}`
                    : 'translate-x-0 opacity-100',
                  false
                )}
              </>
            ) : null}
          </div>
          {props.testimonials?.length>1&&<div
            className="controls-container flex flex-wrap gap-sm justify-between items-center w-full"
            {...getBlockquoteAnimationAttributes('controls')}
            {...getMobileBlockquoteAnimationAttributes('controls')}
          >
            <div className="flex flex-wrap gap-1.5">
              {props.testimonials.map((_, index) => (
                <button
                  key={index}
                  aria-current={index === currentIndex ? "true" : undefined}
                  onClick={() => changeSlides(index)}
                  aria-label={`Go to slide ${index + 1}`}
                  className={`cursor-pointer transition-all duration-300 h-[3px] bg-white ${index === currentIndex
                    ? 'opacity-100 w-7'
                    : 'opacity-35 w-[1rem] hover:opacity-50 duration-100 hover:duration-300'
                    }`}
                />
              ))}
            </div>
            <div className="flex gap-4">
              { <button type="button" onClick={goToPrevious} aria-label="Previous Slide" className={`cursor-pointer hover:-translate-x-1 transition-all duration-100 hover:duration-300 ${( currentIndex > 0)  ? '' : 'invisible'}`}>
                <LeftArrowIcon className="w-auto h-7" fill="white" />
              </button>}
              { <button type="button" onClick={goToNext} aria-label="Next Slide" className={`cursor-pointer hover:translate-x-1 transition-all duration-100 hover:duration-300 ${(currentIndex < props.testimonials.length - 1) ? '' : 'invisible'}`}>
                <RightArrowIcon className="w-auto h-7" fill="white" />
              </button>}
            </div>
          </div>}
        </div>
      </div>
    </div>
  );
};

export default TestimonialSlider;
