import {  TextHeaderParserType } from "./text-header-parser.types";



const textHeaderParser = (section: any) => {
    if(!section) return

    return  {
        component: 'components.text-header',
        props: {
            title: section?.title,
            text: section?.text
        } as TextHeaderParserType["props"]
    } as TextHeaderParserType
}

export default textHeaderParser;