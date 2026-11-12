"use client";

import { Text, TitleSm } from "@/components/helpers/typography";
import { InlineImageAndVideoProps } from "./inline-image-and-video.types";
import Image from "next/image";

const InlineImageAndVideo: React.FC<InlineImageAndVideoProps> = (props) => {
    return (
      <div className={`no-section min-h-full py-xl w-full xl:max-w-[90%] px-sm sm:px-xl  mx-auto ${props?.className || ''}`}>
        
        {props?.mediaType === 'image' && (
          <div className="w-full">
            {props?.mediaSrc && <Image src={props?.mediaSrc} alt={props?.mediaAlt || ""} width={props?.mediaWidth || 1200} height={props?.mediaHeight || 675} sizes="(min-width: 1280px) 90vw, 100vw" className="w-full h-auto" />}
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
