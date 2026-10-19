import { Fragment, memo } from "react";
import { SectionsType } from "./sections.types";
import sectionParser from "@/parsers/section-parser";
import PrimaryHeaderComponent from "../general/primary-hero/primary-header-component";
import SecondaryHeaderComponent from "../general/secondary-hero/secondary-header-component";
import TabbedContent from "../general/tabbed-content";
import TextImageSlider from "../general/text-image-slider";
import TextWithImage from "../general/text-with-image";
import LatestInsight from "../general/latest-insight";
import PeopleHighlight from "../general/people-highlight";
import Services from "../general/services";
import CaseStudiesTypeOne from "../general/case-studies-type-one";
import CaseStudiesTypeTwo from "../general/case-studies-type-two";
import CaseStudiesTypeThree from "../general/case-studies-type-three";
import CaseStudiesTypeFour from "../general/case-studies-type-four";
import Body from "../general/body";
import TabbedBodyContent from "../general/tabbed-body-content";
import Stats from "../general/stats";
import TextHeader from "../general/text-header";
import TestimonialSlider from "../general/testimonial-slider";
import LocationDetails from "../general/location-details";
import GetInTouch from "../general/get-in-touch";
import ArticleHeader from "../general/article-header";
import ArticleHero from "../general/article-hero";
import InlineImageAndVideo from "../general/inline-image-and-video";
import Newsletter from "../general/newsletter/newsletter";
type RenderCtx = {
    i: number;
    isAnimation?: boolean;
    isLightAnimation?: boolean;
    color?: string;
};

const CASE_STUDY_VARIANTS: Record<string, React.ComponentType<any>> = {
    'type-1': CaseStudiesTypeOne,
    'type-2': CaseStudiesTypeTwo,
    'type-3': CaseStudiesTypeThree,
    'type-4': CaseStudiesTypeFour,
};

const SECTION_REGISTRY: Record<string, (section: any, ctx: RenderCtx) => React.ReactNode> = {
    'components.inline-image-and-video': (s, { i }) =>
        <InlineImageAndVideo {...s.props} index={i} />,

    'components.article-hero': (s, { i }) =>
        <ArticleHero {...s.props} index={i} />,

    'components.article-header': (s, { i }) =>
        <ArticleHeader {...s.props} index={i} />,

    'components.get-in-touch': (s, { i }) =>
        <GetInTouch {...s.props} index={i} />,

    'components.location': (s, { i }) =>
        <LocationDetails {...s.props} index={i} />,

    'components.homepage-header': (s, { i, isAnimation, isLightAnimation }) =>
        <PrimaryHeaderComponent {...s.props} isAnimation={isAnimation} isLightAnimation={isLightAnimation} index={i} />,

    'components.secondary-header': (s, { i, isAnimation, isLightAnimation }) =>
        <SecondaryHeaderComponent {...s.props} isAnimation={isAnimation} isLightAnimation={isLightAnimation} index={i} />,

    'components.tabbed-content': (s, { i, isAnimation, isLightAnimation }) => {
        if (s.variant === 'body-content')
            return <TabbedBodyContent contentTabsLayout={s.contentTabsLayout} contentLayout={s.contentLayout} variant="body-content" className="no-section pt-12 md:pt-(--padding-top)" {...s.props} isAnimation={isAnimation} isLightAnimation={isLightAnimation} index={i} />;
        if (s.variant === 'map-content')
            return <TabbedBodyContent contentTabsLayout={s.contentTabsLayout} contentLayout={s.contentLayout} variant="map-content" className="no-section" {...s.props} isAnimation={isAnimation} isLightAnimation={isLightAnimation} index={i} />;
        return <TabbedContent className={i === 0 ? '' : 'pt-12 md:pt-(--padding-top)'} {...s.props} isAnimation={isAnimation} isLightAnimation={isLightAnimation} index={i} />;
    },

    'components.text-header': (s, { i, isAnimation, isLightAnimation }) =>
        <TextHeader className={i === 0 ? '' : 'no-section textHeaderSection h-auto! pb-0! md:-mb-xl'} {...s.props} isAnimation={isAnimation} isLightAnimation={isLightAnimation} index={i} />,

    'components.text-image-slider': (s, { i, isAnimation, isLightAnimation }) =>
        <TextImageSlider {...s.props} isAnimation={isAnimation} isLightAnimation={isLightAnimation} index={i} />,

    'components.text-with-image': (s, { i, isAnimation, isLightAnimation }) =>
        <TextWithImage className={i === 0 ? 'pt-0! mb-10' : ''} {...s.props} isAnimation={isAnimation} isLightAnimation={isLightAnimation} index={i} />,

    'components.latest-content': (s, { i, isAnimation, isLightAnimation }) =>
        <LatestInsight {...s.props} isAnimation={isAnimation} isLightAnimation={isLightAnimation} index={i} />,

    'components.people-highlight': (s, { i, isAnimation, isLightAnimation }) =>
        <PeopleHighlight {...s.props} isAnimation={isAnimation} isLightAnimation={isLightAnimation} index={i} />,

    'components.featured-blocks': (s, { i, isAnimation, isLightAnimation }) =>
        <Services {...s.props} isAnimation={isAnimation} isLightAnimation={isLightAnimation} index={i} />,

    'components.testimonial-slider': (s, { i, isAnimation, isLightAnimation }) =>
        <TestimonialSlider {...s.props} isAnimation={isAnimation} isLightAnimation={isLightAnimation} index={i} />,

    'components.casestudy-highlight': (s, { i, isAnimation, isLightAnimation }) => {
        const Component = CASE_STUDY_VARIANTS[s.variant];
        if (!Component) return null;
        return <Component {...s.props} isAnimation={isAnimation} isLightAnimation={isLightAnimation} index={i} />;
    },

    'components.body': (s, { i, color }) =>
        <Body color={color} className="no-section md:pt-4xl md:pb-0!" {...s.props} index={i} />,

    'components.stats': (s, { i }) =>
        <Stats className="no-section w-full xl:max-w-[70%] px-sm md:px-xl mx-auto mt-3xl mb-xl" {...s.props} index={i} />,

    'components.newsletter': (s, { i, isAnimation, isLightAnimation }) =>
        <Newsletter {...s.props} isAnimation={isAnimation} isLightAnimation={isLightAnimation} index={i} />,

};

const Sections: React.FC<SectionsType> = ({ sections, isAnimation, isLightAnimation, color }) => {
    const parsed = sectionParser(sections);
    
    return (
        <>
            {parsed.map((section, i) => {
                const renderer = SECTION_REGISTRY[section.component];
                if (!renderer) return null;
                return <Fragment key={section.component + i}>{renderer(section, { i, isAnimation, isLightAnimation, color })}</Fragment>;
            })}
        </>
    );
};

export default memo(Sections);
