"use client";
import { textSafeColor } from "@/parsers";

import { Small, Text, TextLg, TextMd, TextXl, TitleSm } from "@/components/helpers/typography";
import { LocationDetailsProps } from "./location-details.types";
import { Button } from "@/components/helpers/buttons";
import Image from "next/image";
import BodyMarkdown from "@/components/helpers/body-markdown/BodyMarkdown";

const LocationDetails: React.FC<LocationDetailsProps> = (props) => {
    return (
      <div className={`${props.className || ''} flex flex-col md:flex-row gap-y-lg px-sm md:px-xl py-md md:py-xl relative`}>
          {(props?.title || props?.details) &&<div className="md:w-[30%] md:max-w-[30%] md:min-w-[30%] md:mr-4xl">
            {props?.title && 
            <BodyMarkdown
                color={props?.color || 'bright-red'}
                components={{
                        p: ({ children }) => <TextXl className="text-dark-gray">
                                                {children}
                                              </TextXl>,
                    }}
                >{props?.title}</BodyMarkdown>}
            {props?.details && <BodyMarkdown
                                color={props?.color || 'bright-red'}
                                components={{
                                        p: ({ children }) => <TextMd className="text-dark-gray mt-md">
                                                                {children}
                                          </TextMd>,
                                    }}>{props?.details}</BodyMarkdown>}

            {props.cta && <div className="mt-md">
              <Button
                isExternal={props.cta?.isExternal}
                href={props.cta?.href}
                icon='right-arrow'
                type={props.cta?.type || "text"}
                textColor={`text-${textSafeColor(props?.color || 'yellow')}`}
                buttonClassName="mt-0"
              >
                {props.cta?.text}
              </Button>
            </div>}
          </div>}
          <div className="md:ml-2xl flex-1 flex flex-col md:flex-col md:justify-start md:items-start relative">
              {props?.imageSrc && <div className="w-full h-full">
                <Image unoptimized src={props?.imageSrc} alt={props?.imageAlt || ""} width={props?.imageWidth || 731} height={props?.imageHeight || 337} className="w-full h-full object-cover" />
              </div>}

              <div className={`md:absolute bottom-0 -left-xl flex fex-row justify-stretch items-stretch md:w-fit`}>
                  <div className={`min-h-0  bg-${props.color} w-xl`} />
                  <div className="bg-white pt-md px-md">
                    {props?.address && <BodyMarkdown
                        components={{
                         p: ({ children }) => <Small className="text-dark-gray">
                                                {children}
                                              </Small> 
                        }}>
                        {props?.address}
                      </BodyMarkdown>}
                  </div>
              </div>
          </div>
      </div>
    );
};

export default LocationDetails;
