import { PeopleCardProps } from "@/components/general/people-card/people-card.types";
import { getStrapiMedia } from "@/utils/utils";



export function speakerParser(props: any[]) {
  if(!props?.length) return null;

  // //console.log({props})
  return {
    component: 'components.people-card',
    props: props?.map((person: any) => ({
      title: person?.name,
      tag: person?.title,
      description: person?.biography,
      imageSrc: getStrapiMedia(person?.profilePhoto, 'medium'),
      imageAlt: person?.profilePhoto?.alternativeText,
      imageWidth: person?.profilePhoto?.width,
      imageHeight: person?.profilePhoto?.height,
      slug: person?.slug
    }))
  } as {
    component: 'components.people-card',
    props: PeopleCardProps[]
  }
}

export function guestSpeakerParser(props: any[]) {
  if(!props?.length) return null;

  return {
    component: 'components.people-card',
    props: props?.map((guest: any) => ({
      title: guest?.title,
      tag: guest?.role,
      imageSrc: getStrapiMedia(guest?.media, 'medium'),
      imageAlt: guest?.media?.alternativeText,
      imageWidth: guest?.media?.width,
      imageHeight: guest?.media?.height,
      href: guest?.externalLink || undefined,
    }))
  } as {
    component: 'components.people-card',
    props: PeopleCardProps[]
  }
}


