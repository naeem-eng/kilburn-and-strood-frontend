import { ContentCarousalProps } from "../content-carousal/content-carousal.types";

export type PeopleBioProps = {
    contentCarousal?: ContentCarousalProps;
    isAnimation?: boolean;
    index?: number;
    color?: 'dark-purple' | 'dark-yellow' | 'bright-red' | 'dark-blue' | 'dark-green' | 'dark-red';
    backCTA?: boolean;
    backCTAText?: string;
    label?: string;
    title?: string;
    role?: string;
    roleList?: Array<string>;
    quote?: {
        text?: string;
        from?: string;
    };
    imageSrc?: string;
    imageAlt?: string;
    imageWidth?: number;
    imageHeight?: number;
    patternImageSrc?: string;
    patternImageAlt?: string;
    patternImageWidth?: number;
    patternImageHeight?: number;
    contacts?: Array<{
        icon?: string;
        type?: 'email' | 'phone' | 'linkedin' | 'download' | undefined;
        text?: string;
        href?: string
    }>;

}
