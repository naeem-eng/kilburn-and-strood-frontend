import Image from "next/image";
import Link from "next/link";
import { Text, TextLg } from "@/components/helpers/typography";
import { GridCardProps } from "./grid.types";

// Same look as ArticleCard, but links to insights, events or case studies
const GridCard: React.FC<GridCardProps> = (props) => {
    return (
      <Link href={props?.href || "#"} className="articalHover min-w-full w-full max-w-full sm:min-w-1/2 sm:w-1/2 sm:max-w-1/2 md:min-w-1/3 md:w-1/3 md:max-w-1/3 px-sm relative cursor-pointer text-left content-start">
          <div className="articalImageHover relative">
              {props?.imageSrc && <Image unoptimized src={props.imageSrc} alt={props?.imageAlt || ''} width={props?.imageWidth || 731} height={props?.imageHeight || 337} className="w-full" />}
          </div>
          <div className="mt-sm">
              {props?.tag && <Text className="text-medium-gray mb-2xs">{props.tag}</Text>}
              <TextLg as="h3" className="text-dark-gray font-modern-era-medium animated-underline">{props?.title}</TextLg>
              {props?.date && <Text className="text-medium-gray mt-md">{props.date}</Text>}
          </div>
      </Link>
    );
};

export default GridCard;
