import ContentCarousal from "../content-carousal";
import { RelatedContentCarouselProps } from "./related-content-carousel.types";

const RelatedContentCarousel = ({ title, items, isAnimation = false }: RelatedContentCarouselProps) => {
  return (
    <div
      data-animation-component
      data-animation={isAnimation}
      className={`${isAnimation ? "" : "no-section"} w-full`}
    >
      <ContentCarousal title={title} items={items} />
    </div>
  );
};

export default RelatedContentCarousel;
