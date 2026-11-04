import ContentCarousal from "../content-carousal";
import fetchCarousal from "@/requests/carousal-requests";

type PageCarousalProps = Parameters<typeof fetchCarousal>[0];

// allow_carousal / carousal_enums carousel. Place it right before the full CTA; renders nothing when switched off.
const PageCarousal = async (props: PageCarousalProps) => {
    const carousal = await fetchCarousal(props);
    if (!carousal) return null;
    return <ContentCarousal title={carousal.title} items={carousal.items} />;
};

export default PageCarousal;
