import Image from "next/image";
import Link from "next/link";
import { Text } from "@/components/helpers/typography";
import CardTitle from "../article-card/card-title";
import { GridCardProps } from "./grid.types";

// Same look as ArticleCard, but links to insights, events or case studies
const GridCard: React.FC<GridCardProps> = (props) => {
    return (
      <Link href={props?.href || "#"} className="articalHover w-full min-w-0 px-sm relative cursor-pointer text-left content-start">
          <div className="articalImageHover relative">
              {props?.imageSrc && <Image sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" src={props.imageSrc} alt={props?.imageAlt || ''} width={props?.imageWidth || 731} height={props?.imageHeight || 337} className="w-full" />}
          </div>
          <div className="mt-sm">
              {props?.tag && <Text className="text-medium-gray mb-2xs">{props.tag}</Text>}
              <CardTitle title={props?.title} />
              {props?.date && <Text className="text-medium-gray mt-md">{props.date}</Text>}
          </div>
      </Link>
    );
};

export default GridCard;
