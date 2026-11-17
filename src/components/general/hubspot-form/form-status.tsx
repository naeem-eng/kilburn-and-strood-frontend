"use client";

import { useEffect, useRef } from "react";
import { TextMd, TitleSm } from "@/components/helpers/typography";

// Shown in place of the form once HubSpot has accepted it; focused so screen readers announce it
export const FormSent = ({ title, text }: { title: string; text: string }) => {
    const ref = useRef<HTMLDivElement>(null);
    useEffect(() => ref.current?.focus(), []);
    return (
        <div ref={ref} tabIndex={-1} role="status" className="flex flex-col gap-y-sm outline-none">
            <TitleSm as="h3">{title}</TitleSm>
            <TextMd>{text}</TextMd>
        </div>
    );
};

export const FormError = ({ message }: { message?: string }) =>
    message ? <p role="alert" className="text-sm text-dark-red">{message}</p> : null;
