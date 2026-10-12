import { ArticleCardProps } from "@/components/general/article-card/article-card.types";
import { EventListingProps } from "./event-listing-parser.types";
import { getStrapiMedia } from "@/utils/utils";
import { EventFullCardsProps } from "@/components/general/event-full-cards/event-full-cards.types";
import { format } from "date-fns";


const eventListingParser = (todos: EventListingProps) => {
    if(!todos) return {}
    
    // // //console.log(todos?.upcoming)

    const upcoming = todos?.upcoming?.data || [];
    const past = todos?.past?.data || [];
    const todoUpcoming = upcoming.map((todo: any) => {
        const {
            documentId,
            eventTypes,
            duration,
            eventDate,
            featuredImage,
            title,
            slug,
            attending,
            introduction,
        } = todo;

        return  {
            color: eventTypes?.[0]?.color?.name,
            type: eventTypes?.[0]?.title,
            id: documentId,
            slug: slug,
            spentTime: duration,
            description: introduction,
            attending,
            isUpcoming: true,
            imageSrc: getStrapiMedia(featuredImage, 'large'),
            imageAlt: featuredImage?.alternativeText,
            imageWidth: featuredImage?.width,
            imageHeight: featuredImage?.height,
            title,
            eventDate: eventDate,
            date: eventDate,
        } as EventFullCardsProps
    });

    const todoPast = past.map((todo: any) => {
        const {
            documentId,
            eventDate,
            featuredImage,
            title,
            slug,
        } = todo;
        return  {
            id: documentId,
            slug: slug, 
            isUpcoming: false,
            imageSrc: getStrapiMedia(featuredImage, 'large'),
            imageAlt: featuredImage?.alternativeText,
            imageWidth: featuredImage?.width,
            imageHeight: featuredImage?.height,
            title,
            date: format(new Date(eventDate), "d MMMM yyyy"),
        } as ArticleCardProps
    });
    
    return [...todoUpcoming, ...todoPast];
    
}

export default eventListingParser;