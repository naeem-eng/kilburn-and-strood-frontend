import { ArticleCardProps } from "@/components/general/article-card/article-card.types";
import { ArticlesListingProps } from "./article-listing-parser.types";
import { getStrapiMedia } from "@/utils/utils";
import { format } from "date-fns";



const articleListingParser = (todos: ArticlesListingProps) => {
    if(!todos?.length) return []
    return todos.map((todo: any) => {
        const {
            documentId,
            color,
            publishDate,
            articleTypes,
            featuredImage,
            name,
            title,
            slug
        } = todo;

        return  {
            id: documentId,
            slug: slug,
            color: color?.name,
            imageSrc: getStrapiMedia(featuredImage, 'large'),
            imageAlt: featuredImage?.alternativeText,
            imageWidth: featuredImage?.width,
            imageHeight: featuredImage?.height,
            title,
            date: format(new Date(publishDate), "do MMMM yyyy"),
            tag: articleTypes?.[0]?.title,
        } as ArticleCardProps
    });
    
    
}

export default articleListingParser;