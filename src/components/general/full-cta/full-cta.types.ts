export type FullCtaProps = {
    isAnimation?: boolean;
    color?: 'dark-purple' | 'dark-yellow' | 'bright-red' | 'dark-blue' | 'dark-green' | 'dark-red' | 'white' | 'dark-gray';
    title?: string;
    cta?: {
      text: string;
      href: string;
      type: "filled" | "outlined" | "text";
      icon: string;
    },
    imagePosition?: 'left' | 'right';
    media?: {
        url: string;
        alt: string;
        width: number;
        height: number;
    };
    className?: string;
    style?: any;
}
