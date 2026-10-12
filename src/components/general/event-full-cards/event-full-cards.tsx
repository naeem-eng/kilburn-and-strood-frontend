"use client";

import Image from "next/image";
import { EventFullCardsProps } from "./event-full-cards.types";
import { Text, TextLg, TextMd, TextXl, TitleLg, TitleSm, TitleXl } from "@/components/helpers/typography";
import Link from "next/link";
import { Button } from "@/components/helpers/buttons";
import { useCallback } from "react";
import { colorParser } from "@/parsers";

const typeColors = {
  "bright-red": {
    dot: "bg-dark-red",
  },
  "dark-purple": {
    dot: "bg-light-purple",
  },
  'dark-yellow': {
    dot: "bg-yellow",
  },
  "dark-blue": {
    dot: "bg-light-blue",
  },
} as any;


const formatDate = (date: string | Date) => {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).toString();
};

const parseDate = (date: string) => { 
  const tempDate = date.split(' ')
  return {
    day: tempDate?.[0],
    month: tempDate?.[1],
    year: tempDate?.[2],
  }
}


const EventFullCards: React.FC<EventFullCardsProps> = (props) => {
    

    const EventContainer = useCallback(()=>{
      return (
        <>
           <div className="relative flex w-full min-w-full md:w-[50%] md:min-w-[50%]">
                {props?.imageSrc && <Image unoptimized src={props.imageSrc} alt={props?.imageAlt || "Image 1"} width={props.imageWidth || 731} height={props.imageHeight || 337} className="w-full object-cover" />}
                
                <div className={`min-w-[7%] w-[7%] absolute right-0 top-0 bottom-0 bg-[var(--dynamic-colors)]`} style={{ "--dynamic-colors": colorParser(props?.color || 'bright-red') } as any}></div>

                {props.eventDate && <div className="absolute top-0 md:top-auto md:bottom-0 left-0 pr-md pt-0 pb-md  md:pb-0 md:pt-sm bg-white">
                  <TitleXl className={`text-${props.color || "bright-red"} mb-0`}>
                    {parseDate(formatDate(props.eventDate)).day}
                  </TitleXl>
                  <Text>
                    {parseDate(formatDate(props.eventDate)).month}
                  </Text>
                </div>}
              </div>

              <div className="min-h-0 flex flex-col flex-1 bg-light-gray pb-lg pt-md">

                {props.attending && props?.color && <div className={`${typeColors?.[(props?.color || 'bright-red')]?.dot} px-md md:px-xl max-w-fit`}>
                  <TextMd className="text-dark-gray py-sm font-modern-era-medium!">
                    We’re attending
                  </TextMd>
                </div>}
                <div className="mt-md mb-md px-md md:px-xl ">
                  <TextXl>
                    {props.title}
                  </TextXl>
                  <TextMd className="mt-md">
                    {props.description}
                  </TextMd>
                </div>

                 <div className="mt-auto px-md md:px-xl"> 
                  {props?.cta && props?.cta?.length > 0 ? (
                    props?.cta?.map((v:any, k)=>(
                      <Button key={k} type={"filled"} href={v?.href} textColor="text-dark-gray" buttonClassName="mt-auto px-xl" backgroundColor={`bg-${props?.color || 'bright-red'}`} icon={"right-arrow"}>
                        {v.text}
                      </Button>
                    ))
                  ) :
                    <TextMd className="">
                      {props?.type ? <>{props?.type}<span className={`inline-block mx-xs rounded-full w-2xs h-2xs mb-[.2vw] bg-[#BDBDBD]`}></span></>:<></>}{props.spentTime}
                    </TextMd>
                  }
                </div>
              </div>
        </>
      ) 
    },[])

    if(props?.cta || props?.noLink) {
      return (
          <div className={`w-full flex flex-col md:flex-row min-h-0 h-auto justify-stretch items-stretch gap-x-0`}>
              <EventContainer/>
          </div>
        );
    }

    return (
      <Link href={`events/${props?.slug}`} className={`w-full flex flex-col md:flex-row min-h-0 h-auto justify-stretch items-stretch gap-x-0`}>
          
         <EventContainer/>
         
      </Link>
    );
};

export default EventFullCards;
