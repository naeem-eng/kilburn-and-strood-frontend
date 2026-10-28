import { getStrapiMedia } from "@/utils/utils";
import { MenuRequestProps } from "./menu-parser.types";



const sortNavSettings = (arr: any) => {
  const order = ["top", "bottom"]; // priority order

  return arr.sort((a:any, b:any) => {   
    return order.indexOf(a.navPosition) - order.indexOf(b.navPosition);
  });
};


const parseChildren = (data: any = {}) => {
    const {
        subNavItems = [],
        eventsSubItems = [],
        pagesSubItems = [],
        officesSubItems = [],
    } = data;

    const sources = [
        subNavItems,
        eventsSubItems,
        pagesSubItems,
        officesSubItems,
    ];

    const firstValid = sources.find(
        (arr) => Array.isArray(arr) && arr.length > 0
    );

    if (!firstValid) return [];
    return firstValid.map((item: any) => ({
        name: item?.title || item?.name || null,
        url: item?.url || item?.slug || null,
        text: item?.text || item?.title || null,
        secondLevelNavSettings: item?.secondLevelNavSettings || undefined
    }));
};

export const menuParser = (data: any): MenuRequestProps[] | any => {
    
    const {navSettings} = data;
    if(!navSettings) return null;
   
    const menu: MenuRequestProps[] = [];
    const rootMenu = (item: any, i: number) => {
        const {
            id,
            navPosition,
            url,
            type,
            text,
            subNavSettings,
            navMegamenuContainer
        } = item;

        let children = [];
        if(subNavSettings && type === "single") {
            const {
                eventsSubItems,
                pagesSubItems,
                officesSubItems,
                subNavItems
            } = subNavSettings


            children = parseChildren({
                subNavItems,
                eventsSubItems,
                pagesSubItems,
                officesSubItems
            });
            
            // // //console.log({children})
        }

        if(navMegamenuContainer?.megaMenuSettings && type === "mega") {
            const {
                subNavItems
            } = navMegamenuContainer?.megaMenuSettings

            children = parseChildren({
                subNavItems
            });
            
            // // //console.log({children, navMegamenuContainer})
        }

        menu.push({
            id,
            title: text,
            seoSlug: url || "/"+text?.trim(),
            menuPosition:navPosition,
            url: Boolean(url) ? url : "/"+text?.trim(),
            menuOrderHeader: i,
            showInHeaderMenu: true,
            menuHasLink: subNavSettings ? false : Boolean(url),
            menuItemHasSubmenu: subNavSettings ? true : false,
            subMenuIsMegaMenu: navMegamenuContainer ? true : false, 
            ctaContainer: navMegamenuContainer ? {
                backgroundColor: "light-gray",
                ctaMediaType: "image",
                ctaMedia: getStrapiMedia(navMegamenuContainer?.rightArticle?.featuredImage, 'large'),
                ctaTitle: navMegamenuContainer?.rightArticle?.title,
                ctaText: navMegamenuContainer?.rightArticle?.text,
                ctaLink: navMegamenuContainer?.rightArticle?.slug,
                color: navMegamenuContainer?.rightArticle?.color?.name || 'bright-red',
                arrow: true
            } : undefined,
            children: children.map((v:any,k:number)=>{
                // // //console.log(v?.url)
                return {
                    id: `${i}.${k}`,
                    title: v?.name,
                    seoSlug: v?.name,
                    url: `${Boolean(url) ? '/'+url?.replaceAll('/','') : ''}/${v?.url ? v?.url?.replaceAll('/','') : ''}`,
                    menuDetails: v?.text,
                    menuOrderHeader: k,
                    menuHasLink: Boolean(v?.secondLevelNavSettings?.secondLevelNavItems?.length || v?.secondLevelNavSettings?.servicesSecondLevelItems?.length) ? false :Boolean(v?.url),
                    menuItemHasSubmenu: Boolean(v?.secondLevelNavSettings?.secondLevelNavItems?.length || v?.secondLevelNavSettings?.servicesSecondLevelItems?.length),
                    subMenuIsMegaMenu: false,
                    showInHeaderMenu: false, 
                    children: v?.secondLevelNavSettings?.secondLevelNavItems?.length ? v?.secondLevelNavSettings?.secondLevelNavItems?.map((z:any,x:number)=>{
                        return {
                            id: `${i}.${k}.${x}`,
                            title: z?.title,
                            seoSlug: z?.url || '/'+z?.slug?.trim(),
                            url: `/${url?.replaceAll('/','')}/${v?.url?.replaceAll('/','')}/${z?.url ? z?.url?.replaceAll('/','') : z?.slug?.trim()}`,
                            menuOrderHeader: x,
                            menuItemHasSubmenu: false,
                            subMenuIsMegaMenu: false,
                            showInHeaderMenu: false,
                            children: []
                        }
                    })
                    : v?.secondLevelNavSettings?.servicesSecondLevelItems?.map((z:any,x:number)=>{
                        return {
                            id: `${i}.${k}.${x}`,
                            title: z?.title || z?.name,
                            seoSlug: z?.url || '/'+z?.slug?.trim(),
                            url: `/${url?.replaceAll('/','')}/${v?.url?.replaceAll('/','')}/${z?.url ? z?.url?.replaceAll('/','') : z?.slug?.trim()}`,
                            menuOrderHeader: x,
                            menuItemHasSubmenu: false,
                            subMenuIsMegaMenu: false,
                            showInHeaderMenu: false,
                            children: []
                        }
                    })
                }
            }),
        })
        
    }

    // //console.log({navSettings})

    for(let i = 0; i < sortNavSettings(navSettings).length; i++) {
        rootMenu(sortNavSettings(navSettings)[i], i);
    }


    // // //console.log({menu})

    return menu;
}