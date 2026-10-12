import { getImgOrVideoType, getStrapiMedia } from "@/utils/utils";
import { TabbedBodyContentParserType, TabbedContentParserType, TabbedMapContentParserType } from "./tabbed-content-parser.types";
import { LocationDetailsProps } from "@/components/general/location-details/location-details.types";


const tabbedContentParser = (section: any) => {
    if(!section) return

    if(section?.type === "content") {

        return  {
            component: 'components.tabbed-content',
            variant: 'content',
            props: {
                title: section?.title,
                media1: section?.media1 && {
                    url: getStrapiMedia(section?.media1, 'medium'),
                    alt: section?.media1?.alternativeText,
                    width: section?.media1?.width,
                    height: section?.media1?.height,
                },
                media2: section?.media2 && {
                    url: getStrapiMedia(section?.media2, 'medium'),
                    alt: section?.media2?.alternativeText,
                    width: section?.media2?.width,
                    height: section?.media2?.height,
                },
                tabs: section?.tabs?.map((tab: any) => {
                    return {
                        id: tab?.id,
                        title: tab?.tabTitle,
                        content: {
                            title: tab?.title,
                            text: tab?.text,
                            type: tab?.type,
                            imageSrc: getStrapiMedia(tab?.media, 'medium'),
                            imageAlt: tab?.media?.alternativeText,
                            imageWidth: tab?.media?.width,
                            imageHeight: tab?.media?.height,
                            
                            cta: tab?.cta && {
                                text: tab?.cta?.text,
                                href: tab?.cta?.slug || tab?.cta?.url || tab?.cta?.link,
                                type: tab?.cta?.type,
                                icon: tab?.cta?.icon,
                                isExternal: tab?.cta?.isExternal
                            },
                            menu: {
                                title: tab?.menuTitle,
                                items: tab?.menu?.map((item: any) => ({
                                    title: item?.title,
                                    href: item?.slug  || item?.url || item?.link
                                }))
                            }
                        }

                    } as TabbedContentParserType["props"]["tabs"][0]
                }),
                color: section?.color?.name || "bright-red"
            } as TabbedContentParserType["props"]
        } as TabbedContentParserType
    } else {
       if(section?.type == "map-content") {
        return  {
            component: 'components.tabbed-content',
            variant: 'map-content',
            props: {
                title: section?.title,
                color: section?.color?.name || 'dark-purple',
                mapTabs: section?.mapContentTabs?.map((tab: any) => {
                    return {
                        tabName: tab?.name,
                        title: tab?.title,
                        details: tab?.text,
                        color: tab?.color?.name || 'dark-purple',
                        cta: tab?.cta && {
                            text: tab?.cta?.text,
                            href: tab?.cta?.slug || tab?.cta?.url || tab?.cta?.link,
                            type: tab?.cta?.type,
                            isExternal: tab?.cta?.isExternal,
                        },
                        imageSrc: getStrapiMedia(tab?.media, 'medium'),
                        imageAlt: tab?.media?.alternativeText,
                        imageWidth: tab?.media?.width,
                        imageHeight: tab?.media?.height,
                        address: tab?.address,
                        phone: tab?.phone
                    } as LocationDetailsProps
                }),
            } as TabbedMapContentParserType["props"]
        } as TabbedMapContentParserType
       } 
       if(section?.layout === "horizontal") {
            return  {
                component: 'components.tabbed-content',
                variant: 'body-content',
                contentTabsLayout: section.contentTabsLayout,
                contentLayout: section?.contentLayout,
                props: {
                    title: section?.title,
                     tabsType: "horizontal",
                     tabs: section?.contentTabs?.map((tab: any) => {
                        return {
                            id: tab?.id,
                            content: tab?.text,
                            title: tab?.title
                        }
                     })
                } as TabbedBodyContentParserType["props"]
            } as TabbedBodyContentParserType
        } else {
            return  {
                component: 'components.tabbed-content',
                variant: 'body-content',
                contentTabsLayout: section.contentTabsLayout,
                contentLayout: section?.contentLayout,
                props: {
                     title: section?.title,
                     tabsType: "vertical",
                     tabs: section?.contentTabs?.map((tab: any) => {
                        return {
                            id: tab?.id,
                            content: tab?.text,
                            title: tab?.title
                        }
                     })
                } as TabbedBodyContentParserType["props"]
            } as TabbedBodyContentParserType
        }
    }
    
}

export default tabbedContentParser;