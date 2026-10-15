"use client";


import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { memo, useEffect, useRef, useState } from "react"
import TopHeaderComponent from "./top-header-component";
import BottomHeaderComponent from "./bottom-header-component";
import SearchHeaderComponent from "./search-header-component";
import MobileHeaderComponent from "./mobile-header-component";
import useCustomHeaderHook from "./hooks/useCustomHeaderHook"; 
import { MenuRequestProps } from "@/parsers/global-parser/menu/menu-parser.types";

interface CustomHeaderProps {
  menu: MenuRequestProps[];
  logo: string;
}

const CustomHeaderComponent: React.FC<CustomHeaderProps> = (props: CustomHeaderProps) => {

    // const [headerHeight, setHeaderHeight] = useState<number>(0);

    const {
        onClickMobileReset,
        mobileMenuRef,
        dropdownMenuRef,
        headerRef,
        bottomHeaderMenu,
        topHeaderMenu,
        scrolledDown,
        setScrolledDown,
        resetAllMobileMenus
    } = useCustomHeaderHook(props);

    

    return (
        <>
            <div
                onFocusCapture={() => setScrolledDown(false)}
                className={`logo-container will-change-transform transition-all duration-700 fixed left-sm md:left-xl z-100 bg-transparent isolate text-left max-w-[50%] md:top-xl xl:top-xl top-[18px] md:opacity-100`}
                style={{
                    willChange: 'transform',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: scrolledDown ? 'translateY(-10vw)' : 'translateY(0)',
                    opacity: 1,
                }}
            >
                <Link href={'/'} className={`logo`}>
                    <Image suppressHydrationWarning src={props?.logo} alt="Kilburn & Strode – home" width={300} height={60}
                        className={`md:max-w-none object-cover max-w-full sm:w-auto md:w-[20vw] transition-transform transform duration-700 origin-top-left`}
                    />
                </Link>
            </div>
            <div 
             onMouseEnter={e=>setScrolledDown(false)}
             className="w-full h-[.5vw] hidden sm:block  bg-transparent fixed top-0 left-0 right-0 z-50"></div>
            <header
                ref={headerRef}
                onFocusCapture={() => setScrolledDown(false)}
                id={"header"}
                className={`fixed top-0 w-full z-50 flex  will-change-transform flex-col justify-between items-center isolate px-sm md:px-xl h-[50px] md:h-auto transition-all duration-700 pb-0 bg-white`}
                style={{
                    willChange: 'transform',
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: scrolledDown ? 'translateY(-10vw)' : 'translateY(0)',
                    opacity: 1,
                }}
            >
                <div className="flex w-full h-full flex-row justify-between items-stretch mt-auto">
                    <div className="flex flex-col items-stretch w-full h-full 2xs">
                        <div className="w-full md:flex justify-end hidden relative z-2">
                            <TopHeaderComponent topHeaderMenu={topHeaderMenu} ref={dropdownMenuRef} />
                        </div>
                        <div className="h-auto items-center md:flex justify-end hidden mt-2xs">
                            <BottomHeaderComponent bottomHeaderMenu={bottomHeaderMenu} ref={dropdownMenuRef} />
                            <SearchHeaderComponent ref={dropdownMenuRef} />
                        </div>
                    </div>

                    {/* mobile navigation */}
                    <MobileHeaderComponent resetAllMobileMenus={resetAllMobileMenus} topHeaderMenu={topHeaderMenu} bottomHeaderMenu={bottomHeaderMenu} ref={mobileMenuRef} onClickMobileReset={onClickMobileReset} />
                    {/* mobile navigation */}

                </div>
            </header>
            <div id="header-placeholder" />
        </>

    )
}

export default memo(CustomHeaderComponent)