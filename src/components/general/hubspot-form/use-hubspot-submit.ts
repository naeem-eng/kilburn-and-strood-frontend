"use client";

import { FormEvent, useState } from "react";
import { HUBSPOT_FORMS, HubspotFormKey } from "@/requests/hubspot-requests/hubspot-config";

type Status = "idle" | "sending" | "sent" | "error";

// Reads a form element and posts it to /api/hubspot-submit (the server adds hutk and calls HubSpot)
export const useHubspotSubmit = (form: HubspotFormKey) => {
    const [status, setStatus] = useState<Status>("idle");
    const [error, setError] = useState<string>();
    const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        if (status === "sending") return;
        const data = new FormData(event.currentTarget);

        const fields = Object.fromEntries(HUBSPOT_FORMS[form].fields.map(({ name }) => [name, String(data.get(name) || "")]));

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
                    consent: { process: data.get("consentProcess") === "on", marketing: data.get("consentMarketing") === "on" },
                    context: { pageUri: window.location.href, pageName: document.title },
                }),
            });
            const json = await res.json().catch(() => ({}));
            if (!res.ok) {
                setFieldErrors(json?.fieldErrors || {});
                setError(json?.error || "Sorry, something went wrong. Please try again.");
                setStatus("error");
                return;
            }
            setStatus("sent");
        } catch {
            setError("Sorry, something went wrong. Please check your connection and try again.");
            setStatus("error");
        }
    };

    return { status, error, fieldErrors, onSubmit };
};
