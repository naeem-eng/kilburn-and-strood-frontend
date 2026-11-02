"use client";

import Image from "next/image";
import { Text, TitleLg, TitleMd, TitleSm, TitleXl } from "@/components/helpers/typography";
import { colorParser, textColorParser, textSafeColor } from "@/parsers";
import { Button } from "@/components/helpers/buttons";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreak from 'remark-breaks';
import BodyMarkdown from "@/components/helpers/body-markdown/BodyMarkdown";
import React, { useMemo, useEffect, useState, memo } from "react";
import { StatsBlockProps } from "./stats-block.types";
import { createIncrementalAnimationAttributes } from "@/components/helpers/animation";




const StatsBlock: React.FC<StatsBlockProps> = (props) => {
  const isAnimation = props?.isAnimation || false;
  const isLightAnimation = props?.isLightAnimation || false;
  
  type AnimatedFieldKey = 'title' | 'text' | 'button'
  

    const animatedFieldsOrder: AnimatedFieldKey[] = []
    if (props?.title) animatedFieldsOrder.push('title')
    if (props?.text) animatedFieldsOrder.push('text')
    // if (props?.buttonText) animatedFieldsOrder.push('button')

    const getAnimationAttributes = createIncrementalAnimationAttributes<AnimatedFieldKey>({
        distances: ['20svh', '18svh', '16svh'],
        fieldsOrder: animatedFieldsOrder
    })

    const getMobileAnimationAttributes = createIncrementalAnimationAttributes<AnimatedFieldKey>({
        distances: ['10svh', '8svh', '6svh'],
        negativeOnReverse: false,
        fieldsOrder: animatedFieldsOrder,
        screenSize: 'mobile-'
    })


  console.log({props})
  
  return (
    <div
      data-animation={isAnimation}
      data-light-animation={isLightAnimation}
      data-animation-component
      className={`${isAnimation || isLightAnimation ? '' : ''} h-full md:min-h-screen md:h-screen w-full relative flex flex-col md:flex-row py-[40px] sm:py-[10vh] justify-center items-start bg-white overflow-hidden `} style={{
        zIndex: props.index
      }}>



      <div className="flex-1 min-h-0 relative w-auto h-full flex flex-col md:flex-row pt-[5vw] px-(--padding-side) gap-x-4xl">
          <div className="w-[50%] h-full">
              <div className="text-content flex flex-col gap-y-4">
                  
                  {(props?.title ) && (
                    // <TitleLg
                    //   className="[&_span]:text-[var(--dynamic-text-colors)]"
                    //   style={{
                    //     "--dynamic-colors": colorParser(props?.color || 'dark-blue'),
                    //                     "--dynamic-text-colors": textColorParser(props?.color || 'dark-blue')
                    //   }}>
                    //   {props?.title} 
                    // {/* </TitleLg> */}
                    <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreak]}
                        components={{
                            p: ({ children }) => <TitleXl attributes={{ ...getAnimationAttributes('title'), ...getMobileAnimationAttributes('title') }}>{children}</TitleXl>,
                            strong: ({ children }) => <TitleXl as="span" className={``} style={{ color: `var(--color-${props?.color || 'yellow'})` }} >{children}</TitleXl>
                        }}
                    >
                        {props?.title}
                    </ReactMarkdown>
                  )}
                  {props?.text && <BodyMarkdown
                                      color={props?.color || 'bright-red'}
                                      components={{
                                          p: ({ children }) => <Text attributes={{ ...getAnimationAttributes('text'), ...getMobileAnimationAttributes('text') }}
                                              className="mt-0 mb-xs xl:max-w-[30vw]">{children}</Text>,
                                          ul: ({ children }) => <ul className="unorderedList sm mt-md!">{children}</ul>,
                                      }}
                                  >{props?.text}</BodyMarkdown>}
    
                </div>
                
          </div>

           <div className=" w-[25%] h-full mr-[8vw]">
              <div className="text-content flex flex-col gap-y-lg">
                    {
                      props?.stats?.map((stat, index) => {
                        return (
                          <div key={index} className="stat-item flex flex-col gap-y-2 border-t-dark-gray border-t-[2px] pt-xs">
                            {stat?.title && <TitleXl  className="mb-0">{stat?.title}</TitleXl>}
                            {stat?.text && <Text className="mb-0">{stat?.text}</Text>}
                          </div>
                        ) 
                      })
                    }
              </div>  
          </div>
 
        </div>


      {/*  */}
      {props?.mediaSrc && <div
        data-animation-atoms
        data-from='{"clip-path": "inset(100% 0 0%)"}'
        data-middle='{"clip-path": "inset(0% 0 0%)"}'
        data-to='{"clip-path": "inset(0% 0 100%)"}'
        className="w-[8vw] h-full absolute right-0 bottom-0 top-[10vw] sm:flex hidden">
        <Image src={props?.mediaSrc} alt={props?.mediaAlt || ""} width={props?.mediaWidth || 389} height={props?.mediaHeight || 898} className="object-cover object-right-bottom h-full min-w-full" />
      </div>}
      {/*  */}
 

    </div>
  );
};

export default memo(StatsBlock);
