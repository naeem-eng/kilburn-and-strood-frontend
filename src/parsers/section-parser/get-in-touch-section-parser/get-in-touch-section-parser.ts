import { getInTouchSectionParserType } from "./get-in-touch-section-parser.types";



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
            embedCode: section?.embedCode,
            formUrl: section?.formUrl,
            enableForm: section?.enableForm
        } as getInTouchSectionParserType["props"]
    } as getInTouchSectionParserType
}

export default getIntTouchSectionParser;