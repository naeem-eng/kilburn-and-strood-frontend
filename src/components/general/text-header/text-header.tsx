"use client";

import { Text, TextMd, TitleLg, TitleMd } from "@/components/helpers/typography";
import { TextHeaderProps } from "./text-header.types";
import BodyMarkdown from "@/components/helpers/body-markdown/BodyMarkdown";

const TextHeader: React.FC<TextHeaderProps> = (props) => {

    return (
      <div className={`${props?.className || ''} w-full relative flex flex-col sm:flex-row md:pb-2xl justify-start items-end bg-white px-sm md:px-xl gap-y-lg pt-[0vw] md:h-[calc(35vw-6.5vw)] lg:h-[calc(40vw-6.5vw)] xl:h-[calc(30vw-5.5vw)] 2xl:h-[calc(25vw-5.5vw)] [body.force-portrait_&]:h-[30vh] [body.tablet_&]:h-[25vh]! text-left`}>
        {(props?.title || props.LeftComponent) && <div className="sm:min-w-[40%] sm:w-[40%] md:min-w-[60%] md:w-[60%] sm:flex-1 w-full">
          {props?.title && <BodyMarkdown 
          components={{
              p: ({ children }) => <TitleLg as="h1" className="text-dark-gray mt-0">{children}</TitleLg>,
          }}>{props?.title}</BodyMarkdown>}
          {props.LeftComponent || <></>}
        </div>}

        {(props?.text || props.RightComponent) && <div className="sm:flex-1 w-full">
          
          {props?.text  && <BodyMarkdown 
            components={{
              p: ({ children }) => <Text className="text-dark-gray mt-0">{children}</Text>
          }}>
            {props?.text}
          </BodyMarkdown>}

          {props.RightComponent || <></>}
        </div>}
      </div>
    );
};

export default TextHeader;
