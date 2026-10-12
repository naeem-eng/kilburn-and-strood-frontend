
import { getInTouchSectionParserType } from "../section-parser/get-in-touch-section-parser/get-in-touch-section-parser.types";
 
  


export function getInTouchParser(props: any) {
  if(!props?.createForm) return null;
  
  const {
    title,
    text,
    embedCode,
    formUrl,
    cta,
    enableForm
  } = props?.createForm

  return {
    component: 'components.get-in-touch',
    props: {
       embedCode,
       formUrl,
       title,
       text,
       enableForm,
       cta: cta && cta?.map((cta: any) => ({
        text: cta?.text,
        href: cta?.link,
        type: cta?.type,
        icon: cta?.icon,
        textColor: cta?.textColor?.name,
        backgroundColor: cta?.backgroundColor?.name
      }))
    }
  } as getInTouchSectionParserType
}


