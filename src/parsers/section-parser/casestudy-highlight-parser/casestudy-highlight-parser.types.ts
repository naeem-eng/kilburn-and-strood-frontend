import { CaseStudiesTypeFourProps } from "@/components/general/case-studies-type-four/case-studies-type-four.types";
import { CaseStudiesTypeOneProps } from "@/components/general/case-studies-type-one/case-studies-type-one.types";
import { CaseStudiesTypeThreeProps } from "@/components/general/case-studies-type-three/case-studies-type-three.types";
import { CaseStudiesTypeTwoProps } from "@/components/general/case-studies-type-two/case-studies-type-two.types";


 
export type CaseStudyHighlightTypeOneParserType = {
    component: 'components.casestudy-highlight';
    variant: 'type-1';
    props: CaseStudiesTypeOneProps;
}

export type CaseStudyHighlightTypeTwoParserType = {
    component: 'components.casestudy-highlight';
    variant: 'type-2';
    props: CaseStudiesTypeTwoProps;
}

export type CaseStudyHighlightTypeThreeParserType = {
    component: 'components.casestudy-highlight';
    variant: 'type-3';
    props: CaseStudiesTypeThreeProps;
}

export type CaseStudyHighlightTypeFourParserType = {
    component: 'components.casestudy-highlight';
    variant: 'type-4';
    props: CaseStudiesTypeFourProps;
}