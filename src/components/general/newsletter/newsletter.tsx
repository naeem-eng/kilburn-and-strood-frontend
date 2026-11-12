"use client";

import Image from "next/image";
import { Text, TitleLg } from "@/components/helpers/typography";
import { colorParser, textColorParser, textSafeColor } from "@/parsers";
import { Button } from "@/components/helpers/buttons";
import BodyMarkdown from "@/components/helpers/body-markdown/BodyMarkdown";
import React, { memo } from "react";
import { NewsletterProps } from "./newsletter.types";




const Newsletter: React.FC<NewsletterProps> = (props) => {
  const isAnimation = props?.isAnimation || false;
  const isLightAnimation = props?.isLightAnimation || false;
  const color = props?.color || 'dark-blue';
  const colorVars = {
    "--dynamic-colors": colorParser(color),
    "--dynamic-text-colors": textColorParser(color),
  } as React.CSSProperties;

  return (
    <div
      data-animation={isAnimation}
      data-light-animation={isLightAnimation}
      data-animation-component
      data-section-type="newsletter"
      className={`${isAnimation || isLightAnimation ? 'invisible' : ''} h-full md:min-h-screen md:h-screen w-full relative flex flex-col md:flex-row px-sm md:px-xl py-[40px] sm:py-[10vh] justify-center items-start bg-white overflow-hidden`} style={{
        zIndex: props.index
      }}>



        {/*  */}
        {props?.mediaSrc && <div
          data-animation-atoms
          data-from='{"clip-path": "inset(100% 0 0%)"}'
          data-middle='{"clip-path": "inset(0% 0 0%)"}'
          data-to='{"clip-path": "inset(0% 0 100%)"}'
          className="w-full md:w-1/2 h-full">
          <Image src={props?.mediaSrc} alt={props?.mediaAlt || ""} width={props?.mediaWidth || 389} height={props?.mediaHeight || 898} className=" object-cover object-left-top h-full min-w-full" />
        </div>}

        <div className="flex-1 min-h-0 relative w-auto h-full flex flex-col">
          {props?.mediaSrc2 && <div
            data-animation-atoms
            data-from='{"clip-path": "inset(100% 0 0%)"}'
            data-middle='{"clip-path": "inset(0% 0 0%)"}'
            data-to='{"clip-path": "inset(0% 0 100%)"}'
            className="w-full md:w-1/2 h-[58px] md:h-[10vw]">
            <Image src={props?.mediaSrc2} alt={props?.mediaAlt2 || ""} width={props?.mediaWidth2 || 389} height={props?.mediaHeight2 || 898} className=" object-cover object-left-top h-full min-w-full" />
          </div>}

          <div className=" w-full min-h-0 flex-1 flex flex-row justify-start items-start">
            <div className="p-[24px] md:p-[2.5vw] flex-1  max-w-[90%] min-h-0">
              <div className="text-content flex flex-col gap-y-4">
                  
                  {props?.eyebrow && (
                    <Text
                      textSize="text-base"
                      className="text-[var(--dynamic-text-colors)]"
                      style={colorVars}
                    >
                      {props.eyebrow}
                    </Text>
                  )}
                  {props?.title && (
                    <TitleLg
                      className="whitespace-pre-line [&_span]:text-[var(--dynamic-text-colors)]"
                      style={colorVars}>
                      {props.title}
                    </TitleLg>
                  )}
                  {props.text &&
                    <BodyMarkdown
                      color={color}
                      components={{
                        h1: ({ children }) => <TitleLg>{children}</TitleLg>,
                        h2: ({ children }) => <TitleLg>{children}</TitleLg>,
                        h3: ({ children }) => <TitleLg>{children}</TitleLg>,
                        p: ({ children }) => <Text
                          as={"p"}
                          textSize="text-base"
                        >{children}</Text>,
                      }}
                    >{props.text}</BodyMarkdown>
                  }
    
                </div>
                {props?.cta?.text && (
                  <div className="w-full link mt-5" >
                    <Button
                      href={props?.cta?.link}
                      icon='right-arrow'
                      type={"text"}
                      textColor={`text-${textSafeColor(color)}`}
                      dynamicIconColor={colorParser(color)}
                    >
                      {props?.cta?.text}
                              </Button>
                            </div>
                          )}
              
            </div>
            <div className="w-[10%] h-full" style={{ backgroundColor: colorParser(color) || undefined }} />
          </div>
        </div>
        {/*  */}

    </div>
  );
};

export default memo(Newsletter);
