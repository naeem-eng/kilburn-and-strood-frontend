"use client";

import Image from "next/image";
import Link from "next/link";
import React, { memo } from "react";
import { Text, TitleSm } from "@/components/helpers/typography";
import { colorParser, textColorParser, textSafeColor } from "@/parsers";
import EmailIcon from "@/components/helpers/icons/email-icon/email-icon";
import PhoneIcon from "@/components/helpers/icons/phone-icon/phone-icon";
import DownloadIcon from "@/components/helpers/icons/download-icon/download-icon";
import LinkedInIcon from "@/components/helpers/icons/linkedin-icon/linkedin-icon";
import { PeopleGetInTouchProps } from "./people-get-in-touch.types";

const iconClass = "fill-inherit min-w-sm w-sm h-sm";

// Contact details repeated at the bottom of a profile (same data as the bio at the top)
const PeopleGetInTouch: React.FC<PeopleGetInTouchProps> = (props) => {
  const color = props?.color || "bright-red";
  const colorVars = {
    "--dynamic-colors": colorParser(color),
    "--dynamic-text-colors": textColorParser(color),
  } as React.CSSProperties;
  const linkClass = "flex gap-x-xs justify-start items-center hover:text-[var(--dynamic-text-colors)] hover:fill-[var(--dynamic-colors)] cursor-pointer";

  const leftColumn = [
    props?.email && (
      <Link key="email" href={`mailto:${props.email}`} className={linkClass} style={colorVars}>
        <EmailIcon className={iconClass} fill="inherit" />
        <Text textSize="text-[18px] sm:text-base " className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">{props.email}</Text>
      </Link>
    ),
    ...props.phones.map((phone) => (
      <Link key={phone.href} href={phone.href} className={linkClass} style={colorVars}>
        <PhoneIcon className={iconClass} fill="inherit" />
        <Text textSize="text-[18px] sm:text-base " className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">{phone.text}</Text>
      </Link>
    )),
  ].filter(Boolean);

  const rightColumn = [
    props?.vcardUrl && (
      <Link key="vcard" href={props.vcardUrl} target="_blank" download rel="noopener noreferrer" className={linkClass} style={colorVars}>
        <DownloadIcon className={iconClass} fill="inherit" />
        <Text textSize="text-[18px] sm:text-base ">Download VCard</Text>
      </Link>
    ),
    props?.linkedin && (
      <Link key="linkedin" href={props.linkedin} target="_blank" rel="noopener noreferrer" className={linkClass} style={colorVars}>
        <LinkedInIcon className={`${iconClass} mb-1`} fill="inherit" />
        <Text textSize="text-[18px] sm:text-base ">LinkedIn</Text>
      </Link>
    ),
  ].filter(Boolean);

  return (
    <div
      data-section-type="people-get-in-touch"
      data-animation={props?.isAnimation || false}
      data-animation-component
      className={`${props?.isAnimation ? "" : "no-section"} w-full bg-white px-sm md:px-xl py-xl md:py-2xl`}
    >
      <div className="bg-light-gray flex flex-col md:flex-row md:items-stretch">
        <div className="flex-1 flex flex-col md:flex-row md:items-center gap-y-md gap-x-2xl p-md md:p-lg">
          <TitleSm textSize="text-[32px] sm:text-lg" className={`md:w-[25%] text-${textSafeColor(color)}`}>
            Get in touch with {props.firstName}
          </TitleSm>

          <div className="flex-1 flex flex-col sm:flex-row gap-y-md gap-x-lg min-w-0">
            {leftColumn.length > 0 && <div className="flex flex-col gap-y-md flex-1 min-w-0">{leftColumn}</div>}
            {rightColumn.length > 0 && <div className="flex flex-col gap-y-md flex-1 min-w-0">{rightColumn}</div>}
          </div>
        </div>

        {/* mobile: inset in the grey card like the text; desktop: flush to the card's right edge */}
        {props?.imageSrc && (
          <div className="px-md pb-md md:p-0 shrink-0 sm:mt-0 mt-5">
            <div className="relative w-full aspect-[5/4] md:aspect-square md:w-[20vw] md:min-h-[20vw] overflow-hidden ">
              <Image
                src={props.imageSrc}
                alt={props?.imageAlt || ""}
                fill
                sizes="(min-width: 768px) 20vw, 100vw"
                className="object-cover object-top"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default memo(PeopleGetInTouch);
