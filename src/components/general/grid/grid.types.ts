// Strapi components.grid
export type GridProps = {
    index?: number;
    className?: string;
    name?: string;
    allowFilters?: boolean;
    allowSearch?: boolean;
    filterEnums?: string[];   // filter_enums names, e.g. "Sectors", "Peoples"
    renders?: string[];       // grid_renders names: "Insights", "Events", "Casestudies"
}

// One card, from an article, event or case study
export type GridCardProps = {
    id: string;
    href?: string;
    title?: string;
    tag?: string;
    date?: string;
    sortDate: number;
    imageSrc?: string;
    imageAlt?: string;
    imageWidth?: number;
    imageHeight?: number;
}
