"use client";

import Link from "next/link";
import { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { CONSENT_TEXT, PRIVACY_NOTICE_URL } from "@/requests/hubspot-requests/hubspot-config";

// Form controls shared by ContactForm and SignUpForm (design: label above a light-gray, borderless field).

const controlClass = "w-full bg-light-gray text-dark-gray text-base px-sm py-xs placeholder:text-medium-gray border border-transparent aria-[invalid=true]:border-dark-red";

type FieldShellProps = { id: string; label: string; optional?: boolean; error?: string; children: React.ReactNode };

const FieldShell = ({ id, label, optional, error, children }: FieldShellProps) => (
    <div className="flex flex-col gap-y-2xs w-full">
        <label htmlFor={id} className="text-base text-dark-gray">
            {label}{optional && <span className="text-base text-medium-gray"> (optional)</span>}
        </label>
        {children}
        {error && <p id={`${id}-error`} className="text-xs text-dark-red">{error}</p>}
    </div>
);

type BaseProps = { id: string; label: string; optional?: boolean; error?: string };

export const TextField = ({ id, label, optional, error, ...input }: BaseProps & InputHTMLAttributes<HTMLInputElement>) => (
    <FieldShell id={id} label={label} optional={optional} error={error}>
        <input id={id} name={id} required={!optional} aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined} className={controlClass} {...input} />
    </FieldShell>
);

export const TextAreaField = ({ id, label, optional, error, ...textarea }: BaseProps & TextareaHTMLAttributes<HTMLTextAreaElement>) => (
    <FieldShell id={id} label={label} optional={optional} error={error}>
        <textarea id={id} name={id} rows={5} required={!optional} aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined} className={`${controlClass} resize-y`} {...textarea} />
    </FieldShell>
);

export const SelectField = ({ id, label, optional, error, placeholder, options, ...select }: BaseProps & SelectHTMLAttributes<HTMLSelectElement> & { placeholder: string; options: { label: string; value: string }[] }) => (
    <FieldShell id={id} label={label} optional={optional} error={error}>
        <select id={id} name={id} required={!optional} defaultValue="" aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined} className={`${controlClass} appearance-none bg-[url("data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20width='12'%20height='8'%20viewBox='0%200%2012%208'%3E%3Cpath%20d='M1%201l5%205%205-5'%20fill='none'%20stroke='%23333'%20stroke-width='1.5'/%3E%3C/svg%3E")] bg-no-repeat bg-[right_1rem_center] pr-lg`} {...select}>
            <option value="" disabled>{placeholder}</option>
            {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
        </select>
    </FieldShell>
);

// Consent block for both forms, styled like the old contact "Terms and Conditions" line (text-xs, dark gray).
// Contact: privacy notice, then an optional marketing tick-box. Sign-up: a required marketing tick-box, then the privacy notice.
const consentText = "text-xs! text-dark-gray";
const linkClass = "text-xs! underline underline-offset-2 hover:text-bright-red";

const PrivacyNotice = ({ text }: { text: string }) => (
    <p className={consentText}>
        {text}{" "}
        <Link href={PRIVACY_NOTICE_URL} className={linkClass}>Privacy Notice</Link>.
    </p>
);

const MarketingCheckbox = ({ id, text, required, error }: { id: string; text: string; required?: boolean; error?: string }) => (
    <div className="flex flex-col gap-y-2xs">
        <label className={`${consentText} flex items-start gap-x-xs cursor-pointer`}>
            <input type="checkbox" name="consentMarketing" id={id} required={required} aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined} className="consent-checkbox mt-0 shrink-0 w-[max(12px,0.95em)]! h-[max(12px,0.95em)]! min-w-[12px] cursor-pointer" />
            <span className={consentText}>{text}</span>
        </label>
        {error && <p id={`${id}-error`} className="text-xs text-dark-red">{error}</p>}
    </div>
);

export const ContactConsentFields = ({ idPrefix, error }: { idPrefix: string; error?: string }) => (
    <fieldset className="flex flex-col gap-y-sm">
        <legend className="sr-only">Privacy and email preferences</legend>
        <PrivacyNotice text={CONSENT_TEXT.contactPrivacy} />
        <MarketingCheckbox id={`${idPrefix}-consent-marketing`} text={CONSENT_TEXT.contactMarketing} error={error} />
    </fieldset>
);

export const SignupConsentFields = ({ idPrefix, error }: { idPrefix: string; error?: string }) => (
    <fieldset className="flex flex-col gap-y-sm">
        <legend className="sr-only">Email preferences</legend>
        <MarketingCheckbox id={`${idPrefix}-consent-marketing`} text={CONSENT_TEXT.signupMarketing} required error={error} />
        <PrivacyNotice text={CONSENT_TEXT.signupPrivacy} />
    </fieldset>
);
