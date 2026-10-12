import React from "react";

export type PrimaryHeaderComponentProps = {
    isAnimation?: boolean;
    isLightAnimation?: boolean;
    index?: number;
    leftMediaSrc?: string;
    leftMediaAlt?: string;
    leftMediaWidth?: number;
    leftMediaHeight?: number;
    leftMediaType?: 'image' | 'video';
    leftRevealImageSrc?: string;
    rightMediaSrc?: string;
    rightMediaAlt?: string;
    rightMediaWidth?: number;
    rightMediaHeight?: number;
    rightMediaType?: 'image' | 'video';
    color?: "yellow" | "bright-red" | "dark-purple" | "dark-gray" | "light-gray" | "dark-yellow";
    title?: string;
    text?: string;
    cta?: Array<{
        text?:  string;
        href?: string;
        type?: 'filled' | 'text' | 'outlined';
        icon?: 'arrow-right' | 'arrow-left' | 'external-link' | null;
    }>
}