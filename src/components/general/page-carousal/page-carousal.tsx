import ContentCarousal from "../content-carousal";
import RelatedContentCarousel from "../related-content-carousel";
import { ContentCarousalProps } from "../content-carousal/content-carousal.types";
import fetchCarousal from "@/requests/carousal-requests";

type PageCarousalProps = Parameters<typeof fetchCarousal>[0] & {
    // shown as before when allow_carousal is off (e.g. a service page's related content)
    fallback?: ContentCarousalProps | null;
    isAnimation?: boolean;
};

// allow_carousal / carousal_enums carousel; renders nothing (or the fallback) when switched off
const PageCarousal = async ({ fallback, isAnimation, ...props }: PageCarousalProps) => {
    const carousal = await fetchCarousal(props);
    if (carousal) return <ContentCarousal title={carousal.title} items={carousal.items} />;
    if (!fallback?.items?.length) return null;
    // pages that pass isAnimation used RelatedContentCarousel before; others (people) the plain ContentCarousal
    return isAnimation === undefined
        ? <ContentCarousal title={fallback.title} items={fallback.items} />
        : <RelatedContentCarousel {...fallback} isAnimation={isAnimation} />;
};

export default PageCarousal;
