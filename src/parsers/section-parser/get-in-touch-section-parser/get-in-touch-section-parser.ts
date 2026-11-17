import { getInTouchSectionParserType } from "./get-in-touch-section-parser.types";

// Strapi form_type enum ("Contact us" / "Sign up") → which form component to render
export const toFormType = (value?: string | null): "contact" | "signup" | undefined => {
    const name = value?.toLowerCase().replace(/[^a-z]/g, "") || "";
    if (name.includes("sign")) return "signup";
    if (name.includes("contact")) return "contact";
    return undefined;
};



const getIntTouchSectionParser = (section: any) => {
    if(!section) return

    return  {
        component: 'components.get-in-touch',
        props: {
            title: section?.title,
            text: section?.text,
            cta: section?.cta && section?.cta?.map((cta: any) => ({
                text: cta?.text,
                href: cta?.link,
                type: cta?.type,
                icon: cta?.icon,
                textColor: cta?.textColor?.name,
                backgroundColor: cta?.backgroundColor?.name
            })),
            enableForm: section?.enableForm,
            formType: toFormType(section?.formType)
        } as getInTouchSectionParserType["props"]
    } as getInTouchSectionParserType
}

export default getIntTouchSectionParser;