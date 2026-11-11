import { PeopleGetInTouchPhone, PeopleGetInTouchProps } from "@/components/general/people-get-in-touch/people-get-in-touch.types";
import { getStrapiMedia } from "@/utils/utils";

type StrapiMediaLite = {
    url?: string | null;
    alternativeText?: string | null;
    width?: number | null;
    height?: number | null;
} | null;

export type StrapiPeopleContact = {
    name?: string | null;
    email?: string | null;
    phone?: string | null;
    linkedin?: string | null;
    vcardFile?: StrapiMediaLite;
    profilePhoto?: StrapiMediaLite;
    headerPhoto?: StrapiMediaLite;
    peopleRoles?: Array<{ color?: { name?: string | null } | null } | null> | null;
};

// Strapi's phone field can hold several numbers ("44 (0)20 3947 4200, 31 10 899 8644"), stored without the leading +
const parsePhones = (phone?: string | null): PeopleGetInTouchPhone[] =>
    (phone || "")
        .split(/[,;\/]/)
        .map((value) => value.trim())
        .filter((value) => /\d/.test(value))
        .map((value) => {
            const isInternational = !value.startsWith("0");
            const digits = value.replace(/\(0\)/g, "").replace(/[^\d]/g, "");
            const text = isInternational && !value.startsWith("+") ? `+${value}` : value;
            return { text, href: `tel:${isInternational ? "+" : ""}${digits}` };
        });

const peopleGetInTouchParser = (person?: StrapiPeopleContact | null): PeopleGetInTouchProps | undefined => {
    if (!person?.name) return undefined;

    const email = person.email?.trim() || undefined;
    const phones = parsePhones(person.phone);
    const vcardUrl = person.vcardFile?.url || undefined;
    const linkedin = person.linkedin?.trim() || undefined;

    // nothing to get in touch with → no block
    if (!email && !phones.length && !vcardUrl && !linkedin) return undefined;

    const photo = person.profilePhoto?.url ? person.profilePhoto : person.headerPhoto;

    return {
        firstName: person.name.trim().split(/\s+/)[0],
        color: person.peopleRoles?.[0]?.color?.name || "bright-red",
        email,
        phones,
        vcardUrl,
        linkedin,
        imageSrc: photo?.url ? getStrapiMedia(photo, "medium") : undefined,
        imageAlt: photo?.alternativeText || person.name,
        imageWidth: photo?.width || undefined,
        imageHeight: photo?.height || undefined,
    };
};

export default peopleGetInTouchParser;
