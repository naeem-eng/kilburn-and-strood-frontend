"use client";

import { Button } from "@/components/helpers/buttons";
import { ConsentFields, TextField } from "../hubspot-form/form-fields";
import { FormError, FormSent } from "../hubspot-form/form-status";
import { useHubspotSubmit } from "../hubspot-form/use-hubspot-submit";

// Sign up form → HubSpot "Sign-up" form (via /api/hubspot-submit)
const SignUpForm = () => {
    const { status, error, fieldErrors, onSubmit } = useHubspotSubmit("signup");

    if (status === "sent") {
        return <FormSent title="Thank you for signing up" text="You'll start receiving our insights and event invitations soon." />;
    }

    return (
        <form onSubmit={onSubmit} aria-label="Sign up" className="relative flex flex-col gap-y-md w-full">
            <TextField id="signup-firstname" name="firstname" label="First name" placeholder="Enter first name" autoComplete="given-name" maxLength={100} error={fieldErrors.firstname} />
            <TextField id="signup-lastname" name="lastname" label="Last name" placeholder="Enter last name" autoComplete="family-name" maxLength={100} error={fieldErrors.lastname} />
            <TextField id="signup-email" name="email" type="email" label="Email" placeholder="Email address" autoComplete="email" maxLength={254} error={fieldErrors.email} />
            <ConsentFields idPrefix="signup" error={fieldErrors.consentToProcess} />
            <FormError message={error} />
            <Button type="filled" backgroundColor="bg-bright-red" icon="right-arrow" loader={status === "sending"} attributes={{ type: "submit", disabled: status === "sending" }}>
                Sign up
            </Button>
        </form>
    );
};

export default SignUpForm;
