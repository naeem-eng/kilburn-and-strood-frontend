import { HubspotFormKey } from "@/requests/hubspot-requests/hubspot-config";

// GTM custom events for a successful HubSpot submission. GTM has a Custom Event trigger per event that fires
// the GA4 event tag, so the names must match those triggers exactly.
// The names come from Strapi global-setting (contact_form_event / signup_form_event), put on <body> by the root
// layout; these defaults are used if they're missing. Keep in sync with DEFAULT_FORM_EVENTS in global-requests.
// No GA4 code here: the site only pushes to the dataLayer, GTM decides what to send.
const DEFAULT_EVENTS: Record<HubspotFormKey, string> = {
    contact: "contact_form_submit",
    signup: "newsletter_signup",
};

declare global {
    interface Window {
        dataLayer?: Record<string, unknown>[];
    }
}

const eventName = (form: HubspotFormKey) => {
    const fromStrapi = form === "contact" ? document.body.dataset.contactFormEvent : document.body.dataset.signupFormEvent;
    return fromStrapi || DEFAULT_EVENTS[form];
};

// Call only after HubSpot has accepted the submission. Never pass field values: no names, emails or messages.
export const trackHubspotSuccess = (form: HubspotFormKey) => {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
        event: eventName(form),
        form_name: form,
    });
};
