"use client";

import { BodyProps } from "./body.types";
import BodyMarkdown from "@/components/helpers/body-markdown/BodyMarkdown";
import { Text } from "@/components/helpers/typography";

const Body: React.FC<BodyProps> = (props) => { 
    return (
      <div className={`${props?.className || ''} min-h-full py-xl w-full xl:max-w-[70%] px-sm sm:px-xl  mx-auto`}>
        {props?.title && <Text className="text-dark-gray mb-sm font-gt-ultra">{props?.title}</Text>}
        {
          props?.content && <BodyMarkdown
            color={props?.color || "bright-red"}>
              {props?.content}
            </BodyMarkdown>
        }
      </div>
    );
};

export default Body;
