"use client";
import Image from "next/image";
import { TextMd, TitleMd, TitleSm, TitleXl } from "@/components/helpers/typography";
import { colorParser } from "@/parsers";
import { Button } from "@/components/helpers/buttons";
import { CaseStudiesTypeThreeProps } from "./case-studies-type-three.types";
import { createIncrementalAnimationAttributes } from "@/components/helpers/animation";

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreak from 'remark-breaks';
import BodyMarkdown from "@/components/helpers/body-markdown/BodyMarkdown";


const CaseStudiesTypeThree: React.FC<CaseStudiesTypeThreeProps> = (props) => {
  const isAnimation = props?.isAnimation || false;
  const isLightAnimation = props?.isLightAnimation || false;
  type AnimatedFieldKey = 'title' | 'button' | 'text'

  const animatedFieldsOrder: AnimatedFieldKey[] = []
  animatedFieldsOrder.push('title')
  if (props?.cta?.length) animatedFieldsOrder.push('button')
  if (props?.text) animatedFieldsOrder.push('text')

  const getAnimationAttributes = createIncrementalAnimationAttributes<AnimatedFieldKey>({
    distances: ['20svh', '12svh', '8svh'],
    negativeOnReverse: false,
    fieldsOrder: animatedFieldsOrder
  })

  const getTabletAnimationAttributes = createIncrementalAnimationAttributes<AnimatedFieldKey>({
    distances: ['20svh', '12svh', '8svh'],
    negativeOnReverse: false,
    fieldsOrder: animatedFieldsOrder,
    start: 'top 80%',
    screenSize: 'mobile-',
    trigger: '.text-container',
    delay: 0.01,
    stagger: true,
    staggerAmount: 0.01
  })

  const getMobileAnimationAttributes = createIncrementalAnimationAttributes<AnimatedFieldKey>({
    distances: ['20svh', '12svh', '8svh'],
    negativeOnReverse: false,
    fieldsOrder: animatedFieldsOrder,
    start: 'top 90%',
    screenSize: 'mobile-',
    trigger: '.text-container',
    delay: 0.01,
    stagger: true,
    staggerAmount: 0.05
  })

  return (
    <div
    data-animation={isAnimation} 
    data-light-animation={isLightAnimation}
    data-section-type="case-studies-type-three"
    data-animation-component  
    className={`${isAnimation || isLightAnimation ? 'invisible' : ''} min-h-full xl:h-full w-full relative flex flex-col justify-start items-start overflow-clip`} style={{
        zIndex: props.index
      }}>
      <div className={`relative flex md:flex-col gap-x-xl w-full justify-stretch h-full items-start max-h-[120vh] flex-col md:overflow-visible overflow-hidden`}>

        {props?.media3Src && <div
          data-animation-atoms
          data-from='{"clipPath": "inset(100% 0 0 0)"}'
          data-middle='{"clipPath": "inset(0% 0 0 0)"}'
          data-to='{"clipPath": "inset(100% 0 0 0)"}'
          data-mobile-from='{"clipPath": "inset(100% 0 0 0)"}'
          data-mobile-middle='{"clipPath": "inset(0% 0 0 0)"}'
          className="absolute right-0 top-[20%] md:top-0 w-[11vw] md:w-[5vw] h-full z-5"
        >
          {
            props?.media3Type === "video" ? <video
              src={props?.media3Src}
              autoPlay
              loop
              muted
              playsInline
              preload="auto"
              className="w-full h-full object-cover"
            /> : <Image unoptimized src={props?.media3Src} alt={props?.media3Alt || ""}  width={props?.media3Width || 1197} height={props?.media3Height || 898} className="w-full max-w-none object-cover h-full" />
          }
        </div>}

        <div className="w-[85%] md:w-[80%] relative z-1 my-auto">
          <div
            className="text-container pt-4xl px-sm md:px-xl flex-1 justify-center w-full mb-lg flex flex-col gap-y-sm relative ">

            {props?.title &&
                <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreak]} 
                    components={{
                        p: ({ children }) => <TitleMd className="font-weight-[400]"
                        attributes={{
                          ...getAnimationAttributes('title'),
                          ...getTabletAnimationAttributes('title'),
                          ...getMobileAnimationAttributes('title'),
                        }}>{children}</TitleMd>,
                        strong: ({children}) => <TitleMd as="span" className={`text-${props?.color || 'yellow'}`}>{children}</TitleMd>
                    }}
                > 
                    {props?.title}
                </ReactMarkdown> 
            }

            {props?.text &&
              <TextMd
                className="!mb-0 2xl:max-w-[70%]"
                attributes={{
                  ...getAnimationAttributes('text'),
                  ...getTabletAnimationAttributes('text'),
                  ...getMobileAnimationAttributes('text'),
                }}
              >
                {props?.text}
              </TextMd>
            }
            <div className="flex flex-row gap-xs flex-wrap mt-sm">
              {
                props?.cta?.map((button, index) => {
                  return (
                    <Button
                      attributes={{
                        ...getAnimationAttributes('button'),
                        ...getTabletAnimationAttributes('button'),
                        ...getMobileAnimationAttributes('button'),
                      }}
                      key={index}
                      icon={button.icon || 'right-arrow'}
                      type={button.type || 'filled'}
                      backgroundColor={`bg-${props?.color || 'dark-gray'}`}
                      textColor={button.type == "text" ? `text-${props?.color || 'yellow'}` : "text-white"}
                      href={button.href}
                      
                    >{button.text}</Button>
                  )
                })
              }
            </div>
          </div>
        </div>

        <div className="relative z-1 flex justify-start items-end flex-col md:flex-row h-auto w-full image-container">

          {props?.mediaSrc && <div
              data-animation-atoms
              data-from='{"y": "10%"}'
              data-middle='{"y": "0%" }'
              data-to='{"y": "-50%"}'
              data-mobile-from='{"y": "10%"}'
              data-mobile-middle='{"y": "0%" }'
              className="w-[45vw] md:w-[30vw] overflow-hidden relative md:right-0 right-[11vw]">
              
              {props?.media1Type == 'image' && props?.mediaSrc && <Image unoptimized src={props?.mediaSrc} alt={props?.mediaAlt || ""} width={props?.mediaWidth || 942} height={props?.mediaHeight || 418} className="w-full object-cover object-left-top max-w-none h-[30vw] md:h-[20vw]" />}
              {props?.media1Type == 'video' && props?.mediaSrc && <video src={props?.mediaSrc} autoPlay loop muted playsInline preload="auto" className="w-full object-cover object-left-top max-w-none h-[30vw] md:h-[20vw]" />}

            </div>

          }
          {props?.media2Src && <div
              data-animation-atoms
              data-from='{"clip-path": "inset(0 0% 0 100%)"}'
              data-middle='{"clip-path": "inset(0 0% 0 0%)"}'
              data-to='{"clip-path": "inset(0 0% 0 100%)"}'
              data-mobile-trigger=".image-container"
              data-mobile-start="top 80%"
              data-mobile-from='{"clip-path": "inset(0 0% 0 100%)"}'
              data-mobile-middle='{"clip-path": "inset(0 0% 0 0%)"}'
              data-mobile-to='{"clip-path": "inset(0 0% 0 100%)"}'
              className="image-2 w-full md:w-[65vw] h-auto overflow-hidden z-1">
                {
                  props?.media2Type == 'image' && props?.media2Src && <Image unoptimized src={props?.media2Src} alt={props?.media2Alt || ""} width={props?.media2Width || 963} height={props?.media2Height || 449} className="w-full md:max-h-[60vh] object-cover h-auto" />
                }
                {
                  props?.media2Type == 'video' && props?.media2Src && <video src={props?.media2Src} autoPlay loop muted playsInline preload="auto" className="w-full md:max-h-[60vh] object-cover h-auto" />
                }
            </div>
          }

        </div>

      </div>
    </div>
  );
};

export default CaseStudiesTypeThree;
