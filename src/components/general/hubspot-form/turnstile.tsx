"use client";

import { MutableRefObject, useEffect, useRef } from "react";

// Cloudflare Turnstile (bot check) for the HubSpot forms.
// The widget writes its token into a hidden `cf-turnstile-response` input inside the form,
// which useHubspotSubmit sends to /api/hubspot-submit for server-side verification.

type TurnstileOptions = {
    sitekey: string;
    appearance?: "always" | "execute" | "interaction-only";
    theme?: "light" | "dark" | "auto";
    size?: "normal" | "flexible" | "compact";
    action?: string;
    "response-field-name"?: string;
    "error-callback"?: (code: string) => boolean | void;
};

type TurnstileApi = {
    render: (container: HTMLElement, options: TurnstileOptions) => string | undefined;
    reset: (widgetId?: string) => void;
    remove: (widgetId?: string) => void;
};

declare global {
    interface Window {
        turnstile?: TurnstileApi;
    }
}

export const TURNSTILE_FIELD = "cf-turnstile-response";
const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
const SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;

// load the script once per page, however many forms are on it
let scriptPromise: Promise<TurnstileApi> | null = null;
const loadTurnstile = () => {
    if (window.turnstile) return Promise.resolve(window.turnstile);
    if (!scriptPromise) {
        scriptPromise = new Promise((resolve, reject) => {
            const script = document.createElement("script");
            script.src = SCRIPT_SRC;
            script.async = true;
            script.defer = true;
            script.onload = () => (window.turnstile ? resolve(window.turnstile) : reject(new Error("Turnstile missing")));
            script.onerror = () => {
                scriptPromise = null;
                reject(new Error("Turnstile failed to load"));
            };
            document.head.appendChild(script);
        });
    }
    return scriptPromise;
};

export type TurnstileControl = { reset: () => void };

export const isTurnstileEnabled = Boolean(SITE_KEY);

const Turnstile = ({ action, controlRef }: { action: string; controlRef?: MutableRefObject<TurnstileControl | null> }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!SITE_KEY || !containerRef.current) return;
        const container = containerRef.current;
        let widgetId: string | undefined;
        let cancelled = false;

        loadTurnstile()
            .then((turnstile) => {
                if (cancelled) return;
                widgetId = turnstile.render(container, {
                    sitekey: SITE_KEY,
                    action,
                    // only shows a visible challenge when Cloudflare can't verify the visitor silently
                    appearance: "interaction-only",
                    theme: "light",
                    size: "flexible",
                    "response-field-name": TURNSTILE_FIELD,
                    // e.g. 110200 = this hostname isn't on the widget's allowed list in Cloudflare; returning true stops Turnstile throwing
                    "error-callback": (code) => {
                        console.warn(`Turnstile error ${code}`);
                        return true;
                    },
                });
                if (controlRef) controlRef.current = { reset: () => turnstile.reset(widgetId) };
            })
            .catch((error) => console.warn(error?.message));

        return () => {
            cancelled = true;
            if (controlRef) controlRef.current = null;
            if (widgetId) window.turnstile?.remove(widgetId);
        };
    }, [action, controlRef]);

    if (!SITE_KEY) return null;
    return <div ref={containerRef} className="w-full empty:hidden" />;
};

export default Turnstile;
