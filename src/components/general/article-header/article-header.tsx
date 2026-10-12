"use client";
import { Button } from "@/components/helpers/buttons";
import { ArticleHeaderProps } from "./article-header.types";
import { Small, Text, TitleMd, TitleSm } from "@/components/helpers/typography";
import ShareableIcon from "@/components/helpers/icons/shareable-icon/shareable-icon";
import { Fragment } from "react/jsx-runtime";
import React from "react";

const ArticleHeader: React.FC<ArticleHeaderProps> = (props) => {
   
    
    return (
      <div className={`w-full relative flex flex-col md:flex-row pt-[5vw] justify-start items-start bg-white px-sm md:px-xl gap-y-lg`}>

        <div className="md:min-w-[16%] md:w-[16%] mt-md xl:mt-lg">
          <Button href={"/insights"} icon='left-arrow' type="text" textColor="text-dark-gray"  buttonClassName=" text-md! font-modern-era-medium items-baseline" iconClassName="w-sm h-xs">Back</Button>
        </div>

        <div className="md:min-w-[80%] md:w-[50%] flex flex-col gap-y-md justify-start items-start">
         
          {(props?.articalType || props?.date) && <div className="flex flex-row gap-x-xs justify-start items-start">
              {props?.articalType && props?.articalType?.map(({title}:any, i:number)=><Fragment key={i}>
                <Text className="text-dark-gray capitalize">
                  {title} 
                </Text>
                <div className="w-2xs h-2xs bg-[#D9D9D9] rounded-full self-center"/>
              </Fragment>
              )}
              {/* <div className="w-2xs h-2xs bg-[#D9D9D9] rounded-full self-center"/> */}
              <Text className="text-dark-gray ">
                {props?.date}
              </Text>
          </div>}


          <TitleSm>
            {props?.title}
          </TitleSm>

          {(props?.cta?.length || props?.shareable) && <div className="flex gap-x-md items-center mt-lg">
            
                {
                  props?.cta?.map((cta: any, index: number) => {
                    return (
                      <Button key={index} href={cta?.href} icon='right-arrow' type={cta?.type || "text"} textColor={`text-${cta?.textColor || 'dark-purple'}`} backgroundColor={`bg-${cta?.backgroundColor || 'dark-purple'}`} buttonClassName="text-base! font-modern-era-medium" iconClassName="w-sm h-sm">{cta.text}</Button>
                    )
                  })
                }

                 {props?.shareable && <Button
                    icon='right-arrow'
                    type="text"
                    textColor="text-dark-gray"
                    buttonClassName="text-base! font-modern-era-medium"
                    CustomRightIcon={() => <ShareableIcon className="w-sm h-sm md:w-sm md:h-sm ml-2xs" />}
                  >
                    Share
                  </Button>}
          </div> }

         
          
        </div>

      </div>
    );
};

export default ArticleHeader;
