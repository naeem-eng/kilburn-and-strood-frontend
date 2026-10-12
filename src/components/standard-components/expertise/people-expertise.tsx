"use client";

import Image from "next/image";
import { Text, TextLg, TextMd, TextXl, TitleMd, TitleSm } from "@/components/helpers/typography";
import { PeopleExpertiseProps } from "./people-expertise.types";
import { Button } from "@/components/helpers/buttons";
import { colorParser } from "@/parsers";



const PeopleExpertise: React.FC<PeopleExpertiseProps> = (props) => {

    return (
      <div className="w-full bg-white flex md:flex-row flex-col relative z-2">
          
          {/* leftBox */}
          <div className={`bg-light-gray py-xl px-sm md:px-xl ${props?.role?.includes("trade mark attorney") ? "flex-1  md:max-w-[70%]" : "flex-[70%]"} w-full max-w-full flex flex-col justify-start items-start gap-y-md`}>

              <TextXl className={`mb-sm`} style={{
                "color": colorParser(props?.color || 'dark-gray') 
              }}>{props?.title}</TextXl>
              
              {props?.services?.length ? <div className="mt-sm">
                <TextMd className={`text-dark-gray mb-sm font-modern-era-medium`}>Services</TextMd>
                <div className="flex flex-row flex-wrap gap-sm">
                  {props?.services?.map((item, index) => {
                    return (
                      <Button key={index} 
                        href={item.href || "#"}
                        type="outlined"
                        buttonClassName={`before:bg-[var(--dynamic-color)]! transition-all duration-300 hover:border-[var(--dynamic-color)]! text-left`}
                        style={{
                          "--dynamic-color": colorParser(props?.color || 'dark-gray')
                        }}
                      >{item.text}
                      </Button>
                    )
                  })}
                </div>
              </div> : <></>}
              
          </div>


          {/* leftBox */}
          {!props?.role?.includes("trade mark attorney") && <div className="bg-dark-gray pt-2xl pb-2xl md:pb-3xl px-md md:px-xl flex-[30%] w-full max-w-full md:max-w-[30%] flex flex-col justify-start items-start gap-y-md mb-md h-auto">
         
              {props?.sectors?.length ? <div className="min-h-[8vw] flex flex-col justify-end items-start">
                <TextMd className={`text-white mb-md font-modern-era-medium`}>Sectors</TextMd>
                <div className="flex flex-row flex-wrap gap-[.5vw]">
                  {props?.sectors?.map((item, index, arr) => {
                    return (
                      <div key={index} className="flex flex-row items-center text-left gap-x-[.5vw]">
                        <span 
                          className="text-white inline"
                        >{item.text}
                        </span>
                        {(props?.sectors && index == props?.sectors?.length - 1) ? <></> : <div className="w-2xs h-2xs bg-white rounded-full"></div>}
                      </div>
                    )
                  })}
                  
                </div>
              </div> : <></>}
              
          </div>}

      </div>
    );
};

export default PeopleExpertise;
