"use client";
import { Button } from "@/components/helpers/buttons";
import Buttons from "@/components/helpers/buttons/buttons";
import { DropdownIcon, MenuhoverIcon, SearchIcon } from "@/components/helpers/icons";
import RightArrowIcon from "@/components/helpers/icons/rightarrow-icon/rightarrow-icon";
import { Small, Text, TextLg, TextMd, TextXl, TitleMd, TitleXl } from "@/components/helpers/typography/typography";
import { colorParser } from "@/parsers";
import { MenuRequestProps } from "@/parsers/global-parser/menu/menu-parser.types";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo, useEffect, useRef, forwardRef } from "react"
import type { MutableRefObject } from "react";
interface CustomHeaderProps {
  topHeaderMenu: MenuRequestProps[];
}

const TopHeaderComponent = forwardRef<HTMLButtonElement[], CustomHeaderProps>((props:CustomHeaderProps, ref) => {

   
    const { topHeaderMenu } = props;
    const dropdownMenuRef = ref as MutableRefObject<HTMLButtonElement[] | null>;
    const pathname = usePathname();
    
    if(!ref) return <></>;

    return (
        <nav className="flex flex-row gap-x-sm mb-2xs md:mb-2xs">
                {topHeaderMenu?.map((menu: MenuRequestProps, index: number) => {

                    const isActive = pathname.split('/')[1] === menu.url?.split('/')[1]

                    const isSubMenu = menu.menuItemHasSubmenu && menu.children.length > 0;
                    const isMegaMenu = menu.subMenuIsMegaMenu && menu.children.length > 0;
                    const isLink = menu.menuHasLink;

                    const baseClasses = `${isSubMenu || isMegaMenu ? 'dropdownMenu pl-0 ' : 'px-0'} cursor-pointer no-underline! pt-sm border-b-[.2vw] transition border-transparent flex flex-row gap-x-[.2vw] justify-between items-center text-sm! text-dark-gray group pb-2xs relative after:absolute after:bottom-0 after:content-[""] after:block after:w-0 after:h-[.2vw] hover:after:w-full after:bg-bright-red after:transition-all after:duration-300 ${isActive ? 'after:w-full!' : ''}`;
                    
                    if(isLink) {
                        return (
                            <div key={index} className="flex flex-row">
                                <Link href={menu.url || '#'} className={baseClasses}>
                                    {menu.title}
                                </Link>
                            </div>
                        )
                    }

                    
                    return (
                        <div key={index} className="flex flex-row relative">
                            <button ref={(e:HTMLButtonElement)=>{
                                //@ts-ignore
                                if (e && dropdownMenuRef?.current && !dropdownMenuRef.current.includes(e)) {
                                    dropdownMenuRef.current.push(e)
                                }
                            }} data-dropdown className={baseClasses}>
                                {menu.title}
                                {(isSubMenu || isMegaMenu) ? <DropdownIcon className="group-[.activateDropper]:rotate-180 transition-transform w-auto h-sm  mb-[0.2vw] ml-2xs" /> : null}
                            </button>
                            {(isSubMenu || isMegaMenu) && <div className={`dropdownPanel absolute right-0 top-full flex flex-col min-w-[clamp(380px,24.17vw,100vw)] bg-light-gray px-md py-0 h-0 overflow-hidden transition-all duration-300 ease-in-out`}>
                                <div className="my-lg">
                                    <Link href={menu?.url || '#'} className="flex flex-row gap-x-xs justify-start items-center no-underline! mb-md mx-sm relative after:absolute after:bottom-0 after:content-[''] after:block after:w-0 after:h-[.13vw] after:bg-bright-red  hover:after:w-full after:origin-left after:transition-all after:duration-300 max-h-fit max-w-fit group" >
                                        <TextLg className="text-bright-red ">
                                            {menu.title}
                                        </TextLg>
                                        <RightArrowIcon className="w-md h-sm  group-hover:translate-x-[.3vw] transition duration-300" fill="var(--color-bright-red)" />
                                    </Link>

                                    {menu.children.map((child: MenuRequestProps, index: number) => {

                                        const isSubMenu = child.menuItemHasSubmenu && menu.children.length > 0;
                                        const isLink = child.menuHasLink;
                                        if(isLink) {
                                            return (
                                                <div key={index} className="flex flex-row">
                                                    <Link href={child.url || '#'} className={`no-underline! flex flex-row p-sm hover:bg-white bg-transparent transition-colors duration-300 w-full justify-between items-center group`}>
                                                        <div className="flex flex-col flex-1">
                                                            <Text as='span' className="text-md! text-gray-900 font-modern-era-medium!">{child.title}</Text>
                                                            {child?.menuDetails && <Small as='span' className="text-medium-gray  mt-1">{child.menuDetails}</Small>}
                                                        </div>
                                                        <MenuhoverIcon className="transition-opacity duration-300 w-sm h-sm opacity-0 group-hover:opacity-100" />
                                                    </Link>
                                                </div>
                                            )
                                        }
                                        return (
                                            <div key={index} className="flex flex-row">
                                                <a className={`cursor-pointer no-underline! flex flex-row p-sm hover:bg-white bg-transparent transition-colors duration-300 w-full justify-between items-center`}>
                                                    <div className="flex flex-col flex-1">
                                                        <Text as='span' className="text-md! text-gray-900 font-modern-era-medium!">{child.title}</Text>
                                                        {child?.menuDetails && <Small as='span' className="text-medium-gray  mt-1">{child.menuDetails}</Small>}
                                                    </div>
                                                    <MenuhoverIcon className="transition-opacity duration-300 w-sm h-sm opacity-0 group-hover:opacity-100" />
                                                </a>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>}
                        </div>
                    )
                })}
            </nav>
    )
}
)

export default TopHeaderComponent