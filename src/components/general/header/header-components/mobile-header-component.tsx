import Buttons from "@/components/helpers/buttons/buttons";
import { DropdownIcon, LeftArrowIcon,  MenuIcon, SearchIcon } from "@/components/helpers/icons";
import { Text,  TextMd,  TitleMd, } from "@/components/helpers/typography/typography";
import { MenuRequestProps } from "@/parsers/global-parser/menu/menu-parser.types";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { forwardRef, useState,  } from "react"
import type { MutableRefObject } from "react";
import { useRouter } from 'next/navigation';

interface CustomHeaderProps {
  bottomHeaderMenu: MenuRequestProps[];
  topHeaderMenu: MenuRequestProps[];
  onClickMobileReset: (e:any) => void;
  resetAllMobileMenus: (e:any) => void;
}


const MobileHeaderComponent = forwardRef<HTMLButtonElement[], CustomHeaderProps>((props:CustomHeaderProps, ref) => {

    const router = useRouter();
    const { bottomHeaderMenu, onClickMobileReset, resetAllMobileMenus, topHeaderMenu } = props;
    const mobileMenuRef = ref as MutableRefObject<HTMLButtonElement[] | null>;
    const pathname = usePathname();
    const [value, setValue] = useState<string | null>(null);

    const onChangeValue = (e:any) => {
        const value = e.target.value
        //console.log({value})
        setValue(value)
    }
    
    const search = (e:any)=>{
        if(value) {
            router.push(`/search?q=${encodeURIComponent(value.trim())}`);
            resetAllMobileMenus(e);
        }
    }

    return (
        <div className="h-full items-center flex justify-end md:hidden">
                    <div className="h-full items-center flex ">
                        <button ref={(e:HTMLButtonElement)=>{
                                             // @ts-ignore
                                                if (e && mobileMenuRef?.current && !mobileMenuRef.current.includes(e)) {
                                                    mobileMenuRef.current.push(e)
                                                }
                                            }}  type="button">
                            <MenuIcon className="w-lg h-lg" />
                        </button>
                        <div className="absolute top-[50px] md:top-[15vw] right-0 left-0 bg-white h-[0px] overflow-y-auto overflow-x-hidden [&.mobilePanel]:h-[calc(100vh-8vw)] transition-all duration-300 ease-in-out">


                            <nav className="py-lg flex flex-col gap-y-lg min-h-full">
                                {bottomHeaderMenu?.map((menu: MenuRequestProps, index: number) => {
                                        
                                        const isActive = pathname.split('/')[1] === menu.url?.split('/')[1]
                                        const isSubMenu = menu.menuItemHasSubmenu && menu.children.length > 0;
                                        const isMegaMenu = menu.subMenuIsMegaMenu && menu.children.length > 0;
                                        const isLink = menu.menuHasLink;
                                        // const ctaContainer = menu.ctaContainer;

                                        const baseClasses = `${isSubMenu || isMegaMenu ? 'pl-md' : 'px-md'} cursor-pointer no-underline! flex flex-row gap-x-[.2vw] justify-between items-center text-xl!  font-modern-era-medium  ${isActive ? 'text-bright-red':'text-dark-gray'}`;

                                        if(isLink  && !(isMegaMenu || isSubMenu)) {
                                            return (
                                                <div key={index} className="flex flex-row ">
                                                    <Link href={menu.url || '#'} className={baseClasses}>
                                                        {menu.title}
                                                    </Link>
                                                </div>
                                            )
                                        }
                                        return (
                                            <div key={index} className="mobileMenuContainer">
                                                <button ref={(e:HTMLButtonElement)=>{
                                                    // @ts-ignore
                                                    if (e && mobileMenuRef?.current && !mobileMenuRef.current.includes(e)) {
                                                        mobileMenuRef.current.push(e)
                                                    }
                                                }} className={baseClasses}>
                                                    {menu.title}
                                                    {(isSubMenu || isMegaMenu) ? <DropdownIcon fill="var(--color-bright-red)" className="w-lg h-lg mb-[.2vw] transform rotate-270 group-[.activateDropper]:rotate-180" strokeWidth="2" /> : null}
                                                </button>
                                                {(isSubMenu || isMegaMenu) && <div className={`w-full absolute right-0 top-0 left-0 bg-white min-h-full translate-x-full py-lg flex flex-col gap-y-xl [&.mobilePanel]:translate-x-0 z-50 transition-all duration-300 ease-in-out`}>
                                                    
                                                    <div className="flex flex-row gap-x-xs justify-start items-center no-underline! px-lg">
                                                        <button onClick={onClickMobileReset} className="">
                                                            <LeftArrowIcon className="w-lg h-lg" fill="var(--color-bright-red)" />
                                                        </button>
                                                        <Link href={menu?.seoSlug || '#'}>
                                                            <TitleMd className="text-bright-red ">
                                                                {menu.title}
                                                            </TitleMd>
                                                        </Link>
                                                    </div>

                                                    {menu.children.map((child: MenuRequestProps, index: number) => {
                                                        
                                                        const isSubMenu = child.menuItemHasSubmenu && child.children.length > 0;
                                                        const isLink = child.menuHasLink;
                                                        const isActive = pathname.split('/')?.[2] === child.url?.split('/')?.[2]
                                                        
                                                        if(isLink) {
                                                            return (
                                                                <div key={index} className="flex flex-row ">
                                                                    <Link href={child.url || '#'} className={`no-underline! flex flex-row px-lg w-full justify-start gap-x-md items-center group ${isActive?'text-bright-red':'text-dark-gray'}`}>
                                                                        <div className="flex flex-col">
                                                                            <Text as='span' className="text-lg! text-gray-900 font-modern-era-medium!">{child.title}</Text>
                                                                            {child?.menuDetails && <Text as='span' className="text-medium-gray mt-1">{child.menuDetails}</Text>}
                                                                        </div>
                                                                    </Link>
                                                                </div>
                                                            )
                                                        }
                                                        return (
                                                            <div key={index} className="flex flex-col">
                                                                <button ref={(e:HTMLButtonElement)=>{
                                                                            // @ts-ignore
                                                                            if (e && mobileMenuRef?.current && !mobileMenuRef.current.includes(e)) {
                                                                                mobileMenuRef.current.push(e)
                                                                            }
                                                                        }} data-mobile-second-level={isSubMenu ? 'true' : undefined} type="button" className={`cursor-pointer no-underline! flex flex-row px-lg w-full justify-start items-center group gap-x-md `}>
                                                                    <div className="flex flex-col text-left">
                                                                        <Text as='span' className={`text-lg! font-modern-era-medium! flex justify-start items-center ${isActive?'text-bright-red':'text-dark-gray'}`}>
                                                                            {child.title}
                                                                            <DropdownIcon className="w-lg h-lg mb-[.8vw] transform group-[.activateDropper]:-rotate-180 transition-transform duration-300 ease-in-out" strokeWidth="2" fill="var(--color-bright-red)" />
                                                                        </Text>
                                                                        {child?.menuDetails && <Text as='span' className="text-medium-gray">{child.menuDetails}</Text>}
                                                                    </div> 
                                                                </button>
                                                                {isSubMenu && <div className={`bg-light-gray py-0 px-lg mt-xs flex flex-col gap-y-lg h-0 overflow-hidden [&.mobilePanel]:h-auto [&.mobilePanel]:py-lg transition-all duration-300 ease-in-out `}>
                                                                    {
                                                                        child.children.map((subChild: MenuRequestProps, index: number) => {
                                                                            const isActive = pathname.split('/')?.[3] === subChild.url?.split('/')?.[3]

                                                                            return (
                                                                                <div key={index}>
                                                                                    <Link href={subChild.url || '#'} className={`flex flex-row justify-start items-center no-underline! ${isActive?'text-bright-red':'text-dark-gray'}`}>
                                                                                        <TextMd className="text-inherit font-modern-era-medium">
                                                                                            {subChild.title}
                                                                                        </TextMd>
                                                                                    </Link>
                                                                                </div>
                                                                            )
                                                                        })
                                                                    }
                                                                </div>}

                                                            </div>
                                                        )
                                                    })}

                                                </div>}
                                            </div>
                                        )
                                })}


                                {topHeaderMenu?.map((menu: MenuRequestProps, index: number) => {
                                        
                                        const isActive = pathname.split('/')[1] === menu.url?.split('/')[1]
                                        const isSubMenu = menu.menuItemHasSubmenu && menu.children.length > 0;
                                        const isMegaMenu = menu.subMenuIsMegaMenu && menu.children.length > 0;
                                        const isLink = menu.menuHasLink;
                                        // const ctaContainer = menu.ctaContainer;

                                        const baseClasses = `${isSubMenu || isMegaMenu ? 'pl-md' : 'px-md'} cursor-pointer no-underline! flex flex-row gap-x-[.2vw] justify-between items-center text-xl!  font-modern-era-medium  ${isActive ? 'text-bright-red':'text-dark-gray'}`;

                                        if(isLink  && !(isMegaMenu || isSubMenu)) {
                                            return (
                                                <div key={index} className="flex flex-row ">
                                                    <Link href={menu.url || '#'} className={baseClasses}>
                                                        {menu.title}
                                                    </Link>
                                                </div>
                                            )
                                        }
                                        return (
                                            <div key={index} className="mobileMenuContainer">
                                                <button ref={(e:HTMLButtonElement)=>{
                                                    // @ts-ignore
                                                    if (e && mobileMenuRef?.current && !mobileMenuRef.current.includes(e)) {
                                                        mobileMenuRef.current.push(e)
                                                    }
                                                }} className={baseClasses}>
                                                    {menu.title}
                                                    {(isSubMenu || isMegaMenu) ? <DropdownIcon fill="var(--color-bright-red)" className="w-lg h-lg mb-[.2vw] transform rotate-270 group-[.activateDropper]:rotate-180" strokeWidth="2" /> : null}
                                                </button>
                                                {(isSubMenu || isMegaMenu) && <div className={`w-full absolute right-0 top-0 left-0 bg-white min-h-full translate-x-full py-lg flex flex-col gap-y-xl [&.mobilePanel]:translate-x-0 z-50 transition-all duration-300 ease-in-out`}>
                                                    
                                                    <div className="flex flex-row gap-x-xs justify-start items-center no-underline! px-lg">
                                                        <button onClick={onClickMobileReset} className="">
                                                            <LeftArrowIcon className="w-lg h-lg" fill="var(--color-bright-red)" />
                                                        </button>
                                                        <Link href={menu?.seoSlug || '#'}>
                                                            <TitleMd className="text-bright-red ">
                                                                {menu.title}
                                                            </TitleMd>
                                                        </Link>
                                                    </div>

                                                    {menu.children.map((child: MenuRequestProps, index: number) => {
                                                        
                                                        const isSubMenu = child.menuItemHasSubmenu && child.children.length > 0;
                                                        const isLink = child.menuHasLink;
                                                        const isActive = pathname.split('/')?.[2] === child.url?.split('/')?.[2]
                                                        
                                                        if(isLink) {
                                                            return (
                                                                <div key={index} className="flex flex-row ">
                                                                    <Link href={child.url || '#'} className={`no-underline! flex flex-row px-lg w-full justify-start gap-x-md items-center group ${isActive?'text-bright-red':'text-dark-gray'}`}>
                                                                        <div className="flex flex-col">
                                                                            <Text as='span' className="text-lg! text-gray-900 font-modern-era-medium!">{child.title}</Text>
                                                                            {child?.menuDetails && <Text as='span' className="text-medium-gray mt-1">{child.menuDetails}</Text>}
                                                                        </div>
                                                                    </Link>
                                                                </div>
                                                            )
                                                        }
                                                        return (
                                                            <div key={index} className="flex flex-col">
                                                                <button ref={(e:HTMLButtonElement)=>{
                                                                            // @ts-ignore
                                                                            if (e && mobileMenuRef?.current && !mobileMenuRef.current.includes(e)) {
                                                                                mobileMenuRef.current.push(e)
                                                                            }
                                                                        }} data-mobile-second-level={isSubMenu ? 'true' : undefined} type="button" className={`cursor-pointer no-underline! flex flex-row px-lg w-full justify-start items-center group gap-x-md `}>
                                                                    <div className="flex flex-col text-left">
                                                                        <Text as='span' className={`text-lg! font-modern-era-medium! flex justify-start items-center ${isActive?'text-bright-red':'text-dark-gray'}`}>
                                                                            {child.title}
                                                                            <DropdownIcon className="w-lg h-lg mb-[.8vw] transform group-[.activateDropper]:-rotate-180 transition-transform duration-300 ease-in-out" strokeWidth="2" fill="var(--color-bright-red)" />
                                                                        </Text>
                                                                        {child?.menuDetails && <Text as='span' className="text-medium-gray">{child.menuDetails}</Text>}
                                                                    </div> 
                                                                </button>
                                                                {isSubMenu && <div className={`bg-light-gray py-0 px-lg mt-xs flex flex-col gap-y-lg h-0 overflow-hidden [&.mobilePanel]:h-auto [&.mobilePanel]:py-lg transition-all duration-300 ease-in-out `}>
                                                                    {
                                                                        child.children.map((subChild: MenuRequestProps, index: number) => {
                                                                            const isActive = pathname.split('/')?.[3] === subChild.url?.split('/')?.[3]

                                                                            return (
                                                                                <div key={index}>
                                                                                    <Link href={subChild.url || '#'} className={`flex flex-row justify-start items-center no-underline! ${isActive?'text-bright-red':'text-dark-gray'}`}>
                                                                                        <TextMd className="text-inherit font-modern-era-medium">
                                                                                            {subChild.title}
                                                                                        </TextMd>
                                                                                    </Link>
                                                                                </div>
                                                                            )
                                                                        })
                                                                    }
                                                                </div>}

                                                            </div>
                                                        )
                                                    })}

                                                </div>}
                                            </div>
                                        )
                                })}

                                <div onClick={e=>e.stopPropagation()} className="flex flex-row gap-x-xs justify-start items-center px-lg mobileMenuContainer mt-auto py-md">
                                    <button ref={(e:HTMLButtonElement)=>{
                                        // @ts-ignore
                                        if (e && mobileMenuRef?.current && !mobileMenuRef.current.includes(e)) {
                                            mobileMenuRef.current.push(e)
                                        }
                                        }} className="cursor-pointer no-underline! flex flex-row gap-x-sm justify-between items-center text-xl! font-modern-era-medium text-dark-gray mobileSearchContainer">
                                        Search
                                            <SearchIcon className="w-lg h-lg" fill="var(--color-dark-gray)" />
                                    </button>
                                    <div className="absolute w-full right-0 top-0 left-0 bg-white min-h-full translate-x-full py-lg flex flex-col gap-y-xl [&.mobilePanel]:translate-x-0 z-50 transition-all duration-300 ease-in-out px-lg">
                                        
                                        <div className="flex flex-row gap-x-xs justify-start items-center no-underline!">
                                            <button onClick={onClickMobileReset} className="">
                                                <LeftArrowIcon className="w-lg h-lg" fill="var(--color-bright-red)" />
                                            </button>
                                            <TitleMd className="text-bright-red ">
                                                Search
                                            </TitleMd>
                                        </div>
                                        <div className="relative">
                                            <div className="w-full">
                                                <input onKeyDown={(e) => e.key === "Enter" && search(e)} onChange={(e:any)=>onChangeValue(e)}  id="onFocusMobileTrigger" name="search" autoFocus={false} type="text" className="font-modern-era-medium text-lg text-[#828282] p-0 focus:ring-0 ring-0 outline-0 border-b-[.4vw] w-full border-b-bright-red placeholder:text-[#828282]" placeholder="What’s on your mind?" />  
                                            </div>
                                            
                                            {/* <div className="absolute right-0 top-0 bottom-2 flex items-center justify-center">
                                                <SearchIcon className="w-md h-md" fill="#828282"/>
                                            </div>    */}
                                        </div>
                                        <Buttons onClick={(e:any)=>search(e)} type="filled" icon="right-arrow" buttonClassName="text-2md! h-[20%] w-fit max-w-full self-end text-center items-center justify-center" textColor="text-white" backgroundColor="bg-bright-red" iconClassName="h-sm w-sm">
                                            Search
                                        </Buttons>
                                    </div>
                                </div>
                            </nav>
                            
                         
                        </div>
                    </div>
                </div>
    )
})

export default MobileHeaderComponent