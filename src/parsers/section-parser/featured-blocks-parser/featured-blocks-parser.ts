import { getDayAndMonth, getImgOrVideoType, getStrapiMedia } from "@/utils/utils";
import { FeaturedBlocksParserType } from "./featured-blocks-parser.types";



const featuredBlocksParser = (section: any) => {
    if(!section) return
   

   
    let rows = [] as any[]
    if(section?.blocks?.length > 3) {
        rows = [[],[],[]]
        rows.map((row:any, i:number) => { 
            if(i === 0) {
                row.push({})
                row.push({})
                row.push({ 
                    href: section?.blocks?.[0]?.url,
                    title: section?.blocks?.[0]?.title,
                    backgroundColor: 'white',
                    textColor: 'dark-gray'
                })
            }
            if(i === 1) {
                row.push({})
                row.push({
                    href: section?.blocks?.[1]?.url,
                    title: section?.blocks?.[1]?.title,
                    backgroundColor: 'white',
                    textColor: 'dark-gray'
                })
                row.push({...section?.blocks?.[2],
                    href: section?.blocks?.[2]?.url,
                    title: section?.blocks?.[2]?.title,
                    backgroundColor: 'dark-gray',
                    textColor: 'white'
                })
            }
            if(i === 2) {
                if(Object.keys(section?.blocks?.[4] || {}).length > 0) {
                        row.push({...(section?.blocks?.[4] || {}),
                            href: section?.blocks?.[4]?.url,
                            title: section?.blocks?.[4]?.title,
                            backgroundColor: 'dark-gray',
                            textColor: 'white'})
                } else {
                    row.push({})
                }
                

                row.push({...section?.blocks?.[3], 
                    href: section?.blocks?.[3]?.url,
                    title: section?.blocks?.[3]?.title,
                    backgroundColor: 'dark-purple',
                    textColor: 'white'
                })

                if(Object.keys(section?.blocks?.[5] || {}).length > 0) {
                        row.push({...(section?.blocks?.[5] || {}), 
                            href: section?.blocks?.[5]?.url,
                            title: section?.blocks?.[5]?.title,
                            backgroundColor: 'white',
                            textColor: 'dark-gray'
                        })
                } else {
                    row.push({})
                }
            }
        })
    }

     // //console.log(section?.blocks)
    //  console.log({rows})

    return  {
        component: 'components.featured-blocks',
        props: {
            title: section?.title,
            text: section?.text,
            cta: section?.cta && {
                text: section?.cta?.text,
                href: section?.cta?.link,
                type: section?.cta?.type,
                icon: section?.cta?.icon
            },
            servicesList: rows,
            // servicesList: section?.blocks?.map((service: any, index:number) => {
            //     let backgroundColor = index % 2 === 1 ? "white" : "dark-gray";
            //     if(index === 3) {
            //         backgroundColor = "dark-purple"
            //     }
            //     if(index === 0) {
            //         backgroundColor = "white"
            //     }

            //     return {
            //         title: service?.title,
            //         href: service?.url,
            //         backgroundColor,
            //         textColor: backgroundColor === "white" ? "dark-gray" : "white"
            //     }
            // }),
            imageSrc: getStrapiMedia(section?.media1, 'large'),
            imageAlt: section?.media1?.alternativeText,
            imageWidth: section?.media1?.width,
            imageHeight: section?.media1?.height,
            image2Src: getStrapiMedia(section?.media2, 'large'),
            image2Alt: section?.media2?.alternativeText,
            image2Width: section?.media2?.width,
            image2Height: section?.media2?.height,
            media3Src: getStrapiMedia(section?.media3, 'large'),
            media3Alt: section?.media3?.alternativeText,
            media3Width: section?.media3?.width,
            media3Height: section?.media3?.height,
            media3Type: getImgOrVideoType(section?.media3?.ext) || "image"
        } as FeaturedBlocksParserType["props"]
    } as FeaturedBlocksParserType

    
}

export default featuredBlocksParser;