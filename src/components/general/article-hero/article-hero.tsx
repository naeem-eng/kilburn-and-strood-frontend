"use client";

import Image from "next/image";
import { ArticleHeroProps } from "./article-hero.types";

const ArticleHero: React.FC<ArticleHeroProps> = (props) => {
    return (
      <div className={`w-full relative flex flex-row pt-xl justify-start items-stretch bg-white flex-1`}>
        
        <div className={`min-w-sm w-sm max-w-sm sm:min-w-lg sm:w-lg sm:max-w-lg md:min-w-2xl md:w-2xl md:max-w-2xl mb-[8%] h-auto flex-1 bg-${props?.color || 'dark-purple'}`} />

        <div className="flex-1 w-full">
          {
            props?.heroType === 'image' && props?.mediaSrc && <Image unoptimized src={props?.mediaSrc} alt={props?.mediaAlt || ""} width={props?.mediaWidth || 412} height={props?.mediaHeight || 678} className="w-full max-w-none object-cover h-full" />
          }
          {
            props?.heroType === 'video' && props?.mediaSrc && <video src={props?.mediaSrc} autoPlay loop muted playsInline preload="auto" className="w-full max-w-none object-cover h-full" />
          }
        </div>

      </div>
    );
};

export default ArticleHero;
