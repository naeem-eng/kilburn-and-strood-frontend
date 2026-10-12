
export type Testimonial = {
    imageSrc: string;
    imageAlt: string;
    quote: string;
    name: string;
    role: string;
    profileLink?: string;
    isExternalProfile?: boolean;
    publicationLink?: string;
}

export type TestimonialSliderProps = {
    isAnimation?: boolean;
    isLightAnimation?: boolean;
    index?: number;
    textOnLeft?: boolean;
    title?: string;
    testimonials: Testimonial[];
}
