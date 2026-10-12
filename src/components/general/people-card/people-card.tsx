"use client";

import Image from "next/image";
import { PeopleCardProps } from "./people-card.types";
import { Text, TextLg } from "@/components/helpers/typography";
import { memo, useEffect, useRef, useState } from "react";
import { RightArrowIcon } from "@/components/helpers/icons";
import Link from "next/link";

const PeopleCard: React.FC<PeopleCardProps> = (props) => {
  const isList = props?.type === "list";

  const detailsRef = useRef<HTMLDivElement>(null);
  const mainContainerRef = useRef<HTMLDivElement>(null);
  const mainOverlayContainerRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>(0);

  useEffect(() => {
    if (isList) return;
    if (!mainOverlayContainerRef?.current || !detailsRef?.current || !mainContainerRef?.current || !titleRef?.current) return;
    const details = detailsRef.current;
    const title = titleRef.current;

    let timeout: ReturnType<typeof setTimeout>;
    const resize = () => {
      setHeight(-1);
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        const titleHeight = title?.clientHeight || 0;
        const detailsHeight = details?.clientHeight || 0;
        setHeight(detailsHeight + titleHeight + 50);
      }, 100);
    };

    window.addEventListener("resize", resize);
    resize();
    return () => {
      clearTimeout(timeout);
      window.removeEventListener("resize", resize);
    };
  }, [isList]);

  const href = props?.href || (props?.slug ? "/people/" + props?.slug : "#");
  const target = props?.href ? "_blank" : undefined;
  const rel = props?.href ? "noopener noreferrer" : undefined;

  /* ---------------------------------------------------------------
   * LIST VARIANT — horizontal row: image left, name/tag, arrow right
   * ------------------------------------------------------------- */
  if (isList) {
    return (
      <Link
        href={href}
        target={target}
        rel={rel}
        className="group flex w-full items-stretch bg-[#F2F2F2] text-left cursor-pointer overflow-hidden"
      >
        {props?.imageSrc && (
          <div className="relative w-[31%] max-w-[195px] aspect-[195/169] shrink-0 overflow-hidden">
            <Image
              unoptimized
              src={props.imageSrc}
              alt={props?.imageAlt || ""}
              width={props?.imageWidth || 301}
              height={props?.imageHeight || 401}
              className="absolute inset-0 w-full h-full object-cover object-top transition-transform duration-400 ease-in-out group-hover:scale-110"
            />
          </div>
        )}

        <div className="flex flex-1 items-center justify-between gap-x-md px-md md:px-lg py-sm">
          <div className="flex-1 min-w-0">
            {props?.title && <TextLg className="text-dark-gray">{props.title}</TextLg>}
            {props?.tag && <Text className="text-dark-gray mt-2xs">{props.tag}</Text>}
          </div>

          <RightArrowIcon
            fill="currentColor"
            className="w-lg h-lg shrink-0 text-dark-gray transition-transform duration-300 ease-in-out group-hover:translate-x-1"
          />
        </div>
      </Link>
    );
  }

  /* ---------------------------------------------------------------
   * CARD VARIANT (default) — unchanged
   * ------------------------------------------------------------- */
  return (
    <Link href={href} target={target} rel={rel} id="peopleHovered" type="button" className={`w-1/2 min-w-1/2 max-w-1/2 sm:w-1/3 sm:min-w-1/3 sm:max-w-1/3 md:w-1/4 md:min-w-1/4 md:max-w-1/4  cursor-pointer text-left px-xs min-h-0 flex-1 self-stretch group`}>
      <div className="relative h-full overflow-hidden">
        <div className="inner-people-card relative h-full group-hover:scale-120 transition-all duration-400 ease-in-out">
          {props?.imageSrc && <Image unoptimized src={props?.imageSrc} alt={props?.imageAlt || ''} width={props?.imageWidth || 301} height={props?.imageHeight || 401} className="w-full h-full object-cover" style={{
            width: "clamp(200px, 25vw, 25vw)",
            height: "clamp(260px, 33vw, 33vw)",
          }}
          />}
        </div>
        {(props?.title || props?.tag) && <div ref={mainContainerRef} className={`absolute bottom-0 left-0 right-0 pt-md p-md flex flex-col justify-end`} style={{
          height: `${height < 0 ? 'auto' : height + "px"}`
        }}>

          <div ref={mainOverlayContainerRef} className={`transition-all ease-in-out duration-400 absolute bottom-0 left-0 top-full group-hover:top-0 right-0 bg-black/10 backdrop-blur px-md flex flex-col justify-end overflow-hidden h-full`}>
            <div className="pb-sm" ref={detailsRef}>
            </div>
          </div>

          <div ref={titleRef} className="flex relative z-2 group-hover:flex-1 transition-all ease-in-out duration-400">
            <div className="flex-1">
              {props?.title && <TextLg className="text-white font-modern-era-medium">{props?.title}</TextLg>}
              {props?.tag && <Text className="text-white mt-2xs">{props?.tag}</Text>}
            </div>

            <div className={`relative top-[calc(100%-5vh)] transition-all duration-400 group-hover:opacity-100 group-hover:top-0 `}>
              <RightArrowIcon fill="#fff" className="w-lg h-lg " />
            </div>
          </div>

        </div>}

      </div>
    </Link>
  );
};

export default memo(PeopleCard);