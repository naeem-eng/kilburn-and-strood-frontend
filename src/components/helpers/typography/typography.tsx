"use client";
import { ElementType, memo } from "react";

interface TypographyProps {
    as?: ElementType;
    style?: any;
    children?: React.ReactNode;
    text?: string;
    className?: string;
    fontClassName?: string;
    attributes?: React.HTMLAttributes<HTMLElement> & Record<string, any>;
    textSize?: string;
}

export const TitleXl = memo(({
    as: Component = "h1",
    text,
    children,
    className = "",
    attributes,
    style,
    textSize = "text-4xl"
}: TypographyProps) => {
    return (
        <Component {...attributes} style={style} className={`${className || ''} text-balance font-gt-ultra ${textSize}`}>
            {text || children}
        </Component>
    )
});

export const TitleLg = memo(({
    as: Component = "h2",
    text,
    children,
    className = "",
    attributes,
    style,
    textSize = "text-4xl md:text-3xl"
}: TypographyProps) => {
    return (
        <Component {...attributes} style={style} className={`${className || ''} font-gt-ultra ${textSize}`}>
            {text || children}
        </Component>
    )
});

export const TitleMd = memo(({
    as: Component = "h2", // section title directly under the page h1
    text,
    children,
    className = "",
    attributes,
    style,
    textSize = "text-3xl md:text-2xl"
}: TypographyProps) => {
    return (
        <Component {...attributes} style={style} className={`${className || ''} font-gt-ultra ${textSize}`}>
            {text || children}
        </Component>
    )
});

export const TitleSm = memo(({
    as: Component = "h4",
    text,
    children,
    className = "",
    attributes,
    style,
    textSize = "text-2xl"
}: TypographyProps) => {
    return (
        <Component {...attributes} style={style} className={`${className || ''} font-gt-ultra ${textSize}`}>
            {text || children}
        </Component>
    )
});

export const TextXl = memo(({
    as: Component = "h4",
    text,
    children,
    className = "",
    attributes,
    style,
    textSize = "text-2xl md:text-xl"
}: TypographyProps) => {
    return (
        <Component {...attributes} style={style} className={`${className || ''} font-gt-ultra ${textSize}`}>
            {text || children}
        </Component>
    )
});

export const TextLg = memo(({
    as: Component = "h5",
    text,
    children,
    className = "",
    attributes,
    style,
    textSize = "text-xl md:text-lg"
}: TypographyProps) => {
    return (
        <Component {...attributes} style={style} className={`${className || ''} font-gt-ultra ${textSize}`}>
            {text || children}
        </Component>
    )
});


export const TextMd = memo(({
    as: Component = "p", // body copy, not a heading: pass as="h2" etc. where it really is one
    text,
    children,
    className = "",
    fontClassName,
    attributes,
    style
}: TypographyProps) => {
    return (
        <Component {...attributes} style={style} className={`${className || ''} ${fontClassName ? fontClassName : 'font-modern-era text-md font-medium'}`}>
            {text || children}
        </Component>
    )
});


export const Text = memo(({
    as: Component = "p",
    text,
    children,
    className = "",
    attributes,
    style,
    textSize = "text-md"
}: TypographyProps) => {
    return (
        <Component {...attributes} style={style} className={`${className || ''} font-modern-era ${textSize}`}>
            {text || children}
        </Component>
    )
});

export const Small = memo(({
    as: Component = "p",
    text,
    children,
    className = "",
    attributes,
    style,
    textSize = "text-xs sm:text-sm"
}: TypographyProps) => {
    return (
        <Component {...attributes} style={style} className={`${className || ''} font-modern-era-medium ${textSize}`}>
            {text || children}
        </Component>
    )
});