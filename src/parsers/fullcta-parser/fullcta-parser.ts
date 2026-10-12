import { getStrapiMedia } from "@/utils/utils";

type FullCtaParserType = {
  component: 'components.full-cta',
  props: {
    cta?: {
      text: string;
      href: string;
      type: "filled" | "outlined" | "text";
      icon: string;
    }
    media?: {
      url: string;
      alt: string;
      width: number;
      height: number;
    }
    title?: string;
    imagePosition?: 'left' | 'right';
  }
};
  


export function fullCtaParser(props: any) {
  if(!props?.fullCtaComponent) return null;
  
  const {
    cta,
    media,
    title,
    imagePosition
  } = props?.fullCtaComponent

  return {
    component: 'components.full-cta',
    props: {
        cta : cta && {
          text: cta?.text,
          href: cta?.link,
          type: cta?.type,
          icon: cta?.icon
        },
        media: {
          url: getStrapiMedia(media, 'large'),
          alt: media?.alternativeText,
          width: media?.width,
          height: media?.height
        },
        title: title,
        imagePosition
    }
  } as FullCtaParserType
}


