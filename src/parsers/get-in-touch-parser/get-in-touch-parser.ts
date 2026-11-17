
import { getInTouchSectionParserType } from "../section-parser/get-in-touch-section-parser/get-in-touch-section-parser.types";
import { toFormType } from "../section-parser/get-in-touch-section-parser/get-in-touch-section-parser";
 
  


export function getInTouchParser(props: any) {
  if(!props?.createForm) return null;
  
  const {
    title,
    text,
    cta,
    enableForm,
    formType
  } = props?.createForm

  return {
    component: 'components.get-in-touch',
    props: {
       title,
       text,
       enableForm,
       formType: toFormType(formType),
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


