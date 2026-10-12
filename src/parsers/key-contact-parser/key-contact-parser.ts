import { PeopleCardProps } from "@/components/general/people-card/people-card.types";
import { getStrapiMedia } from "@/utils/utils";

export type GetKeyContactsParserType = {
  component: 'components.key-contact',
  title?: string,
  peoples: PeopleCardProps[]
};
  


export function getKeyContactsParser(peopleList: any) {
  if(!peopleList?.length) return null;

  return {
    component: 'components.key-contact',
    title: "Key contacts",
    peoples: peopleList?.map((person: any) => {
      let description = undefined as string | undefined;
      person?.peopleRoles?.map((v:any, index:number) => {
          if(index>1 && index == person?.peopleRoles?.length-1) {
              description = `${description} and `;
          };
          description = description ? `${description} ${v?.title}` : v?.title;
      });
      return {
        title: person?.name,
        tag: person?.title,
        description,
        imageSrc: getStrapiMedia(person?.profilePhoto, 'large'),
        imageAlt: person?.profilePhoto?.alternativeText,
        imageWidth: person?.profilePhoto?.width,
        imageHeight: person?.profilePhoto?.height,
        slug: person?.slug
      }
    })
  } as GetKeyContactsParserType
}


