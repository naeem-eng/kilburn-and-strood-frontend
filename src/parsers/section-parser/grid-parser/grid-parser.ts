import { GridParserType } from "./grid-parser.types";

type GridEnum = { name?: string | null };

const getNames = (items?: GridEnum[] | null): string[] =>
    (items || []).map((item) => item?.name?.trim()).filter((name): name is string => !!name);

// True when a page's raw sections include a grid: those pages scroll normally (no fullpage scroll hijack)
export const hasGridSection = (sections?: Array<{ component?: string }> | null): boolean =>
    !!sections?.some((section) => section?.component === "components.grid");

const gridParser = (section: any) => {
    if(!section) return

    return {
        component: 'components.grid',
        props: {
            name: section?.name,
            allowFilters: !!section?.allowFilters,
            allowSearch: !!section?.allowSearch,
            filterEnums: getNames(section?.filterEnums),
            renders: getNames(section?.gridRenders),
        } as GridParserType["props"]
    } as GridParserType
}

export default gridParser;
