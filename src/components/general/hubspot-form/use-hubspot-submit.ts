"use client";

import { FormEvent, useRef, useState } from "react";
import { HUBSPOT_FORMS, HubspotFormKey } from "@/requests/hubspot-requests/hubspot-config";
import { isTurnstileEnabled, TURNSTILE_FIELD, TurnstileControl } from "./turnstile";

type Status = "idle" | "sending" | "sent" | "error";

// Reads a form element and posts it to /api/hubspot-submit (the server adds hutk and calls HubSpot)
export const useHubspotSubmit = (form: HubspotFormKey) => {
    const [status, setStatus] = useState<Status>("idle");
    const [error, setError] = useState<string>();
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
    // pass to <Turnstile controlRef={turnstileRef} />; tokens are single-use, so the widget is reset after a failed submit
    const turnstileRef = useRef<TurnstileControl | null>(null);

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (status === "sending") return;
        const data = new FormData(event.currentTarget);

        const fields = Object.fromEntries(HUBSPOT_FORMS[form].fields.map(({ name }) => [name, String(data.get(name) || "")]));
        const turnstileToken = String(data.get(TURNSTILE_FIELD) || "");
        if (isTurnstileEnabled && !turnstileToken) {
            setError("Please wait a moment while we check you're not a bot, then try again.");
            setStatus("error");
            return;
        }

        setStatus("sending");
        setError(undefined);
        setFieldErrors({});
        try {
            const res = await fetch("/api/hubspot-submit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    form,
                    fields,
                    turnstileToken,
                    consent: { marketing: data.get("consentMarketing") === "on" },
                    context: { pageUri: window.location.href, pageName: document.title },
                }),
            });
            const json = await res.json().catch(() => ({}));
            if (!res.ok) {
                setFieldErrors(json?.fieldErrors || {});
                setError(json?.error || "Sorry, something went wrong. Please try again.");
                setStatus("error");
                turnstileRef.current?.reset();
                return;
            }
            setStatus("sent");
        } catch {
            setError("Sorry, something went wrong. Please check your connection and try again.");
            setStatus("error");
            turnstileRef.current?.reset();
        }
    };

    return { status, error, fieldErrors, onSubmit, turnstileRef };
};
