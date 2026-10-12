"use client";
import { Button } from "@/components/helpers/buttons";
import { DropdownIcon, MenuhoverIcon } from "@/components/helpers/icons";
import RightArrowIcon from "@/components/helpers/icons/rightarrow-icon/rightarrow-icon";
import { Text, TextLg,  } from "@/components/helpers/typography/typography";
import { colorParser } from "@/parsers";
import { MenuRequestProps } from "@/parsers/global-parser/menu/menu-parser.types";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {  forwardRef, MouseEvent, useEffect, useRef, useState } from "react"
import type { MutableRefObject } from "react";

interface CustomHeaderProps {
  bottomHeaderMenu: MenuRequestProps[];
}

const BottomHeaderComponent = forwardRef<HTMLButtonElement[], CustomHeaderProps>((props:CustomHeaderProps, ref) => {

   
    const { bottomHeaderMenu } = props; 
    const dropdownMenuRef = ref as MutableRefObject<HTMLButtonElement[] | null>;
    const pathname = usePathname();

    if(!ref) return <></>;
    
    return (
        <nav className="flex flex-row gap-x-0 items-center h-full relative">
            {bottomHeaderMenu?.map((menu: MenuRequestProps, index: number) => {

                const isActive = pathname.split('/')[1] === menu.url?.split('/')[1]
                const isSubMenu = menu.menuItemHasSubmenu && menu.children.length > 0;
                const isMegaMenu = menu.subMenuIsMegaMenu && menu.children.length > 0;
                const isLink = menu.menuHasLink;
                const ctaContainer = menu.ctaContainer;

                const baseClasses = `${isSubMenu || isMegaMenu ? 'dropdownMenu' : ''} cursor-pointer no-underline!  transition border-transparent flex flex-row gap-x-[.2vw] justify-between items-center sm:text-2md text-base! text-dark-gray group mx-sm pb-sm relative after:absolute after:bottom-0 after:content-[""] after:block after:w-0 after:h-[.2vw] hover:after:w-full after:bg-bright-red after:transition-all after:duration-300 ${isActive ? 'after:w-full!' : ''}`;
                
                if(isLink && !(isMegaMenu || isSubMenu)) {
                    return (
                        <div key={index} className="flex flex-row h-full">
                            <Link 
                                href={menu.url || '#'} className={baseClasses}>
                                {menu.title}
                                <DropdownIcon className="invisible group-[.activateDropper]:rotate-180 transition-transform w-0 h-sm md:h-md mb-[0.2vw] ml-0" />
                            </Link>
                        </div>
                    )
                }

                
                return (
                    <div key={index} className="flex flex-row h-full" >
                        <button ref={(e:HTMLButtonElement)=>{
                            // @ts-ignore
                            if (e && dropdownMenuRef?.current && !dropdownMenuRef.current.includes(e)) {
                                dropdownMenuRef.current.push(e)
                            }
                        }} 
                        type="button"
                        data-slide 
                        className={baseClasses}>
                            {menu.title}
                            {(isSubMenu || isMegaMenu) ? <DropdownIcon className="group-[.activateDropper]:rotate-180 transition-transform w-auto h-sm md:h-md mb-[0.2vw] ml-2xs" /> : null}
                        </button>
                        {/* <div className=""> */}
                        {(isMegaMenu) && <div className={`isMegaMenu dropdownPanel absolute right-0 top-full flex flex-row bg-white overflow-hidden transition-height duration-300 ease-in-out justify-start items-stretch w-[70vw] max-h-[calc(100vh-4vw)] opacity-0 pointer-events-none`}>
                            <div className="flex-1 py-md px-md max-w-1/2 max-h-full overflow-hidden">
                                <Link href={menu?.url || '#'} className="flex flex-row gap-x-xs justify-start items-center no-underline! mb-md mx-sm relative after:absolute after:bottom-0 after:content-[''] after:block after:w-0 after:h-[.13vw] after:bg-bright-red  hover:after:w-full after:origin-left after:transition-all after:duration-300 max-h-fit max-w-fit group">
                                    <TextLg className="text-bright-red ">
                                        {menu.title}
                                    </TextLg>
                                    <RightArrowIcon className="w-md h-sm  group-hover:translate-x-[.3vw] transition duration-300" fill="var(--color-bright-red)" />
                                </Link>

                                {menu.children.map((child: MenuRequestProps, index: number) => {

                                    const isSubMenu = child.menuItemHasSubmenu && child.children.length > 0;
                                    const isLink = child.menuHasLink;

                                    if(isLink && !(isMegaMenu || isSubMenu)) {
                                        return (
                                            <div key={index} className="flex flex-row">
                                                <Link href={child.url || '#'} className={`no-underline! flex flex-row p-sm hover:bg-light-gray bg-transparent transition-colors duration-300 w-full justify-between items-center group my-1`}>
                                                    <div className="flex flex-col flex-1 max-w-[90%]">
                                                        <Text as='span' className="text-md! text-gray-900 font-modern-era-medium! mb-2xs">{child.title}</Text>
                                                        {child?.menuDetails && <Text as='span' className="text-medium-gray mt-1">{child.menuDetails}</Text>}
                                                    </div>
                                                    <MenuhoverIcon className="transition-opacity duration-300 w-sm h-sm opacity-0 group-hover:opacity-100" />
                                                </Link>
                                            </div>
                                        )
                                    }
                                    return (
                                      <div
                                        key={index}
                                        className="flex flex-row"
                                      >
                                        <button
                                          ref={(e: HTMLButtonElement) => {
                                            // @ts-ignore
                                            if (
                                              e &&
                                              dropdownMenuRef?.current &&
                                              !dropdownMenuRef.current.includes(
                                                e,
                                              )
                                            ) {
                                              dropdownMenuRef.current.push(e);
                                            }
                                          }}
                                          data-secondlevel-slide
                                          className={`dropdownMenu cursor-pointer no-underline! flex flex-row p-sm hover:bg-light-gray bg-transparent transition-colors duration-300 w-full justify-between items-center group my-1 [&.activateDropper]:bg-light-gray`}
                                        >
                                          <div className="flex flex-col flex-1 items-start justify-center text-left">
                                            <Text
                                              as="span"
                                              className="text-md! text-gray-900 font-modern-era-medium!"
                                            >
                                              {child.title}
                                            </Text>
                                            {child?.menuDetails && (
                                              <Text
                                                as="span"
                                                className="text-medium-gray mt-1"
                                              >
                                                {child.menuDetails}
                                              </Text>
                                            )}
                                          </div>
                                          <MenuhoverIcon className="transition-opacity duration-300 w-sm h-sm opacity-0 group-hover:opacity-100 group-[&.activateDropper]:opacity-100" />
                                        </button>
                                        {isSubMenu && (
                                          <div
                                            className={`dropdownPanel transition-all duration-300 ease-in-out absolute right-0 top-0 w-1/2 bottom-0 bg-bright-red z-9 pt-lg px-lg pb-xl overflow-y-auto`}
                                          >
                                            <div className="opac transition-opacity delay-200 duration-300 ease-in-out">
                                              <Link
                                                href={child?.url || "#"}
                                                className="flex flex-row gap-x-xs justify-start items-center no-underline! mb-md mx-sm relative after:absolute after:bottom-0 after:content-[''] after:block after:w-0 after:h-[.13vw] after:bg-white  hover:after:w-full after:origin-left after:transition-all after:duration-300 max-h-fit max-w-fit group"
                                              >
                                                <TextLg className="text-white ">
                                                  {child.title}
                                                </TextLg>
                                                <RightArrowIcon
                                                  className="w-md h-sm group-hover:translate-x-[.3vw] transition duration-300"
                                                  fill="#ffffff"
                                                />
                                              </Link>
                                              {child?.children?.map(
                                                (
                                                  secondLevelChild: MenuRequestProps,
                                                  index: number,
                                                ) => {
                                                  return (
                                                    <div
                                                      key={index}
                                                      className="flex flex-row"
                                                    >
                                                      <Link
                                                        href={
                                                          secondLevelChild.url ||
                                                          "#"
                                                        }
                                                        className={`no-underline! flex flex-row p-sm w-full justify-between items-center group my-0 text-white hover:underline!`}
                                                      >
                                                        <div className="flex flex-col flex-1">
                                                          <Text
                                                            as="span"
                                                            className="text-md! text-inherit font-modern-era-medium!"
                                                          >
                                                            {
                                                              secondLevelChild.title
                                                            }
                                                          </Text>
                                                        </div>
                                                      </Link>
                                                    </div>
                                                  );
                                                },
                                              )}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    );
                                })}
                            </div>
                            {ctaContainer && <div className={`max-w-1/2 min-w-1/2 bg-${ctaContainer.backgroundColor} flex-1 p-xl `}>
                                {ctaContainer?.ctaMedia && 
                                (
                                    ctaContainer?.ctaMediaType === 'video' ? <>
                                        {/*TODO: video component react video */}
                                    </> : 
                                    <div className="w-full">
                                        <Image unoptimized src={ctaContainer.ctaMedia} alt="Image 1"  width={600} height={400} className="w-full max-w-none object-cover" />
                                    </div>
                                )}

                                {ctaContainer?.ctaTitle && <TextLg 
                                className={`text-dark-gray mt-sm [&_span]:text-[var(--dynamic-colors)] line-clamp-3`}
                                style={{
                                    "--dynamic-colors": colorParser(ctaContainer?.color || 'dark-gray'),
                                }}>{ctaContainer.ctaTitle}</TextLg>}

                                {ctaContainer?.ctaLink && <Button style={{
                                    "--dynamic-colors": colorParser(ctaContainer?.color || 'dark-gray'),
                                }} icon='right-arrow' type="text" textColor={`text-${ctaContainer?.color}`}  buttonClassName="mt-md text-[var(--dynamic-colors)]" href={ctaContainer.ctaLink}>{ctaContainer.ctaText || "Read More"}</Button>}
                            </div>}
                        </div>}


                        {(!isMegaMenu && isSubMenu) && <div className={`isSubMenu dropdownPanel absolute right-0 top-full flex flex-col min-w-[clamp(380px,24.17vw,100vw)] max-w-[clamp(462px,29.17vw,100vw)] bg-white px-md overflow-hidden transition-height duration-300 ease-in-out opacity-0 pointer-events-none`}>
                            <div className="my-md "> 

                                {menu.children.map((child: MenuRequestProps, index: number) => {

                                    const isSubMenu = child.menuItemHasSubmenu && menu.children.length > 0;
                                    const isLink = child.menuHasLink;
                                    if(isLink && !(isMegaMenu || isSubMenu)) {
                                        return (
                                            <div key={index} className="flex flex-row">
                                                <Link href={child.url || '#'} className={`no-underline! flex flex-row p-sm hover:bg-light-gray bg-transparent transition-colors duration-300 w-full justify-between items-center group my-1`}>
                                                    <div className="flex flex-col flex-1">
                                                        <Text as='span' className="text-md! text-gray-900 font-modern-era-medium!">{child.title}</Text>
                                                        {child?.menuDetails && <Text as='span' className="text-medium-gray  mt-1">{child.menuDetails}</Text>}
                                                    </div>
                                                    <MenuhoverIcon className="transition-opacity duration-300 w-sm h-sm opacity-0 group-hover:opacity-100" />
                                                </Link>
                                            </div>
                                        )
                                    }
                                    return (
                                        <div key={index} className="flex flex-row">
                                            <a className={`cursor-pointer no-underline! flex flex-row p-sm hover:bg-white bg-transparent transition-colors duration-300 w-full justify-between items-center my-1`}>
                                                <div className="">
                                                    <Text as='span' className="text-md! text-gray-900 font-modern-era-medium!">{child.title}</Text>
                                                    {child?.menuDetails && <Text as='span' className="text-medium-gray  mt-1">{child.menuDetails}</Text>}
                                                </div>
                                                <MenuhoverIcon className="transition-opacity duration-300 w-sm h-sm opacity-0 group-hover:opacity-100" />
                                            </a>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>}
                        {/* </div> */}

                        {/* <div className="md:px-xl w-full md:block hidden "> */}
                            {/* <div ref={(r)=>{
                                bottomBorderContainerRef.current = r as HTMLElement;
                            }} className={`absolute bottom-0 h-[.4vw] md:h-[.2vw] bg-bright-red transition-all duration-300 ease-in-out w-0`} style={{
                                
                            }}/> */}
                        {/* </div> */}
                    </div>
                )
            })}
        </nav>
    )
}
)

export default BottomHeaderComponent