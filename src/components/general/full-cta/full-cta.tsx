"use client";

import Image from "next/image";
import { FullCtaProps } from "./full-cta.types";
import { TitleLg, TitleMd } from "@/components/helpers/typography";
import { Button } from "@/components/helpers/buttons";
import BodyMarkdown from "@/components/helpers/body-markdown/BodyMarkdown";

const FullCta: React.FC<FullCtaProps> = (props) => {

    return (
      <div data-section-type="full-cta" className={`my-0 ${props?.className || ''} ${props.isAnimation ? "" : "no-section"} bg-light-gray flex md:flex-row flex-col-reverse md:justify-start min-h-[50vh] [body.tablet_&]:min-h-[36vh] relative`} style={props?.style || {} } data-animation={props?.isAnimation || false} data-animation-component>

        <div className="flex flex-col h-auto min-h-0 pl-sm md:pl-xl flex-1 w-full min-w-full md:min-w-[60%] md:w-[60%] justify-end items-start md:mt-0 mt-2xl">
          {/* <TitleMd className="sm:mt-[10vh] md:mb-lg mb-2xl">
            {props?.title}
            {props?.subTitle && <>
              <br/>
              <span className={`text-${props?.color || 'dark-purple'}`}>
                {props?.subTitle} 
              </span>
            </>}
          </TitleMd> */}
          <div className="sm:mt-[10vh] md:mb-lg mb-2xl">
            {props?.title  && <BodyMarkdown 
              color={props?.color || 'dark-purple'}
              components={{
                p: ({ children }) => <TitleMd className="">{children}</TitleMd>,
                strong: ({children}) => <TitleMd as="span" className={`text-${props?.color || 'dark-purple'}`}>{children}</TitleMd>
              }}>
                {props?.title}
            </BodyMarkdown>}
          </div>

          <div className={`bg-${props?.color || 'dark-purple'} flex-1 min-h-0 max-h-[40%] w-fit pt-md pb-2xl px-md! md:py-md! mt-lg`}>
            {
              props?.cta && <Button
                icon='right-arrow'
                type={props?.cta?.type || "text"}
                textColor={`text-white`}
                buttonClassName="mt-0"
                href={props?.cta?.href}
              >
                {props?.cta?.text}
              </Button>
            }
          </div>
        </div>

        {props?.media?.url && <div className="flex-1 ">
          <Image
            unoptimized
            src={props?.media?.url}
            alt={props?.media?.alt || ''}
            width={props?.media?.width || 0}
            height={props?.media?.height || 0}
            className="min-w-full h-full object-cover"
          />  

        </div>}
      </div>
    );
};

export default FullCta;
