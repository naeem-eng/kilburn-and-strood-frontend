import { menuParser } from "@/parsers/global-parser";
import { strapiFetch } from "../lib/strapi";
import { MenuRequestProps } from "@/parsers/global-parser/menu/menu-parser.types";
import { getStrapiMedia } from "@/utils/utils";



const globalRequest = async (): Promise<{
    header: {
        menu: MenuRequestProps[];
        logo: string;
    },
    footer: any;
} | any> => {
    const headerTodo = await strapiFetch(
        "/api/header",
        {
            populate: {
                nav_settings: {
                    populate: {
                        sub_nav_settings: {
                            populate: "*"
                        },
                        nav_megamenu_container: {  
                            populate: { 
                                 right_article: {
                                        populate: "*"
                                },
                                mega_menu_settings : { 
                                    populate: {
                                        offices_sub_items: {
                                            populate: "*"
                                        },
                                        pages_sub_items: {
                                            populate: "*"
                                        },
                                        events_sub_items: {
                                            populate: "*"
                                        },
                                        services_sub_items: {
                                            populate: "*"
                                        },
                                        sub_nav_items: { 
                                            populate: {
                                                second_level_nav_settings: {
                                                    populate: { 
                                                        second_level_nav_items: {
                                                            populate: true
                                                        },
                                                        services_second_level_items: {
                                                            populate: "*"
                                                        }
                                                    }
                                                },
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
,
        }, undefined, false);
    const footerTodo = await strapiFetch(
        "/api/footer",
        {
            populate: {
                fields: [ "title"],
                footer_menu: {
                    populate: "*"
                },
                sub_menu: {
                    populate: "*"
                },
                social_cta: {
                    populate: "*"
                },
                cta: {
                    populate: "*"
                }
            },
        }, undefined, false);

    const globalTodo = await strapiFetch(
        "/api/global-setting",
        {
            populate: "*",
        }, undefined, false);
    
    if(!headerTodo?.data || !footerTodo?.data || !globalTodo?.data) return;

    const header = {
        menu: menuParser(headerTodo?.data),
        logo: getStrapiMedia(globalTodo?.data?.logo, 'large'),
        favicon: getStrapiMedia(globalTodo?.data?.smallLogo, 'medium')
    }

    return {
        header,
        footer: footerTodo?.data
    }
}

export default globalRequest;