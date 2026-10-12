import { BodyParserType } from "./body-parser.types";



const bodyParser = (section: any) => {
    if(!section) return

    return  {
        component: 'components.body',
        props: {
             content: section?.content
        } as BodyParserType["props"]
    } as BodyParserType
}

export default bodyParser;