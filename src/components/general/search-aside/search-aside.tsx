'use client'

import { SearchIcon } from "@/components/helpers/icons";
import { memo, useEffect, useState } from "react";
import { ArrCountObject, SearchAsideProps } from "./search-aside.types";
import { TitleSm } from "@/components/helpers/typography";


const SearchAside = (props: SearchAsideProps) => {
    // //console.log("SearchAside props:", props);
    const {data} = props
    const [todos, setTodos] = useState<ArrCountObject>([]);

    useEffect(() => {
        if(!data) return;
        const processedTodos = [
            {
                key: "all",
                name: "All",
                count: data ? Object.values(data).reduce((sum, arr: any) => sum + arr, 0) : 0,
                selected: !props?.selected
            },
            {
                key: "services",
                name: "Services",
                count: data?.services || 0,
                selected: props?.selected === "services"
            },
            {
                key: "peoples",
                name: "People",
                count: data?.peoples || 0,
                selected: props?.selected === "peoples"
            },
            {
                key: "insights",
                name: "Insights",
                count: data?.insights || 0,
                selected: props?.selected === "insights"
            },
            {
                key: "events",
                name: "Events",
                count: data?.events || 0,
                selected: props?.selected === "events"
            }
        ];
        setTodos(processedTodos);
    }, [data]);

    // const todos = [
    //     {
    //         key: "all",
    //         name: "All",
    //         count: 10
    //     },
    //     {
    //         key: "services",
    //         name: "Services",
    //         count: 10
    //     },
    //     {
    //         key: "people",
    //         name: "People",
    //         count: 10
    //     },
    //     {
    //         key: "articles",
    //         name: "Insights",
    //         count: 10
    //     },
    //     {
    //         key: "events",
    //         name: "Events",
    //         count: 10
    //     }
    // ]  
    

    return (
        <div className="max-w-[30%] flex-1 sticky top-12 self-start pt-12 ">
            {
                todos.map((todo:any) => {
                    const count = todo?.count;
                    return (
                        <button type="button" aria-pressed={!!todo?.selected} onClick={()=>props?.setCollection(todo?.key=='all' ? undefined : todo?.key)} className={`cursor-pointer flex  my-sm px-xs  text-left w-full  hover:border-dark-blue hover:text-dark-blue text-2md items-center font-modern-era-medium ${todo?.selected ? "border-dark-blue text-dark-blue border-l-[.2vw]" : "border-l-[.1vw] text-dark-gray border-dark-gray"}`} key={todo.key}>
                            {todo.name} <span className={`ml-2  bg-light-gray py-0.5 px-2 leading-2.5 text-xs rounded-full  font-modern-era ${todo?.selected ? "bg-dark-blue! text-white" : "text-dark-gray"}`}>{count}</span>
                        </button>
                    )
                })
            }
        </div>
    )
}

export default memo(SearchAside);

