export type LatestInsightProps = {
  isAnimation?: boolean;
  isLightAnimation?: boolean;
  index?: number;
  title?: string;
  color?: 'dark-purple' | 'dark-yellow' | 'bright-red' | 'dark-blue' | 'dark-green' | 'dark-red' | 'yellow' | 'white' | 'dark-gray' | 'light-gray' | 'medium-gray' | 'light-green' | 'light-blue' | 'light-purple';
  titleAboveImage?: string;
  text?: string;
  card?: {
    title: string;
    text: string;
  };
  titleAboveText?: string;
  type?: "article" | "event";
  mediaSrc?: string;
  mediaAlt?: string;
  mediaWidth?: number;
  mediaHeight?: number;
  mediaSrcBottom?: string;
  mediaAltBottom?: string;
  mediaWidthBottom?: number;
  mediaHeightBottom?: number;
  media1Type?: 'image' | 'video';
  mediaBottomType?: 'image' | 'video';
  cta?:{
    text: string;
    color?: string;
    href: string;
    type: 'filled' | 'outlined' | 'text';
    icon: string;
  }
  topCta?:{
    text: string;
    href: string;
    type: 'filled' | 'outlined' | 'text';
    icon: string;
  }
}