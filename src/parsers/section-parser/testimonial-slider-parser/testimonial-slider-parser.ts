import { getStrapiMedia } from "@/utils/utils";
import { TestimonialSliderParserType } from "./testimonial-slider-parser.types";


const getExternalHref = (href?: string | null) => {
    const value = href?.trim()
    if (!value) return undefined

    return /^https?:\/\//i.test(value)
        ? value
        : `https://${value.replace(/^\/\//, '')}`
}

const testimonialSliderParser = (section: any) => {
    if(!section) return

    return  {
        component: 'components.testimonial-slider',
        props: {
            title: section?.title,
            testimonials: section?.testimonials?.map((testimonial: any) => {
                const person = testimonial?.person
                const isInternal = !!person

                return {
                    imageSrc: isInternal
                        ? getStrapiMedia(person?.profilePhoto, 'medium') || getStrapiMedia(testimonial?.media, 'medium')
                        : getStrapiMedia(testimonial?.media, 'medium'),
                    imageAlt: isInternal
                        ? person?.name
                        : testimonial?.media?.alternativeText,
                    quote: testimonial?.quote,
                    name: isInternal ? person?.name : testimonial?.title,
                    role: isInternal ? person?.title : testimonial?.role,
                    profileLink: isInternal
                        ? `/people/${person?.slug}`
                        : getExternalHref(testimonial?.externalProfileLink),
                    isExternalProfile: !isInternal,
                    publicationLink: getExternalHref(testimonial?.publicationLink),
                }
            }),
        } as TestimonialSliderParserType["props"]
    } as TestimonialSliderParserType
}

export default testimonialSliderParser;
