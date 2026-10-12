"use client";

import Image from "next/image";
import { ArticleCardProps } from "./article-card.types";
import { Text, TextLg, TextMd } from "@/components/helpers/typography";
import Link from "next/link";

const ArticleCard: React.FC<ArticleCardProps> = (props) => {
    return (
      <Link  href={props?.slug ? `${props?.as == 'event' ? '/events/': '/insights/'}`+props?.slug : "#"} type="button" className={`articalHover min-w-full w-full max-w-full sm:min-w-1/2 sm:w-1/2 sm:max-w-1/2 md:min-w-1/3 md:w-1/3 md:max-w-1/3 px-sm flex-1/2 sm:flex-1/3 md:flex-1/4 relative cursor-pointer text-left content-start`}>
          <div className="articalImageHover relative">
              {props?.imageSrc && <Image unoptimized src={props?.imageSrc} alt={props?.imageAlt || ''} width={props?.imageWidth || 731} height={props?.imageHeight || 337} className="w-full" />}
          </div>
          <div className="mt-sm">
              <Text className="text-medium-gray mb-2xs">{props?.tag}</Text>
              <TextLg className="text-dark-gray font-modern-era-medium animated-underline">{props?.title}</TextLg>
              <Text className="text-medium-gray mt-md">{props?.date}</Text>
          </div>
      </Link>
    );
};

export default ArticleCard;
