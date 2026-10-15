"use client";

import Image from "next/image";
import { PeopleBioProps } from "./people-bio.types";
import { Text, TitleMd, TitleSm, Small, TitleLg, TitleXl } from "@/components/helpers/typography";
import { colorParser, textColorParser } from "@/parsers";
import { Button } from "@/components/helpers/buttons";
import EmailIcon from "@/components/helpers/icons/email-icon/email-icon";
import Link from "next/link";
import LinkedInIcon from "@/components/helpers/icons/linkedin-icon/linkedin-icon";
import PhoneIcon from "@/components/helpers/icons/phone-icon/phone-icon";
import DownloadIcon from "@/components/helpers/icons/download-icon/download-icon";
import QuoteIcon from "@/components/helpers/icons/quote-icon/quote-icon";
import { Fragment, useEffect, useState } from "react";
// import { useRouter } from "next/router";



const PeopleBio: React.FC<PeopleBioProps> = (props) => {
    // const router = useRouter();

    const [height, setHeight] = useState<number|null|undefined>(0);

    const listOfIcons:{
    [key: string]: any;
    } = {
          "email": <EmailIcon className={"fill-inherit min-w-sm w-sm h-sm "} fill={"inherit"} />,
          "download": <DownloadIcon className={"fill-inherit min-w-sm w-sm h-sm "} fill={"inherit"}/>,
          "phone": <PhoneIcon className={"fill-inherit min-w-sm w-sm h-sm "} fill={"inherit"} />,
          "linkedin": <LinkedInIcon className={"fill-inherit min-w-sm w-sm h-sm "} fill={"inherit"} />,
        }

    useEffect(() => {
      const header = document.getElementById('header');
      
      const onResize = () => {
        const headerHeight = header?.getBoundingClientRect().height || 0;
        const viewportHeightPx = window.innerHeight;
        const elementHeightVh = (headerHeight / viewportHeightPx) * 100;

        // // //console.log(elementHeightVh)
        setHeight(elementHeightVh || 0);
      }
      onResize();
      window.addEventListener('resize', onResize);
      return () => {
        window.removeEventListener('resize', onResize);
      };
    },[])

    const getQuoteWidthClass = (quoteText?: string) => {
      const quoteLength = quoteText?.length || 0;
      if (quoteLength < 150) {
        return 'md:w-[70%] xl:w-[60%]'; // default
      } else if (quoteLength < 340)  {
        return 'md:w-[90%] xl:w-[70%]'; // medium
      } else {
        return 'md:w-[90%] xl:w-[90%]'; // large
      }
    };

   
        
    return (
      <div 
          data-animation={props?.isAnimation || false} 
          data-animation-component  
          data-section-type="people-bio"
          data-people-bio
          className={`${props?.isAnimation ? 'invisible' : ''} md:min-h-screen [body.tablet_&]:min-h-[50vh] [body.boxTablet_&]:min-h-[50vh] w-full relative flex flex-col justify-start items-start bg-white`} style={{
              zIndex: props.index,
          }}>
            <div className={`relative w-full min-h-full flex-1 h-auto flex justify-start`}>
                
                {/* profileImage */}
              {props?.imageSrc && <div 
                  data-animation-atoms
                  data-from='{"clip-path": "inset(0 100% 0 0)"}'
                  data-middle='{"clip-path": "inset(0 0% 0 0%)"}'
                  data-to='{"clip-path": "inset(0 0 0 100%)"}'
                  className="absolute top-1  md:bottom-0 right-0 w-full md:w-[70%]"
                >
                  <Image unoptimized src={props?.imageSrc} alt={props?.imageAlt || ''} width={props?.imageWidth || 731} height={props?.imageHeight || 337} className="w-full h-full object-cover" />
                </div>}
                {/* profileImage */}

                {/* leftBox */}
                <div className={`md:w-1/2 flex flex-col items-start  pb-xl md:pb-0 justify-stretch bottom-0 top-0 left-0 z-5 mt-[79%] md:mt-0 w-full bg-${props?.color || 'dark-purple'} md:bg-transparent`}>
                  <div data-animation-atoms
                  data-from='{"clip-path": "inset(100% 0 0 0)"}'
                  data-middle='{"clip-path": "inset(0% 0 0% 0)"}'
                  data-to='{"clip-path": "inset(0 0 100% 0)"}'
                  className="w-full bg-white px-lg py-lg md:py-2xl md:p-xl   md:pr-2xl flex flex-col justify-start items-start gap-y-sm md:mt-0 -mt-[20%] md:min-h-1/2 max-w-[90%] md:max-w-[90%] md:flex-1">
                    {
                      props?.backCTA && (
                        <div
                          data-animation-atoms  
                          data-from='{"y": "20rem"}'
                          data-middle='{"y": "0" }'
                          data-to='{"y": "-20rem"}' 
                        >
                          <Button
                            icon='left-arrow'
                            type={"text"}
                            buttonClassName="mb-sm"
                            textColor={
                              `text-dark-gray`
                            }
                            href="/people"
                          >{props?.backCTAText}</Button>
                        </div>
                        
                      )
                    }
                    <div className="max-w-full md:my-auto"
                     data-animation-atoms  data-from='{"y": "30rem"}'
                    data-middle='{"y": "0" }'
                    data-to='{"y": "-30rem"}' 
                    >
                      {
                        props?.label && <Text className="mb-0">{props?.label}</Text>
                      }
                      {
                        props?.title && <TitleXl className="[&_span]:text-[var(--dynamic-text-colors)]" style={{
                          "--dynamic-colors": colorParser(props?.color || 'dark-purple'),
                                    "--dynamic-text-colors": textColorParser(props?.color || 'dark-purple')
                        }}>{props?.title}<br/><span>{props?.role}</span></TitleXl>
                      } 
                    </div>
                   

                    <div   data-animation-atoms  data-from='{"y": "40rem"}'
                    data-middle='{"y": "0" }'
                    data-to='{"y": "-40rem"}'  className="w-full grid grid-cols-1 md:grid-cols-2 gap-y-sm gap-x-lg xl:gap-x-2xl md:mt-auto">
                    {
                      props?.contacts && props?.contacts?.map((social, index)=>{
                        if(social.type === 'email'){
                          return (
                            <Link target="_blank" href={`mailto:${social.text}`} key={index} className={
                              `flex flex-1/2 gap-x-xs justify-start items-center hover:text-[var(--dynamic-text-colors)]  hover:fill-[var(--dynamic-colors)] cursor-pointer`}
                              style={{
                                "--dynamic-colors": colorParser(props.color || 'dark-purple'),
                                    "--dynamic-text-colors": textColorParser(props.color || 'dark-purple')
                              } as any} >
                                {social?.icon && listOfIcons?.[social.icon]}
                                <Text className={'flex-1 overflow-hidden text-ellipsis whitespace-nowrap'}>{social.text}</Text>
                            </Link>
                          )
                        }


                        if(social.type === 'download' && social.text){
                          return (
                            <Link target="_blank" download rel="noopener noreferrer" href={social?.href || "#"} key={index} className={
                              `flex flex-1/2 gap-x-xs justify-start items-baseline hover:text-[var(--dynamic-text-colors)]  hover:fill-[var(--dynamic-colors)] cursor-pointer`}
                              style={{
                                "--dynamic-colors": colorParser(props.color || 'dark-purple'),
                                    "--dynamic-text-colors": textColorParser(props.color || 'dark-purple')
                              } as any}> 
                                {social?.icon && listOfIcons?.[social.icon]}
                                <Text className={'flex-1 overflow-hidden text-ellipsis whitespace-nowrap'}>{social.text}</Text>
                            </Link>
                          )
                        }


                        if(social.type === 'phone'){
                          return (
                            <Link target="_blank" href={`tel:${social.text}`} key={index} className={
                              `flex flex-1/2 gap-x-xs justify-start items-center hover:text-[var(--dynamic-text-colors)]  hover:fill-[var(--dynamic-colors)] cursor-pointer`}
                              style={{
                                "--dynamic-colors": colorParser(props.color || 'dark-purple'),
                                    "--dynamic-text-colors": textColorParser(props.color || 'dark-purple')
                              } as any}> 
                                  {social?.icon && listOfIcons?.[social.icon]} 
                                <Text className={'flex-1 overflow-hidden text-ellipsis whitespace-nowrap'}>{social.text}</Text>
                            </Link>
                          )
                        }
                        

                        if(social.type === 'linkedin'){
                          return (
                            <Link target="_blank" href={`${social.text}`} key={index} className={
                              `flex flex-1/2 gap-x-xs justify-start items-baseline hover:text-[var(--dynamic-text-colors)]  hover:fill-[var(--dynamic-colors)] cursor-pointer`}
                              style={{
                                "--dynamic-colors": colorParser(props.color || 'dark-purple'),
                                    "--dynamic-text-colors": textColorParser(props.color || 'dark-purple')
                              } as any}>
                                {social?.icon && listOfIcons?.[social.icon]} 
                                <Text className={'flex-1 overflow-hidden text-ellipsis whitespace-nowrap'}>{"Linkedin"}</Text>
                            </Link>
                          )
                        }

                        return <Fragment key={index} />
                      })
                    }
                    </div>
                  </div>
                  
                  {/* quote */}
                  {
                    props?.quote ? (
                      <div  
                        data-animation-atoms
                        data-from='{"clip-path": "inset(0 100% 0 0)"}'
                        data-middle='{"clip-path": "inset(0 0% 0 0%)"}'
                        data-to='{"clip-path": "inset(0 100% 0 0)"}' 
                        className={`bg-${props?.color || 'dark-purple'} md:max-h-1/3 md:max-w-[100%] flex-1 min-h-fit px-sm pt-xl md:py-xl md:p-xl md:w-[80%] ${getQuoteWidthClass(props?.quote?.text)} flex flex-col justify-start items-start gap-y-sm w-full`}
                      >
                        <QuoteIcon className="fill-white mb-xs w-md h-md" fill="inherit" />
                        <Text className='font-gt-ultra! text-white md:line-clamp-10'>{props?.quote?.text}</Text>
                        <Small className='font-gt-ultra! font-bold! mt-xs text-white'>{props?.quote?.from}</Small>
                      </div>
                    ): (
                      <>
                       {props?.patternImageSrc && <div 
                            data-animation-atoms
                            data-from='{"clip-path": "inset(0 100% 0 0)"}'
                            data-middle='{"clip-path": "inset(0 0% 0 0%)"}'
                            data-to='{"clip-path": "inset(inset(0 100% 0 0)"}'
                            className="overflow-hidden md:bottom-0 left-0 right-0 md:pl-xl md:w-[80%]">
                          <Image 
                            
                            unoptimized src={props?.patternImageSrc} alt={props?.patternImageAlt || ''} width={props?.patternImageWidth || 731} height={props?.patternImageHeight || 337} className="w-full h-full object-cover" />
                        </div>}
                      </>
                    )
                  }
                  {/* quote */}
                </div>
                {/* leftBox */}

                

            </div>
      </div>
    );
};

export default PeopleBio;
