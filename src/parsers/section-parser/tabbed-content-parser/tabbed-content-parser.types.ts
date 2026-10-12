import { LocationDetailsProps } from "@/components/general/location-details/location-details.types";
import { TabbedBodyContentProps } from "@/components/general/tabbed-body-content/tabbed-body-content.types";
import { TabbedContentProps } from "@/components/general/tabbed-content/tabbed-content.types";

 
export type TabbedContentParserType = {
    component: 'components.tabbed-content';
    variant: 'content',
    props: TabbedContentProps;
}

export type TabbedBodyContentParserType = {
    component: 'components.tabbed-content';
    variant: 'body-content',
    contentLayout?: string;
    contentTabsLayout?: string;
    props: TabbedBodyContentProps;
}

export type TabbedMapContentParserType = {
    component: 'components.tabbed-content';
    variant: 'map-content',
    props: {
        name?: string;
        title?: string;
        tabs?: Array<LocationDetailsProps>;
        color?: 'dark-purple' | 'dark-yellow' | 'bright-red' | 'dark-blue' | 'dark-green' | 'dark-red' | 'white' | 'dark-gray';
        type?: string;
        layout?: string;
    };
}