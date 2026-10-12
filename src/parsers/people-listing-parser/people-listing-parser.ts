import { PeopleCardProps } from "@/components/general/people-card/people-card.types";
import { PeopleListingProps } from "./people-listing-parser.types";
import { getStrapiMedia } from "@/utils/utils";



const peopleListingParser = (todos: PeopleListingProps) => {
    if(!todos?.length) return []
    return todos.map((todo: any) => {
        const {
            documentId,
            name,
            title,
            peopleRoles,
            profilePhoto,
            slug
        } = todo;

        let description = undefined as string | undefined;
        peopleRoles?.map((v:any, index:number) => {
            if(index>1 && index == peopleRoles?.length-1) {
                description = `${description} and `;
            };
            description = description ? `${description} ${v?.title}` : v?.title;
        });
        return  {
            id: documentId,
            slug: slug,
            imageSrc: getStrapiMedia(profilePhoto, 'large'),
            imageAlt: profilePhoto?.alternativeText,
            imageWidth: profilePhoto?.width,
            imageHeight: profilePhoto?.height,
            title: name,
            tag: title, // role
            description
        } as PeopleCardProps
    });
    
    
}

export default peopleListingParser;