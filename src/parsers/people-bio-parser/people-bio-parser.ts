import { PeopleBioProps } from "@/components/general/people-bio/people-bio.types";
import { getDayAndMonth, getImgOrVideoType, getStrapiMedia } from "@/utils/utils";
import { format } from "date-fns";



const peopleBioParser = (todo: any) => {
    // // //console.log({todo})
    return {
        contentCarousal: {
            title: `${todo?.name}'s insights and events`,
            items: [...todo?.articles?.map((v:any)=>({
                title: v?.title,
                slug: v?.slug,
                url: `/insights/${v?.slug}`,
                sortDate: new Date(v?.publishDate),
                itemType: "Insights",
                date: format(new Date(v.publishDate), "do MMMM yyyy"),
                mediaType: getImgOrVideoType(v?.featuredImage?.ext),
                mediaSrc: getStrapiMedia(v?.featuredImage, 'large'),
                mediaAlt: v?.featuredImage?.alternativeText,
                mediaWidth: v?.featuredImage?.width,
                mediaHeight: v?.featuredImage?.height
            })), ...todo?.events?.map((v:any)=>({
                title: v?.title,
                slug: v?.slug,
                url: `/events/${v?.slug}`,
                itemType: "Events",
                sortDate: new Date(v?.eventDate),
                date: format(new Date(v.eventDate), "do MMMM yyyy"),
                mediaType: getImgOrVideoType(v?.featuredImage?.ext),
                mediaSrc: getStrapiMedia(v?.featuredImage, 'large'),
                mediaAlt: v?.featuredImage?.alternativeText,
                mediaWidth: v?.featuredImage?.width,
                mediaHeight: v?.featuredImage?.height
            }))].sort((a:any,b:any)=>{
                if(a?.sortDate > b?.sortDate) return -1;
                return 0;
            })
        },

        testimonialsContainer: {
            testimonials: todo?.highlightedTestimonials?.map((v:any)=>({
                imageSrc: getStrapiMedia(v?.media, 'large'),
                imageAlt: v?.media?.alternativeText,
                quote: v?.quote,
                name: v?.title,
                role: v?.role
            }))
        },
        qualifications: [{
            title: "Credentials",
            content: todo?.credentials
        },
        {
            title: "Publications",
            content: todo?.publications
        }, 
        {
            title: "Recognition",
            content: todo?.recognition
        }].filter(v=>Boolean(v?.content)),
        article: todo?.article,
        events: todo?.events,
        services: todo?.services?.map((v:any)=>({
            text: v?.name, // name is the title for services
            href: `/services/${v?.slug}`
        })),
        sectors: todo?.displayedSectors?.length
            ? todo?.displayedSectors?.map((v:any) => ({ text: v?.text, href: `/sectors/${v?.slug}` }))
            : todo?.sector?.map((v:any) => ({ text: v?.title, href: `/sectors/${v?.slug}` })),
        roleList: todo?.peopleRoles?.map((v:any)=>(v?.title?.toLocaleLowerCase())),
        biography: todo?.biography,
        bio : {
            color: todo?.peopleRoles?.[0]?.color?.name || "bright-red",
            label: todo?.label,
            title: todo?.name,
            role: todo?.title,
            quote: todo?.testimonial?.quote && {
                text: todo?.testimonial?.quote,
                from: todo?.testimonial?.from,
            },
            imageSrc: getStrapiMedia(todo?.headerPhoto, 'large'),
            imageAlt: todo?.headerPhoto?.alternativeText,
            imageWidth: todo?.headerPhoto?.width,
            imageHeight: todo?.headerPhoto?.height,
            patternImageSrc: getStrapiMedia(todo?.patternImage, 'large'),
            patternImageAlt: todo?.patternImage?.alternativeText,
            patternImageWidth: todo?.patternImage?.width,
            patternImageHeight: todo?.patternImage?.height,
            contacts: [
                {
                    icon: "email",
                    type: 'email',
                    text: todo?.email
                },
                {
                    icon: "download",
                    type: 'download',
                    text: "Download VCard",
                    href: todo?.vcardFile?.url
                },
                {
                    icon: "phone",
                    type: 'phone',
                    text: todo?.phone
                },
                {
                    icon: "linkedin",
                    type: 'linkedin',
                    text: todo?.linkedin
                },
            ]
        } as PeopleBioProps
    }
}

export default peopleBioParser;