
import { ArticleHeaderParserType } from "./article-header-parser.types";



const articleHeaderparser = (section: any) => {
    if(!section) return

    return  {
        component: 'components.article-header',
        props: {
            title: section?.title,
            articalType: section?.articalType,
            date: section?.date,
            shareable: section?.shareable,
            cta: section?.cta && section?.cta?.map((cta: any) => ({
                text: cta?.text,
                href: cta?.link,
                type: cta?.type,
                icon: cta?.icon,
                textColor: cta?.textColor?.name,
                backgroundColor: cta?.backgroundColor?.name
            }))
        } as ArticleHeaderParserType["props"]
    } as ArticleHeaderParserType
}

export default articleHeaderparser;