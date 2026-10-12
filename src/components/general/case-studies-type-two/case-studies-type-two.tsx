"use client";
import Image from "next/image";
import { TitleMd, TitleSm, TitleXl } from "@/components/helpers/typography";
import { colorParser } from "@/parsers";
import { Button } from "@/components/helpers/buttons";
import { CaseStudiesTypeTwoProps } from "./case-studies-type-two.types";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreak from 'remark-breaks';
import { createIncrementalAnimationAttributes } from "@/components/helpers/animation";
import BodyMarkdown from "@/components/helpers/body-markdown/BodyMarkdown";
import React, { useRef, useEffect } from "react";

const CaseStudiesTypeTwo: React.FC<CaseStudiesTypeTwoProps> = (props) => {

  type AnimatedFieldKey = 'title' | 'button' | 'text'

  const animatedFieldsOrder: AnimatedFieldKey[] = []
  if (props?.title) animatedFieldsOrder.push('title')
  if (props?.cta?.length) animatedFieldsOrder.push('button')
  if (props?.text) animatedFieldsOrder.push('text')

  const getAnimationAttributes = createIncrementalAnimationAttributes<AnimatedFieldKey>({
    distances: ['20svh', '12svh'],
    fieldsOrder: animatedFieldsOrder
  })

  const getMobileAnimationAttributes = createIncrementalAnimationAttributes<AnimatedFieldKey>({
    distances: ['10svh', '10svh'],
    negativeOnReverse: false,
    fieldsOrder: animatedFieldsOrder,
    screenSize: 'mobile-',
    trigger: '.text-container',
  })

  const isAnimation = props?.isAnimation || false;
  const isLightAnimation = props?.isLightAnimation || false;
  const sectionRef = useRef<HTMLDivElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateMinHeight = () => {
      if (window.innerWidth < 768 && sectionRef.current && textContainerRef.current) {
        sectionRef.current.style.minHeight = `${textContainerRef.current.offsetHeight + 80}px`;
      } else if (sectionRef.current) {
        sectionRef.current.style.minHeight = "";
      }
    };
    updateMinHeight();
    window.addEventListener("resize", updateMinHeight);
    return () => window.removeEventListener("resize", updateMinHeight);
  }, []);

  return (
    <div
      data-section-type="case-studies-type-two"
      data-animation={isAnimation}
      data-light-animation={isLightAnimation}
      data-animation-component
      className={`${isAnimation || isLightAnimation ? 'invisible' : ''} overflow-clip min-h-full xl:h-full w-full relative flex flex-col  justify-end items-end`}
      style={{
        zIndex: props.index
      }}
    >
      <div className={`relative flex md:flex-row gap-x-xl w-full justify-end items-end h-full flex-col`}>
        {props?.mediaSrc && <div
          data-animation-atoms
          data-from='{"clip-path": "inset(0 0% 0 100%)"}'
          data-middle='{"clip-path": "inset(0 0% 0 0%)"}'
          data-to='{"clip-path": "inset(0 100% 0 0%)"}'
          data-mobile-from='{"clip-path": "inset(0 0% 0 100%)"}'
          data-mobile-middle='{"clip-path": "inset(0 0% 0 0%)"}'
          data-mobile-to='{"clip-path": "inset(0 100% 0 0%)"}'
          className="w-[80vw] h-full relative right-0 top-0 bottom-0 self-end">
          {props?.media1Type === "image" && props?.mediaSrc && <Image unoptimized src={props?.mediaSrc} alt={props?.mediaAlt || "Image 1"} width={props?.mediaWidth || 1197} height={props?.mediaHeight || 898} className="w-full max-w-none object-cover h-full max-h-[100vh]" />
          }
          {props?.media1Type === "video" && props?.mediaSrc && <video src={props?.mediaSrc} autoPlay loop muted playsInline preload="auto" className="w-full max-w-none object-cover h-full max-h-[100vh]" />
          }
        </div>}

        <div ref={sectionRef} className="flex justify-start items-end md:absolute z-10 w-full bottom-0 left-0 relative">

          {/* left image */}
          <div className={`left-0 right-0 md:max-w-[30vw] md:w-[30vw] flex-1  md:relative`} >
            {props?.media2Src && <div
              data-animation-atoms
              data-from='{"x": "-100%", "y": "0%"}'
              data-middle='{"x": "0%", "y": "0%" }'
              data-to='{"y": "-150%"}'
              className="w-full h-full max-w-full">
              {
                props?.media2Type === "image" && props?.media2Src && <Image unoptimized src={props?.media2Src} alt={props?.media2Alt || "Image 2"} width={props?.media2Width || 496} height={props?.media2Height || 301} className="w-full max-w-full object-cover min-h-[15%]" />
              }
              {
                props?.media2Type === "video" && props?.media2Src && <video src={props?.media2Src} autoPlay loop muted playsInline preload="auto" className="w-full max-w-full object-cover min-h-[15%]" />
              }
            </div>}
            <div
              data-animation-atoms
              data-from='{"y": "200%", "x": "0%"}'
              data-middle='{"y": "0%", "x": "0%"}'
              data-to='{"y": "-200%", "x": "0%"}'
              className={`md:block hidden absolute bottom-0 right-0 top-0 h-full w-[5vw] bg-${props.color}`} />
          </div>
          {/* left image */}

          {/* left image */}
          <div
            ref={textContainerRef}
            className="text-container w-[90vw] md:min-h-[110%] md:w-[60vw] bg-white p-xl absolute md:relative top-0 right-0 border-l-[5vw] md:border-l-0 overflow-hidden"
            style={{
              borderColor: colorParser(props.color) || undefined
            }}>
            {props?.title &&
              <div className={`mb-md`} data-animation-atoms {...getAnimationAttributes('title')} {...getMobileAnimationAttributes('title')}>
                <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreak]}
                  components={{
                    p: ({ children }) => <TitleMd >{children}</TitleMd>,
                    strong: ({ children }) => <TitleMd as="span" className={`text-${props?.color || 'yellow'}`}>{children}</TitleMd>
                  }}
                >
                  {props?.title}
                </ReactMarkdown>
              </div>
            }
            {props?.text &&
              <BodyMarkdown
                attributes={{
                  ...getAnimationAttributes('text'),
                  ...getMobileAnimationAttributes('text'),
                }}
                color={props?.color}
              >
                {props?.text}
              </BodyMarkdown>
            }
            <div className="mt-sm">
            {
              props?.cta && props?.cta?.map((cta: any, index: number) => {
                return (
                  <Button
                    attributes={{ ...getAnimationAttributes('button'), ...getMobileAnimationAttributes('button') }}
                    key={index}
                    href={cta?.href || "#"}
                    type={cta?.type || "filled"}
                    textColor={`text-${props?.color || 'yellow'}`}
                    icon={cta?.icon || "right-arrow"}
                    dynamicIconColor={colorParser(props?.color)}
                  >
                    {cta?.text}
                  </Button>
                )
              })
            }
            </div>
          </div>
          {/* left image */}

        </div>

      </div>
    </div>
  );
};

export default CaseStudiesTypeTwo;
