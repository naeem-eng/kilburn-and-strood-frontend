"use client";

import { Text, TitleSm } from "@/components/helpers/typography";
import { InlineImageAndVideoProps } from "./inline-image-and-video.types";
import dynamic from "next/dynamic"; 

const InlineImageAndVideo: React.FC<InlineImageAndVideoProps> = (props) => {
    return (
      <div className={`no-section min-h-full py-xl w-full xl:max-w-[90%] px-sm sm:px-xl  mx-auto ${props?.className || ''}`}>
        
        {props?.mediaType === 'image' && (
          <div className="w-full">
            {props?.mediaSrc && <img src={props?.mediaSrc} alt={props?.mediaAlt || ""} width={props?.mediaWidth} height={props?.mediaHeight} className="w-full" />}
          </div>
        )}
        {props?.mediaType === 'video' && (
          <div className="w-full">
            <video src={props?.mediaSrc} controls playsInline preload="metadata" className="aspect-video w-full! h-auto!"/>
          </div>
        )}
        {props?.title && <Text className="mt-xs">{props?.title}</Text>}

      </div>
    );
};

export default InlineImageAndVideo;
