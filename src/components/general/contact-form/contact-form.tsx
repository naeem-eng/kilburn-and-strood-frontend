"use client";

import { Button } from "@/components/helpers/buttons";
import { TALK_TO_OPTIONS } from "@/requests/hubspot-requests/hubspot-config";
import { SelectField, TermsConsentField, TextAreaField, TextField } from "../hubspot-form/form-fields";
import { FormError, FormSent } from "../hubspot-form/form-status";
import { useHubspotSubmit } from "../hubspot-form/use-hubspot-submit";

// Contact us form → HubSpot "Contact" form (via /api/hubspot-submit)
const ContactForm = () => {
    const { status, error, fieldErrors, onSubmit } = useHubspotSubmit("contact");

    if (status === "sent") {
        return <FormSent title="Thank you for getting in touch" text="We've received your message and will be in touch soon." />;
    }

    return (
        <form onSubmit={onSubmit} aria-label="Contact us" className="relative flex flex-col gap-y-md w-full">
            <TextField id="firstname" label="First name" placeholder="Enter first name" autoComplete="given-name" maxLength={100} error={fieldErrors.firstname} />
            <TextField id="lastname" label="Last name" placeholder="Enter last name" autoComplete="family-name" maxLength={100} error={fieldErrors.lastname} />
            <TextField id="email" type="email" label="Email" placeholder="Email address" autoComplete="email" maxLength={254} error={fieldErrors.email} />
            <TextField id="jobtitle" label="Job title" optional placeholder="Enter your job title" autoComplete="organization-title" maxLength={150} />
            <TextField id="company" label="Organisation" optional placeholder="Type the name of your organisation" autoComplete="organization" maxLength={200} />
            {TALK_TO_OPTIONS.length > 0 && (
                <SelectField id="who_do_you_want_to_talk_to_contact_form" label="Who would you like to talk to?" optional placeholder="Select one option" options={TALK_TO_OPTIONS} />
            )}
            <TextAreaField id="message" label="Message" placeholder="Type your message" maxLength={5000} error={fieldErrors.message} />
            <TermsConsentField idPrefix="contact" error={fieldErrors.consentToProcess} />
            <FormError message={error} />
            <Button buttonClassName="mt-sm" type="filled" backgroundColor="bg-bright-red" icon="right-arrow" loader={status === "sending"} attributes={{ type: "submit", disabled: status === "sending" }}>
                Submit
            </Button>
        </form>
    );
};

export default ContactForm;
