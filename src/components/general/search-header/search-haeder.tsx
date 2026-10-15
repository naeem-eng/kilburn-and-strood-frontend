'use client'

import { SearchIcon } from "@/components/helpers/icons";
import { memo, useEffect, useState } from "react";
import { SearchHeaderProps } from "./search-header.types";
import { TitleSm } from "@/components/helpers/typography";
import { useRouter } from "next/navigation";

const SearchHeader = (props: SearchHeaderProps) => {
    const { q } = props;
    const router = useRouter();
    const [searchQuery, setSearchQuery] = useState(q || '');

    useEffect(() => {
        setSearchQuery(q || '');
    }, [q]);

    const handleSearch = () => {
        if (!searchQuery.trim()) return;
        router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    };

    return (
        <div className="w-full flex flex-col justify-start items-start">
            <div className="flex flex-col md:flex-row justify-between items-center w-full gap-x-12 gap-y-6">
                <div className="w-full md:w-[30%] md:max-w-[30%] flex-1">
                    <TitleSm as="h1" className="text-bright-red">
                        Search results
                    </TitleSm>
                </div>

                <div className="flex-1 relative w-full">
                    <input
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                        onKeyDown={e => e.key === "Enter" && handleSearch()}
                        type="search"
                        aria-label="Search the site"
                        placeholder="Search..."
                        className="bg-light-gray w-full px-xl text-lg font-modern-era-medium text-dark-gray py-md"
                    />
                    <button
                        type="button"
                        aria-label="Search"
                        onClick={handleSearch}
                        className="absolute px-xl cursor-pointer right-0 top-0 bottom-0 flex items-center justify-center"
                    >
                        <SearchIcon className="w-md h-md" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default memo(SearchHeader);