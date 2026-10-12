"use client";

import Image from "next/image";
import { Text, TitleMd, TitleSm, TitleXl } from "@/components/helpers/typography";
import { colorParser } from "@/parsers";
import { Button } from "@/components/helpers/buttons";
import { CaseStudiesTypeFourProps } from "./case-studies-type-four.types";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreak from 'remark-breaks';
import BodyMarkdown from "@/components/helpers/body-markdown/BodyMarkdown";
import React, { useMemo, useEffect, useState } from "react";
const CaseStudiesTypeFour: React.FC<CaseStudiesTypeFourProps> = (props) => {
  const isAnimation = props?.isAnimation || false;
  const isLightAnimation = props?.isLightAnimation || false;
  const [isNarrow, setIsNarrow] = useState(false);
  useEffect(() => {
    const checkWidth = () => setIsNarrow(window.innerWidth <= 1619);
    checkWidth();
    window.addEventListener("resize", checkWidth);
    return () => window.removeEventListener("resize", checkWidth);
  }, []);
  const titleLength = props?.title ? props.title.length : 0;
  const dynamicWidth = useMemo(() => {
    if (isNarrow) return "md:w-[70%]";
    if (titleLength < 55) return "md:w-[55%]";
    if (titleLength < 70) return "md:w-[60%]";
    return "md:w-[70%]";
  }, [titleLength, isNarrow]);
  return (
    <div
      data-animation={isAnimation}
      data-light-animation={isLightAnimation}
      data-section-type="case-studies-type-four"
      data-animation-component
      className={`${isAnimation || isLightAnimation ? 'invisible' : ''} overflow-hidden xl:min-h-full xl:h-full w-full relative flex flex-col  py-0 md:pb-0 md:pt-[0] justify-start items-start md:mt-0 mt-10`} style={{
        zIndex: props.index
      }}>
      <div className={`relative flex md:flex-col gap-x-xl w-full justify-stretch h-full items-start  max-h-[120vh] flex-col `}>

        {/*  */}
        {props?.media3Src && <div
          data-animation-atoms
          data-from='{"clip-path": "inset(100% 0 0%)"}'
          data-middle='{"clip-path": "inset(0% 0 0%)"}'
          data-to='{"clip-path": "inset(0% 0 100%)"}'
          className="hidden md:block absolute right-0 top-0 bottom-0  h-full w-[25vw] z-2">
          <Image src={props?.media3Src} alt={props?.media3Alt || "Image 1"} width={props?.media3Width || 389} height={props?.media3Height || 898} className=" object-cover object-left-top h-full min-w-full" />
        </div>}
        {/*  */}

        <div className="relative z-1 flex justify-start items-start flex-col-reverse md:flex-row h-auto w-full md:w-full md:h-[80%] overflow-hidden">

          {props?.imageSrc && <div
            data-animation-atoms
            data-from='{"y": "30%", "delay": "1.5"}'
            data-middle='{"y": "0%", "x": "0%" }'
            data-to='{"y": "-50%"}'
            data-mobile-from='{"clip-path": "inset(0 100% 0 0)"}'
            data-mobile-middle='{"clip-path": "inset(0 0% 0 0)"}'
            className="w-[45vw] md:w-[20vw] overflow-hidden md:mt-[6.5vw] mt-[15vw]">
            <Image src={props?.imageSrc} alt={props?.imageAlt || "Image 1"} width={props?.imageWidth || 302} height={props?.imageHeight || 294} className=" object-cover object-left-top w-full" />
          </div>
          }
          {props?.image2Src && <div
            data-animation-atoms
            data-from='{"y": "30%", "duration": "1.5"}'
            data-middle='{"y": "0%"}'
            data-to='{"y": "20%"}'
            data-mobile-from='{"clip-path": "inset(0 100% 0 0)"}'
            data-mobile-middle='{"clip-path": "inset(0 0% 0 0)"}'
            className="w-[60vw] md:w-[55vw] md:mt-[6.5vw] h-auto overflow-hidden relative">
            <Image src={props?.image2Src} alt={props?.image2Alt || "Image 1"} width={props?.image2Width || 963} height={props?.image2Height || 449} className="min-w-full object-cover w-auto max-w-full max-h-[18rem] md:max-h-[20rem] xl:max-h-[60vh]" />
          </div>
          }

          {props?.media3Src &&
            <div
              className="md:hidden block absolute right-0 top-0 bottom-0  h-full w-[40vw] z-1"
              data-animation-atoms
              data-mobile-from='{"clip-path": "inset(0 0 100% 0)"}'
              data-mobile-middle='{"clip-path": "inset(0 0 0% 0)"}'
            >
              <Image
                src={props?.media3Src}
                alt={props?.media3Alt || "Image 1"}
                width={props?.media3Width || 389}
                height={props?.media3Height || 898}
                className=" object-cover object-left-top h-full min-w-full" />
            </div>
          }

        </div>

        <div className={`w-[85%] ${dynamicWidth} relative z-1 mt-8 md:mt-xl md:pl-2xl`}>
          <div
            data-animation-atoms
            data-from='{"x": "70%", "duration": "2.5"}'
            data-middle='{"x": "0%" }'
            data-to='{"x": "-70%"}'
            className="px-sm md:px-xl flex-1 justify-center w-full mb-2xl md:mb-lg flex flex-col gap-y-sm relative ">
            {props?.title &&
              <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreak]}
                components={{
                  p: ({ children }) => <TitleMd>{children}</TitleMd>,
                  strong: ({ children }) => <TitleMd as="span" className={`text-${props?.color || 'yellow'}`}>{children}</TitleMd>
                }}
              >
                {props?.title}
              </ReactMarkdown>
            }

            {props?.text &&
              <BodyMarkdown
              className="xl:max-w-[80%]"
                color={props?.color}
              >
                {props?.text}
              </BodyMarkdown>
            }
            {
              props?.cta?.map((button, index) => {
                return (
                  <div className="flex gap-x-xs mt-sm" key={index}>
                    <Button
                      key={index}
                      href={button.href}
                      type={button.type || "filled"}
                      backgroundColor={`bg-${props?.color || 'dark-gray'}`}
                      textColor={button.type == "text" ? `text-${props?.color || 'yellow'}` : "text-white"}
                      dynamicIconColor={colorParser(props?.color)}
                    >
                      {button.text}
                    </Button>
                  </div>
                )
              })
            }
          </div>
        </div>

      </div>
    </div>
  );
};

export default CaseStudiesTypeFour;
