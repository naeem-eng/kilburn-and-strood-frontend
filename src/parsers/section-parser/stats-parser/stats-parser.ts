import { StatsParserType } from "./stats-parser.types";



const statsParser = (section: any) => {
    if(!section) return

    return  {
        component: 'components.stats',
        props: {
            title: section?.title,
            values: section?.items?.map((value: any) => ({
                value: value?.title,
                details: value?.text
            }))
        } as StatsParserType["props"]
    } as StatsParserType
}

export default statsParser;