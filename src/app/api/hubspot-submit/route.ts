import { NextRequest, NextResponse } from "next/server";
import {
    CONSENT_TEXT,
    TERMS_CONSENT_TEXT,
    getMarketingSubscriptionId,
    HUBSPOT_FORMS,
    getHubspotTarget,
    isHubspotFormKey,
} from "@/requests/hubspot-requests/hubspot-config";


export const dynamic = "force-dynamic";

const SUBMIT_HOST = process.env.HUBSPOT_SUBMIT_HOST || "https://api.hsforms.com";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map<string, number[]>();

const isRateLimited = (key: string) => {
    const now = Date.now();
    const recent = (hits.get(key) || []).filter((time) => now - time < WINDOW_MS);
    recent.push(now);
    hits.set(key, recent);
    if (hits.size > 5000) hits.clear(); 
    return recent.length > MAX_PER_WINDOW;
};

type SubmitBody = {
    form?: unknown;
    fields?: Record<string, unknown>;
    consent?: { process?: unknown; marketing?: unknown };
    context?: { pageUri?: unknown; pageName?: unknown };
};

const text = (value: unknown, max: number) => (typeof value === "string" ? value.trim().slice(0, max) : "");

export async function POST(request: NextRequest) {
    let body: SubmitBody;
    try {
        body = await request.json();
    } catch {
        return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }

    if (!isHubspotFormKey(body.form)) {
        return NextResponse.json({ error: "Unknown form." }, { status: 400 });
    }

    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || request.headers.get("x-real-ip") || "unknown";
    if (isRateLimited(`${ip}:${body.form}`)) {
        return NextResponse.json({ error: "Too many submissions. Please try again in a few minutes." }, { status: 429 });
    }

    const target = getHubspotTarget(body.form);
    if (!target) {
        console.error(`HubSpot form "${body.form}" is not configured: set NEXT_PUBLIC_HUBSPOT_PORTAL_ID and HUBSPOT_${body.form === "contact" ? "CONTACT" : "SIGNUP"}_FORM_GUID`);
        return NextResponse.json({ error: "Sorry, this form isn't available right now." }, { status: 503 });
    }

    const form = HUBSPOT_FORMS[body.form];
    const fieldErrors: Record<string, string> = {};
    const fields = form.fields.flatMap((field) => {
        const value = text(body.fields?.[field.name], field.maxLength);
        if (field.required && !value) fieldErrors[field.name] = "This field is required.";
        if (field.name === "email" && value && !EMAIL_RE.test(value)) fieldErrors[field.name] = "Please enter a valid email address.";
        return value ? [{ objectTypeId: "0-1", name: field.name, value }] : [];
    });

    if (body.consent?.process !== true) {
        fieldErrors.consentToProcess = body.form === "contact"
            ? "Please accept the Terms and Conditions."
            : "Please confirm we can store and process your personal data.";
    }
    if (Object.keys(fieldErrors).length) {
        return NextResponse.json({ error: "Please check the highlighted fields.", fieldErrors }, { status: 400 });
    }

    // contact: the Terms and Conditions tick-box; sign-up: processing + optional marketing consent
    const isSignup = body.form === "signup";
    const subscriptionTypeId = isSignup ? getMarketingSubscriptionId() : undefined;
    const hutk = request.cookies.get("hubspotutk")?.value;
    const pageUri = text(body.context?.pageUri, 1000) || request.headers.get("referer") || undefined;

    const payload = {
        submittedAt: Date.now(),
        fields,
        context: {
            ...(hutk ? { hutk } : {}),
            ...(pageUri ? { pageUri } : {}),
            pageName: text(body.context?.pageName, 300) || undefined,
            ...(ip !== "unknown" ? { ipAddress: ip } : {}),
        },
        legalConsentOptions: {
            consent: {
                consentToProcess: true,
                text: isSignup ? CONSENT_TEXT.process : TERMS_CONSENT_TEXT,
                // marketing consent can only be recorded with its subscription type ID
                ...(subscriptionTypeId ? {
                    communications: [{
                        value: body.consent?.marketing === true,
                        subscriptionTypeId,
                        text: CONSENT_TEXT.marketing,
                    }],
                } : {}),
            },
        },
    };

    try {
        const res = await fetch(`${SUBMIT_HOST}/submissions/v3/integration/submit/${target.portalId}/${target.guid}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
            cache: "no-store",
            signal: AbortSignal.timeout(15_000),
        });

        if (!res.ok) {
            const details = await res.json().catch(() => null);
            console.warn(`HubSpot submit ${res.status} (${body.form})`, JSON.stringify(details?.errors || details));
            return NextResponse.json({ error: "Sorry, we couldn't send your details. Please try again." }, { status: 502 });
        }

        const result = await res.json().catch(() => ({}));
        return NextResponse.json({ ok: true, message: result?.inlineMessage || undefined });
    } catch (error) {
        console.warn(`HubSpot submit failed (${body.form})`, (error as Error)?.message);
        return NextResponse.json({ error: "Sorry, we couldn't send your details. Please try again." }, { status: 502 });
    }
}
