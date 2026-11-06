"use client";

import Link from "next/link";
import { InputHTMLAttributes, SelectHTMLAttributes, TextareaHTMLAttributes } from "react";
import { CONSENT_TEXT, PRIVACY_POLICY_URL, TERMS_URL } from "@/requests/hubspot-requests/hubspot-config";

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

// Contact form: a single required "I accept the Terms and Conditions" tick-box
export const TermsConsentField = ({ idPrefix, error }: { idPrefix: string; error?: string }) => (
    <div className="flex flex-col gap-y-2xs text-xs text-dark-gray">
        <label className="text-xs! flex items-start gap-x-xs cursor-pointer">
            <input type="checkbox" name="consentProcess" id={`${idPrefix}-consent-terms`} required aria-invalid={!!error} aria-describedby={error ? `${idPrefix}-consent-error` : undefined} className="shrink-0 accent-dark-gray" />
            <span className="text-xs">
                I accept the{" "}
                <Link href={TERMS_URL} className="text-xs!  underline underline-offset-2 hover:text-bright-red">Terms and Conditions</Link>
            </span>
        </label>
        {error && <p id={`${idPrefix}-consent-error`} className="text-xs text-dark-red">{error}</p>}
    </div>
);

// Sign-up form: separate consents, wording as agreed with K&S: marketing (optional) and store/process data (required)
export const ConsentFields = ({ idPrefix, error }: { idPrefix: string; error?: string }) => (
    <fieldset className="flex flex-col gap-y-sm text-xs! text-dark-gray">
        <legend className="sr-only">Consent</legend>
        <p className="text-xs!">{CONSENT_TEXT.intro}</p>
        <label className="flex items-start gap-x-xs cursor-pointer">
            <input type="checkbox" name="consentMarketing" id={`${idPrefix}-consent-marketing`} className=" shrink-0 accent-dark-gray" />
            <span>{CONSENT_TEXT.marketing}</span>
        </label>
        <p className="text-sm">{CONSENT_TEXT.processIntro}</p>
        <label className="flex items-start gap-x-xs cursor-pointer">
            <input type="checkbox" name="consentProcess" id={`${idPrefix}-consent-process`} required aria-invalid={!!error} aria-describedby={error ? `${idPrefix}-consent-error` : undefined} className="mt-[0.2em] shrink-0 accent-dark-gray" />
            <span>{CONSENT_TEXT.process}</span>
        </label>
        {error && <p id={`${idPrefix}-consent-error`} className="text-xs text-dark-red">{error}</p>}
        <p className="text-sm">
            {CONSENT_TEXT.privacy}{" "}
            <Link href={PRIVACY_POLICY_URL} className="underline underline-offset-2 hover:text-bright-red">Privacy Policy</Link>.
        </p>
    </fieldset>
);
