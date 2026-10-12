import { LocationDetailsProps } from "../location-details/location-details.types";

export type TabbedBodyContentProps = {
    color?: 'dark-purple' | 'dark-yellow' | 'bright-red' | 'dark-blue' | 'dark-green' | 'dark-red' | 'white' | 'dark-gray';
    variant?: 'body-content' | 'map-content';
    contentFit?:boolean;
    className?: string;
    tabsClassName?: string;
    tabsContainerClassName?: string;
    singleTabClassName?:string;
    tabClass?: string;
    title?: string;
    index?: number;
    contentLayout?: string;
    contentTabsLayout?: string;
    tabsType?: 'horizontal' | 'vertical';
    TabsTitleComponent?: (args: any) => React.ReactNode;
    tabs?: Array<{
        id: string | number;
        content: string;
        title?: string;
    }>;
    mapTabs?: Array<LocationDetailsProps>;
}
