"use client";
import { textSafeColor } from "@/parsers";

import { Button } from "@/components/helpers/buttons";
import { GetInTouchProps } from "./get-in-touch.types";
import BodyMarkdown from "@/components/helpers/body-markdown/BodyMarkdown";
import { TextMd, TitleXl } from "@/components/helpers/typography";
import { memo } from "react";
import EmbedCode from "../embed-code";

const GetInTouch: React.FC<GetInTouchProps> = (props) => { 
    return (
     <div id="contactForm" data-animation-component data-animation="true" className={`${props?.className ? props?.className : ''} relative z-2 bg-white py-4xl! min-h-screen `}>

        <div className='flex md:px-xl px-sm mt-md gap-x-3xl gap-y-lg flex-col md:flex-row '>
            {(props?.title || props?.text) &&  <div className='flex-1  md:flex-1/2 '>
                
                {props?.title && <BodyMarkdown components={{
                  p: ({ children }) => {
                    return <TitleXl>{children}</TitleXl>
                  }
                }}>
                  {props?.title}
                </BodyMarkdown>}

                {props?.text && <BodyMarkdown components={{
                  p: ({ children }) => {
                    return <TextMd className='mt-md'>{children}</TextMd>
                  }
                }}>
                  {props?.text}
                </BodyMarkdown>}
                {
                  props?.cta && <div className="flex gap-x-sm mt-md">
                    {props?.cta?.map((cta: any, index: number) => {
                      return (
                        <Button key={index} href={cta?.href} icon='right-arrow' type={cta?.type || "text"} textColor={`text-${textSafeColor(cta?.textColor || 'bright-red')}`}  buttonClassName="mt-0">{cta?.text}</Button>
                      )
                    })}
                  </div>
                }
            </div>}
            {props?.embedCode && <div className='flex-1 md:flex-1/2'>
                <EmbedCode embedCode={props?.embedCode} />
                {/* {} */}
            </div>}
        </div>
      
    </div>
    );
};

export default memo(GetInTouch);
