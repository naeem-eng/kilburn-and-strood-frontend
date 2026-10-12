import { EventFullCardsProps } from "@/components/general/event-full-cards/event-full-cards.types";
import { getStrapiMedia } from "@/utils/utils";
import { format } from "date-fns";

 
function getEventStatus(eventDate:string) {
  const now = new Date();
  const event = new Date(eventDate);

  if (event > now) return "upcoming";
  if (event < now) return "past";
  return "today";
}


export function eventParser(props: any) {
  if(!props) return null;
  
  const isUpcoming = getEventStatus(props?.eventDate) === "upcoming";
  return {
    component: 'components.event-full-cards',
    props: {
       isUpcoming,
       title: props?.title,
       description: props?.introduction,
       eventDate: props?.eventDate,
       date: format(new Date(props.eventDate), "do MMMM yyyy"),
       slug: props?.slug,
       color: props?.eventTypes?.[0]?.color?.name,
       type: props?.eventTypes?.[0]?.title,
       status: props?.subTitle,
       spentTime: props?.duration,
       imageSrc: getStrapiMedia(props?.featuredImage, 'large'),
       imageAlt: props?.featuredImage?.alternativeText,
       imageWidth: props?.featuredImage?.width,
       imageHeight: props?.featuredImage?.height,
       attending: props?.attending,
       isVisible: props?.isVisible,
       cta: props?.cta?.length > 0 && props?.cta?.map((v:any)=>({
                text: v?.text,
                href: v?.link,
                type: v?.type,
                icon: v?.icon
      }))
      
    }
  } as {
    component: 'components.event-full-cards',
    props: EventFullCardsProps
  }
}


