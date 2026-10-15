"use client"
import Image from "next/image";
import { ServicesProps } from "./services.types";
import { TextLg, TextMd, TitleMd, TitleXl } from "@/components/helpers/typography";
import { Button } from "@/components/helpers/buttons";
import Link from "next/link";
import { RightArrowIcon } from "@/components/helpers/icons";
import { FractalGlass } from "@/components/interactive/fractal-glass";

import { Fragment, memo, useEffect, useMemo, useState } from "react";

const Services: React.FC<ServicesProps> = (props) => {
  const isAnimation = props?.isAnimation || false;
  const isLightAnimation = props?.isLightAnimation || false;
  const [isMdScreen, setIsMdScreen] = useState(false);

  useEffect(() => {
    setIsMdScreen(window.innerWidth >= 768 );
  }, []);

  return (
    <div
      data-animation={isAnimation}
      data-light-animation={isLightAnimation}
      data-section-type="services"
      data-animation-component
      data-primary-header
      className={`${isAnimation || isLightAnimation ? 'invisible' : ''} xl:h-svh w-full overflow-clip`} style={{
        zIndex: props.index
      }}>
      <div className="relative w-full h-full">
        <div className="services-image-container z-1 relative col-span-full lg:col-[1/span_2] row-1 overflow-clip aspect-square  lg:aspect-video md:h-auto h-[100vh] md:max-h-[86vh] md:max-w-[80vw] w-full">
          {props?.imageSrc &&
            <div
              className="flex justify-end items-end relative w-full h-full"
              data-animation-atoms
              data-from='{"clip-path": "inset(0 100% 0 0)"}'
              data-middle='{"clip-path": "inset(0 0% 0 0%)"}'
              data-to='{"clip-path": "inset(0 0% 0 100%)"}'
              data-mobile-from='{"clip-path": "inset(0 0 100%)"}'
              data-mobile-middle='{"clip-path": "inset(0 0 0%)"}'
              data-mobile-start="top 80%"
            >
                    
              <FractalGlass
                     videoSrc={null}
                     imgSrc={props.imageSrc}
                     lerpFactor={0.035}
                      parallaxStrength={0.1}
                      distortionMultiplier={0.2}
                      glassStrength={1.5}
                      glassSmoothness={0.00001}
                      stripesFrequency={20}
                      animateDistortion={true}
                      parallax={false}
                      distortionSpeed={0.2}
                     animateDistortionType="wave"
                     distortionDirection="left"
                     glassBlur={2}
                     glassWidth="40%"
                     glassHeight="100%"
                     glassPosition={typeof window !== "undefined" && window.innerWidth >= 768 && window.innerWidth < 1024 ? "center left" : "bottom left"}
                     objectPosition={typeof window !== "undefined" && window.innerWidth >= 768 && window.innerWidth < 1024 ? "center center" : "center bottom"}
                     mdObjectPosition={typeof window !== "undefined" && window.innerWidth >= 768 && window.innerWidth < 1024 ? "center center" : "right center"}
                     edgePadding={0}
                     className="w-full h-full"
              >
                  <Image unoptimized src={props?.imageSrc} alt={props?.imageAlt || ''} width={props?.imageWidth || 1200} height={props?.imageHeight || 800} className="w-full h-full object-cover" />
              </FractalGlass>
              <div className="absolute h-full bottom-0 left-0 right-0" style={{
                background: "linear-gradient(86deg, rgba(0, 0, 0, 0.60) 23.27%, rgba(0, 0, 0, 0.00) 85.75%)"
              }} />
            </div>}
          <div
            className="absolute left-0 top-xl sm:top-3xl xl:top-auto xl:bottom-2xl pl-(--padding-side) w-full max-w-[10em] lg:max-w-full xl:w-[10em] text-3xl"
            data-animation-atoms
            data-from='{"opacity": "0"}'
            data-middle='{"opacity": "1"}'
            data-to='{"opacity": "0"}'
            data-mobile-from='{"opacity": "0"}'
            data-mobile-middle='{"opacity": "1"}'
            data-mobile-trigger=".text-container"
            data-mobile-start="top 90%"
          >
            <TitleXl as="h2" textSize="text-3xl" className={`text-white [&_span]:text-[var(--dynamic-colors)] font-weight-[400] text-left max-w-fit`}>{props?.title}</TitleXl>
            {props?.cta && <Button href={props?.cta?.href} icon='right-arrow' type={props?.cta?.type || "text"} textColor="text-white" buttonClassName="mt-md">
              {props?.cta?.text}
              </Button>}
          </div>
        </div>
        {props?.image2Src && <div
          className="col-1 row-2 hidden lg:block max-w-[80%]"
          data-animation-atoms
          data-from='{"y": "-100%"}'
          data-middle='{"y": "0%"}'
          data-to='{"y": "-100%"}'
        >
          <Image unoptimized src={props?.image2Src} alt={props?.image2Alt || ''} width={props?.image2Width || 613} height={props?.image2Height || 129} className="w-[80%] h-auto block ml-auto" />
        
        </div>}

        <div
        className="services-list pt-0 xl:pt-(--padding-top) lg:w-[60%] xl:w-[60%] lg:ml-auto z-1  grid grid-cols-2 md:mt-0 mt-[-70vh] relative  md:absolute top-0 right-0 md:grid-cols-3 grid-rows-3 w-auto md:max-h-[clamp(0px,140svh,900px)] xl:max-h-[100svh] h-full"
        >
          {!isMdScreen && <div className={`filler flex-1 aspect-square`} />}
          {
            props?.servicesList?.map((row, index, arr) => {
              return <Fragment key={index}>
                {
                  row?.map((item:any, i) => {
                    // console.log(row, Object.keys(item).length == 0, props?.media3Src, i, arr.length-1)
                    if(arr.length-1 == i && Object.keys(item).length == 0) {
                      // if(arr.length-1 == i ) {
                        return <Fragment key={i}>
                          {props?.media3Src && <div
                                className={` aspect-square w-full h-full overflow-hidden`}
                                data-animation-atoms
                                data-from={`{"y": "700%"}`}
                                data-middle='{"y": "0%"}'
                                data-to={`{"y": "-100%"}`}
                                >
                                  {props?.media3Type === "image" && <Image unoptimized={Boolean(props?.media3Src)} src={props?.media3Src || "/images/services-list-end.png"} alt={props?.media3Alt || "Services Pattern"} width={props?.media3Width || 613} height={props?.media3Height || 129} className="w-full h-full object-cover" />}
                                  {props?.media3Type === "video" && <video src={props?.media3Src} autoPlay loop muted playsInline preload="auto" className="w-full h-full object-cover" />}
                                </div>}
                        </Fragment>
                      // } else {
                      //   if(Object.keys(item).length === 0) {
                      //     if(!isMdScreen) {
                      //       return <Fragment key={i}></Fragment>
                      //     }
                      //     return <div key={i} className={`filler flex-1`} />;
                      //   }
                      // }
                    }else {
                        if(Object.keys(item).length === 0) {
                          if(!isMdScreen) {
                            return <Fragment key={i}></Fragment>
                          }
                          return <div key={i} className={`filler flex-1`} />;
                        }
                      }
                    
                    return (
                      <Link 
                        href={item?.href || "#"}
                        key={i}
                        className={` h-full w-full group bg-${item?.backgroundColor} p-md md:p-lg flex flex-col gap-y-3`}
                        data-animation-atoms
                        data-from={`{"y": "${(index + 1) * 100}%"}`}
                        data-middle='{"y": "0%"}'
                        data-to={`{"y": "-${((props?.servicesList?.length || 0) + 1 - index) * 100}%"}`}
                        data-tablet-from='{"y": "100%"}'
                        data-tablet-middle='{"y": "0%"}'
                        data-tablet-start="top center"
                        data-mobile-from='{"y": "100%"}'
                        data-mobile-middle='{"y": "0%"}'
                        data-mobile-start="top center"
                        >
                        <TextLg as="h3" className={`services-list-item-title mb-xs font-gt-ultra text-${item.textColor}`}>{item.title}</TextLg>
                        <RightArrowIcon className={`h-md w-md group-hover:translate-x-[.4vw] duration-[500ms] transition relative`} fill={item.textColor} />
                      </Link>
                    )
                  })
                }
              </Fragment>
            })
          }
          {/* <div className={`filler`} /> */}
          {/* {
            props?.servicesList?.map((item, index) => {
              // let backgroundColor = index % 2 === 0 ? "bg-white" : "bg-dark-gray";
              // if(index === 3) {
              //     backgroundColor = "bg-dark-purple"
              // }
              return (
                <Link 
                  href={item?.href || "#"}
                  key={index}
                  className={` h-full w-full group bg-${item.backgroundColor} p-md md:p-lg flex flex-col gap-y-3`}
                  data-animation-atoms
                  data-from={`{"y": "${(index + 1) * 100}%"}`}
                  data-middle='{"y": "0%"}'
                  data-to={`{"y": "-${((props?.servicesList?.length || 0) + 1 - index) * 100}%"}`}
                  data-tablet-from='{"y": "100%"}'
                  data-tablet-middle='{"y": "0%"}'
                  data-tablet-start="top center"
                  data-mobile-from='{"y": "100%"}'
                  data-mobile-middle='{"y": "0%"}'
                  data-mobile-start="top center"
                  >
                  <TextLg as="h3" className={`services-list-item-title mb-xs font-gt-ultra text-${item.textColor}`}>{item.title}</TextLg>
                  <RightArrowIcon className={`h-md w-md group-hover:translate-x-[.4vw] duration-[500ms] transition relative`} fill={item.textColor} />
                </Link>
              )
            })
          } */}
          {/* {props?.servicesList && (props?.servicesList?.length > 4)  ? <>
          </> : <>
          {props?.image3Src && <div
            className={` aspect-square w-full h-full overflow-hidden`}
            data-animation-atoms
            data-from={`{"y": "700%"}`}
            data-middle='{"y": "0%"}'
            data-to={`{"y": "-100%"}`}
            >
              <Image unoptimized={Boolean(props?.image3Src)} src={props?.image3Src || "/images/services-list-end.png"} alt={props?.image3Alt || "Services Pattern"} width={props?.image3Width || 613} height={props?.image3Height || 129} className="w-full h-full object-cover" />
            </div>}
          </>} */}
         
        </div>
      </div>
    </div >
  );
};

export default memo(Services);
