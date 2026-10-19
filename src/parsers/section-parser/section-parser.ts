import articleHeaderparser from "./article-header-parser";
import articleHeroParser from "./article-hero-parser";
import bodyParser from "./body-parser";
import caseStudyHighlightParser from "./casestudy-highlight-parser";
import featuredBlocksParser from "./featured-blocks-parser";
import getIntTouchSectionParser from "./get-in-touch-section-parser";
import homepageHeaderParser from "./homepage-header-parser";
import inlineImageAndVideoParser from "./inline-image-and-video-parser";
import latestContentParser from "./latest-content-parser";
import locationParser from "./location-parser";
import newsletterParser from "./newsletter-parser";
import peopleHighlightParser from "./people-highlight-parser";
import secondaryHeaderParser from "./secondary-header-parser";
import { SectionParserType } from "./section-parser.types";
import statsParser from "./stats-parser";
import tabbedCotnentParser from "./tabbed-content-parser";
import testimonialSliderParser from "./testimonial-slider-parser";
import textHeaderParser from "./text-header-parser";
import textImageSliderParser from "./text-image-slider-parser";
import textWithImagerParser from "./text-with-image-parser";



const components = [
    {
        "components.homepage-header": homepageHeaderParser,
        "components.secondary-header": secondaryHeaderParser,
        "components.tabbed-content": tabbedCotnentParser,
        "components.text-image-slider": textImageSliderParser,
        "components.text-with-image": textWithImagerParser,
        "components.latest-content": latestContentParser,
        "components.people-highlight": peopleHighlightParser,
        "components.featured-blocks": featuredBlocksParser,
        "components.casestudy-highlight": caseStudyHighlightParser,
        "components.body": bodyParser,
        "components.stats": statsParser,
        "components.text-header": textHeaderParser,
        "components.testimonial-slider": testimonialSliderParser,
        "components.location": locationParser,
        "components.get-in-touch": getIntTouchSectionParser,
        "components.article-header": articleHeaderparser,
        "components.article-hero": articleHeroParser,
        "components.inline-image-and-video": inlineImageAndVideoParser,
        "components.newsletter": newsletterParser,
    }
]


const sectionParser = (sections: any): SectionParserType => {
    const parsedComponentData = [] as SectionParserType;

    sections.map((section: any) => {
        console.log({section})

        if(!section) return;
        if(!section?.component) return section;

        if(components.some((comp: any) => comp[section?.component])) {
            const todo = components.find((comp: any) => comp[section?.component]);
            // @ts-ignore
            parsedComponentData.push(todo[section?.component]?.(section)); // this is individual parser
        }

        return section;
    });

    return parsedComponentData;
}

export default sectionParser;