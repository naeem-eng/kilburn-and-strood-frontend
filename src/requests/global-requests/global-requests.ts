import { menuParser } from "@/parsers/global-parser";
import { strapiFetch } from "../lib/strapi";
import { MenuRequestProps } from "@/parsers/global-parser/menu/menu-parser.types";
import { getStrapiMedia } from "@/utils/utils";

// used until gtm_container_id is filled in Strapi global-setting
const DEFAULT_GTM_CONTAINER_ID = "GTM-5NZ8XLFG";
// used until contact_form_event / signup_form_event are filled in Strapi global-setting
const DEFAULT_FORM_EVENTS = { contact: "contact_form_submit", signup: "newsletter_signup" };



const globalRequest = async (): Promise<{
    header: {
        menu: MenuRequestProps[];
        logo: string;
    },
    footer: any;
    gtmContainerId: string;
    formEvents: { contact: string; signup: string };
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
                                                            populate: "*"
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


        // console.log("headerTodo", headerTodo);
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
        favicon: getStrapiMedia(globalTodo?.data?.smallLogo, 'small')
    }

    

    // Google Tag Manager container from Strapi global-setting → gtm_container_id (GA4 and other tags live in the container).
    // Falls back to the current container until the field is added/filled in Strapi; anything not shaped like GTM-XXXX is ignored.
    const rawGtmId = typeof globalTodo?.data?.gtmContainerId === "string" ? globalTodo.data.gtmContainerId.trim().toUpperCase() : "";
    const gtmContainerId = /^GTM-[A-Z0-9]+$/.test(rawGtmId) ? rawGtmId : DEFAULT_GTM_CONTAINER_ID;

    // dataLayer event names for successful HubSpot submissions, from Strapi global-setting → contact_form_event /
    // signup_form_event. They must match the Custom Event triggers in GTM. Falls back to the defaults when empty;
    // anything other than letters, digits, _ . - is ignored.
    const eventName = (value: unknown, fallback: string) => {
        const name = typeof value === "string" ? value.trim() : "";
        return /^[A-Za-z0-9_.-]{1,100}$/.test(name) ? name : fallback;
    };
    const formEvents = {
        contact: eventName(globalTodo?.data?.contactFormEvent, DEFAULT_FORM_EVENTS.contact),
        signup: eventName(globalTodo?.data?.signupFormEvent, DEFAULT_FORM_EVENTS.signup),
    };

    return {
        header,
        footer: footerTodo?.data,
        gtmContainerId,
        formEvents,
    }
}

export default globalRequest;