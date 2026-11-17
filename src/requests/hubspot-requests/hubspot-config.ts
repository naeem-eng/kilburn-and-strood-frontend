// HubSpot forms, as agreed with K&S (no API key; the public submit endpoint, called server-side only).
// Field names are HubSpot *internal* names: a name HubSpot doesn't know is accepted (200) but silently dropped.

export type HubspotFormKey = "contact" | "signup";

type FieldConfig = { name: string; required?: boolean; maxLength: number };

export const HUBSPOT_FORMS: Record<HubspotFormKey, { fields: FieldConfig[] }> = {
    contact: {
        fields: [
            { name: "firstname", required: true, maxLength: 100 },
            { name: "lastname", required: true, maxLength: 100 },
            { name: "email", required: true, maxLength: 254 },
            { name: "jobtitle", maxLength: 150 },
            { name: "company", maxLength: 200 },
            { name: "who_do_you_want_to_talk_to_contact_form", maxLength: 200 },
            { name: "message", required: true, maxLength: 5000 },
        ],
    },
    signup: {
        fields: [
            { name: "firstname", required: true, maxLength: 100 },
            { name: "lastname", required: true, maxLength: 100 },
            { name: "email", required: true, maxLength: 254 },
        ],
    },
};

// Options for "Who would you like to talk to?". Each value must match an option of the HubSpot property
// who_do_you_want_to_talk_to_contact_form exactly. Empty list → the dropdown is hidden.
export const TALK_TO_OPTIONS: { label: string; value: string }[] = [];

// Contact form: one required tick-box (as in the design), sent to HubSpot as the consent to process data.
// Consent wording (K&S, 2026-11-17). Both forms show a privacy notice instead of a "process my data" tick-box;
// the only tick-box is marketing emails: required on sign-up (that's what the form is for), optional on contact.
export const CONSENT_TEXT = {
    signupMarketing: "I would like to receive emails from Kilburn & Strode about its insights, services and events. I understand I can unsubscribe at any time.",
    signupPrivacy: "For information about how we use your personal data, please see our",
    contactPrivacy: "We will use the information you provide to respond to your enquiry. For more information about how we handle your personal data, please see our",
    contactMarketing: "I would also like to receive emails from Kilburn & Strode about its insights, services and events. I understand I can unsubscribe at any time.",
};

export const PRIVACY_NOTICE_URL = "/privacy-notice";

// Marketing subscription "All thought leadership and event invites". The numeric subscription type ID is set in
// HUBSPOT_MARKETING_SUBSCRIPTION_ID (server env); without it, marketing consent can't be recorded in HubSpot.
export const getMarketingSubscriptionId = () => {
    const id = Number(process.env.HUBSPOT_MARKETING_SUBSCRIPTION_ID);
    return Number.isFinite(id) && id > 0 ? id : undefined;
};

// Portal and form IDs come from env, so staging can point at a HubSpot sandbox (server-side use only).
// They aren't secrets (HubSpot exposes them in its own embeds), but they do pick where submissions land.
const FORM_GUID_ENV: Record<HubspotFormKey, string | undefined> = {
    contact: process.env.HUBSPOT_CONTACT_FORM_GUID,
    signup: process.env.HUBSPOT_SIGNUP_FORM_GUID,
};
const GUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const getHubspotTarget = (form: HubspotFormKey) => {
    const portalId = process.env.NEXT_PUBLIC_HUBSPOT_PORTAL_ID?.trim();
    const guid = FORM_GUID_ENV[form]?.trim();
    if (!portalId || !/^\d+$/.test(portalId) || !guid || !GUID_RE.test(guid)) return undefined;
    return { portalId, guid };
};

export const isHubspotFormKey = (value: unknown): value is HubspotFormKey =>
    value === "contact" || value === "signup";
