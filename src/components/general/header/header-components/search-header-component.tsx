"use client";
import Buttons from "@/components/helpers/buttons/buttons";
import { CloseIcon, SearchIcon } from "@/components/helpers/icons";
import { TitleMd } from "@/components/helpers/typography/typography";
import { useRouter } from 'next/navigation';
import { forwardRef, useState } from "react"


const SearchHeaderComponent = forwardRef<HTMLButtonElement[],{}>((_, ref) => {

    const router = useRouter();

    const [isActive, setIsActive] = useState<boolean>(false);
    const dropdownMenuRef = typeof ref === "function" ? null : ref;
    const [value, setValue] = useState<string | null>(null);
    
    const onTriggerSearch = () => {
        setIsActive(!isActive);
    }

    if(!dropdownMenuRef) return <></>;


    const onChangeValue = (e:any) => {
        const value = e.target.value
        //console.log({value})
        setValue(value)
    }

    const search = ()=>{
        if(value) {
            router.push(`/search?q=${encodeURIComponent(value.trim())}`);
        }
    }

    return (
        <div className="ml-xs pb-xs">
            <button onClick={(e)=>{onTriggerSearch()}} data-search-slide ref={(e:HTMLButtonElement | null)=>{
                        if (e && dropdownMenuRef.current && !dropdownMenuRef.current.includes(e)) {
                            dropdownMenuRef.current.push(e)
                        }
                    }} type="button" className="group cursor-pointer">
                <div className="h-sm w-sm">
                    <SearchIcon className="h-full w-full group-[&.activateDropper]:hidden"/>
                    <CloseIcon fill="var(--color-dark-gray)" className="h-full w-full group-[&.activateDropper]:block hidden"/>
                </div>
            </button>
            <div className={`dropdownPanel absolute p-0 top-[100%] left-0 right-0 h-0 overflow-hidden`} onClick={e=>e.stopPropagation()}>
                <div data-layer={1} className="flex flex-row gap-x-xl justify-between items-baseline bg-white mx-xl p-xl relative z-50 h-[80%] top-[-100%] transition-all duration-400 ease-in-out">
                    <TitleMd className="text-bright-red text-center mr-xl flex-1">
                        Search
                    </TitleMd>
                    <div className="relative flex-1/3">
                        <div className="w-full">
                            <input id="onFocusTrigger" onKeyDown={(e) => e.key === "Enter" && search()} onChange={(e:any)=>onChangeValue(e)} name="search" autoFocus={false} type="text" className="font-modern-era-medium text-lg text-[#828282] p-0 focus:ring-0 ring-0 outline-0 border-b-[#F2F2F2] placeholder:text-[#828282] border-b-[.2vw] w-full" placeholder="What’s on your mind?" />
                        </div>
                        {/* <div className="absolute right-0 top-0 bottom-2 flex items-center justify-center">
                            <SearchIcon className="w-2sm h-2sm md:w-sm md:h-sm" fill="#828282"/>
                        </div> */}
                    </div>
                </div>
                
                <div data-layer={2} className="absolute right-0 top-[-100%] overflow-hidden px-xl h-[100%] bg-bright-red flex justify-end items-end transition-all duration-400 ease-in-out ">
                    <div data-layer={3} className="h-[22%] transition-all duration-400 ease-in-out
                     relative top-[-100%] flex justify-center items-center w-full">
                        <Buttons onClick={()=>search()} type="text" icon="right-arrow" buttonClassName="text-2md! w-full max-w-full text-center items-center justify-start" textColor="text-white" backgroundColor="bg-bright-red" iconClassName="h-sm w-sm">
                            Search
                        </Buttons>
                    </div>
                </div>

            </div>
        </div>
    )
}
)

export default SearchHeaderComponent