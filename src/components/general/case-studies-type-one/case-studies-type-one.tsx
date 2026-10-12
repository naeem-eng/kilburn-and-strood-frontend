"use client";
import Image from "next/image";
import { CaseStudiesTypeOneProps } from "./case-studies-type-one.types";
import { TitleMd } from "@/components/helpers/typography";
import { colorParser } from "@/parsers";
import { Button } from "@/components/helpers/buttons";

import { createIncrementalAnimationAttributes } from "@/components/helpers/animation";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreak from 'remark-breaks';
import BodyMarkdown from "@/components/helpers/body-markdown/BodyMarkdown";
import ImageReveal from "@/components/interactive/image-reveal/ImageReveal";


const CaseStudiesTypeOne: React.FC<CaseStudiesTypeOneProps> = (props) => {
  const isAnimation = props?.isAnimation || false;
  const isLightAnimation = props?.isLightAnimation || false;
  type AnimatedFieldKey = 'title' | 'text' | 'button'

  const animatedFieldsOrder: AnimatedFieldKey[] = []
  if (props?.title) animatedFieldsOrder.push('title')
  if (props?.text) animatedFieldsOrder.push('text')
  if (props?.cta?.length) animatedFieldsOrder.push('button')

  const getAnimationAttributes = createIncrementalAnimationAttributes<AnimatedFieldKey>({
    distances: ['20svh', '12svh'],
    fieldsOrder: animatedFieldsOrder
  })

  const getTabletAnimationAttributes = createIncrementalAnimationAttributes<AnimatedFieldKey>({
    distances: ['10svh', '10svh'],
    negativeOnReverse: false,
    fieldsOrder: animatedFieldsOrder,
    start: 'top 80%',
    screenSize: 'mobile-',
    trigger: '.text-container',
    delay: 0.1,
    stagger: true,
    staggerAmount: 0.05
  })

  const getMobileAnimationAttributes = createIncrementalAnimationAttributes<AnimatedFieldKey>({
    distances: ['10svh', '10svh'],
    negativeOnReverse: false,
    fieldsOrder: animatedFieldsOrder,
    start: 'top 90%',
    screenSize: 'mobile-',
    trigger: '.text-container',
    delay: 0.1,
    stagger: true,
    staggerAmount: 0.05
  })



  return (
    <div
      data-animation={isAnimation} 
      data-light-animation={isLightAnimation}
      data-section-type="case-studies-type-one"
      data-animation-component  
      className={`${isAnimation || isLightAnimation ? 'invisible' : ''} caseStudiesTypeOne relative overflow-hidden h-full w-full grid grid-cols-6 grid-rows-[1fr_auto_auto] md:grid-rows-unset md:grid-cols-12 gap-x-4 px-(--padding-side)  items-end`}
      style={{
        zIndex: props.index
      }}>

      <div
        data-animation-atoms
        data-from='{"y": "-20%"}'
        data-middle='{"y": "0%" }'
        data-to='{"y": "-20%"}'
        data-mobile-from='{"y": "-10%"}'
        data-mobile-middle='{"y": "0%" }'
        className="col-span-2 -ml-(--padding-side) -mr-4  min-h-0 max-h-[80%]">
        {
          props?.media2Type === "image" && props?.media2Src &&
          <Image
            unoptimized
            src={props?.media2Src}
            alt={props?.media2Alt || ''}
            width={props?.media2Width || 0}
            height={props?.media2Height || 0}
            className="w-full object-cover h-full object-center max-h-[25rem] md:max-h-none"
          />
        }
        {
          props?.media2Type === "video" && props?.media2Src &&
          <video
            src={props?.media2Src}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="w-full object-cover h-full object-center max-h-[25rem] md:max-h-none"
          />
        }
      </div>
      <div
        data-animation-atoms
        data-from='{"clip-path": "inset(100% 0% 0%)"}'
        data-middle='{"clip-path": "inset(0% 0% 0%)"}'
        data-to='{"clip-path": "inset(0% 0% 100%)"}'
        data-mobile-from='{"clip-path": "inset(100% 0% 0%)"}'
        data-mobile-middle='{"clip-path": "inset(0% 0% 0%)"}'
        data-mobile-to='{"clip-path": "inset(0% 0% 100%)"}'
        className="col-span-4 -mr-4 md:-mr-0 md:col-span-5 self-end min-h-0 max-h-full bg-black h-full">
        {
          props?.media1Type === "image" && props?.mediaSrc &&
            props?.revealImage ? (
              <ImageReveal
                src={props.mediaSrc!}
                alt={props?.mediaAlt || "Image 1"}
                width={props?.mediaWidth || 0}
                height={props?.mediaHeight || 0}
                revealSrc={props?.revealImage}
                wrapperProps={{className: "w-full h-full"}}
                className="w-full max-w-none max-h-[33rem] xl:max-h-[85vh] object-cover min-h-full"
            />
          )
           :
            props?.mediaSrc && <Image
              unoptimized
              src={props?.mediaSrc}
              alt={props?.mediaAlt || ''}
              width={props?.mediaWidth || 0}
              height={props?.mediaHeight || 0}
              className="w-full max-w-none max-h-[33rem] xl:max-h-[85vh] object-cover min-h-full"
            />
        }

        {
          props?.media1Type === "video" && props?.mediaSrc &&
          <video
            src={props?.mediaSrc}
            autoPlay
            loop
            muted
            playsInline
            preload="auto"
            className="w-full max-w-none max-h-[33rem] xl:max-h-[85vh] object-cover min-h-full"
          />
        }
      </div>

      <div
        className="px-sm py-2xl col-span-6 sm:col-span-5 relative self-center text-container">
        {props?.title &&
              <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreak]} 
                  components={{
                      p: ({ children }) => <TitleMd className="mb-md"
                                          attributes={{
                                            ...getAnimationAttributes('title'),
                                            ...getTabletAnimationAttributes('title'),
                                            ...getMobileAnimationAttributes('title')
                                          }} >{children}</TitleMd>,
                      strong: ({children}) => <TitleMd as="span" className={`text-${props?.color || 'yellow'}`}>{children}</TitleMd>
                  }}
              > 
                  {props?.title}
              </ReactMarkdown> 
          }
         {props?.text &&
            <BodyMarkdown
              className="xl:max-w-[80%]"
              attributes={{
                ...getAnimationAttributes('text'),
                ...getTabletAnimationAttributes('text'),
                ...getMobileAnimationAttributes('text')
              }}
              color={props?.color}
            >
              {props?.text}
            </BodyMarkdown>
          } 
          <div className="mt-sm">
            {props?.cta && props?.cta?.map((cta: any, index: number) => {
              return (
                <Button
                  key={index}
                  attributes={{
                    ...getAnimationAttributes('button'),
                    ...getTabletAnimationAttributes('button'),
                    ...getMobileAnimationAttributes('button')
                  }}
                  icon='right-arrow'
                  type={cta?.type || "text"}
                  textColor="text-[var(--dynamic-colors)] font-modern-era-medium!"
                  style={{ "--dynamic-colors": colorParser(props?.color || 'dark-gray') }}
                  dynamicIconColor={colorParser(props?.color)}
                  href={cta?.href || '#'}
                >
                  {cta?.text}
                </Button>
              )
            })}
        </div>
      </div>
      <div data-animation-atoms
        data-from='{"scaleY": "0"}'
        data-middle='{"scaleY": "1"}'
        data-mobile-trigger=".text-container"
        data-mobile-start="bottom bottom"
        data-to='{"scaleY": "0"}'
        data-mobile-from='{"scaleY": "0"}'
        data-mobile-middle='{"scaleY": "1"}'
        className={`bg-${props?.color} md:w-3xl h-24 -mt-8 md:h-[20vh] col-[span_1/-1] md:col-[span_2/-1] row-[span_1/-1] -mr-(--padding-side) md:-mr-0 md:absolute bottom-0 -right-lg`}
      >
      </div>
    </div>
  );
};

export default CaseStudiesTypeOne;
