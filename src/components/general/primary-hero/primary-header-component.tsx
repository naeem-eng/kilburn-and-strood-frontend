"use client";

import { Button } from "@/components/helpers/buttons";
import { Text, TitleXl } from "@/components/helpers/typography/typography";
import Image from "next/image";
import React, { memo } from "react";
import { PrimaryHeaderComponentProps } from "./primary-header-types";
import { createIncrementalAnimationAttributes } from "@/components/helpers/animation";
import ImageReveal from "@/components/interactive/image-reveal/ImageReveal";

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreak from 'remark-breaks';
import BodyMarkdown from "@/components/helpers/body-markdown/BodyMarkdown";



const PrimaryHeaderComponent: React.FC<PrimaryHeaderComponentProps> = (props: PrimaryHeaderComponentProps) => {
    type AnimatedFieldKey = 'title' | 'text' | 'button'
    const isAnimation = props?.isAnimation || false;
    const isLightAnimation = props?.isLightAnimation || false;

    const animatedFieldsOrder: AnimatedFieldKey[] = []
    if (props?.title) animatedFieldsOrder.push('title')
    if (props?.text) animatedFieldsOrder.push('text')
    // if (props?.buttonText) animatedFieldsOrder.push('button')

    const getAnimationAttributes = createIncrementalAnimationAttributes<AnimatedFieldKey>({
        distances: ['20svh', '18svh', '16svh'],
        fieldsOrder: animatedFieldsOrder
    })

    const getMobileAnimationAttributes = createIncrementalAnimationAttributes<AnimatedFieldKey>({
        distances: ['10svh', '8svh', '6svh'],
        negativeOnReverse: false,
        fieldsOrder: animatedFieldsOrder,
        screenSize: 'mobile-'
    })

    const hasBody = Boolean(props?.text) || Boolean(props?.cta?.length)

    return (
        <div
            data-animation={isAnimation}
            data-light-animation={isLightAnimation}
            data-animation-component
            data-primary-header
            data-section-type="primary-header"
            className={`${isAnimation || isLightAnimation ? 'invisible' : ''} pb-2 xl:h-screen md:pb-0 w-full flex flex-col xl:min-h-screen md:h-full sticky top-0`} style={{
                zIndex: props.index,
            }}>
            <div className={`grid grid-cols-6 grid-rows-[auto_auto_auto] md:grid-cols-12 md:grid-rows-[1fr_1fr_0] xl:grid-rows-[1fr_1fr_var(--spacing-md)] gap-x-4 gap-y-6 md:gap-y-10 px-(--padding-side) w-full h-full`}>

                {/* Text column — "contents" on mobile so title and body sit on the grid separately */}
                <div className="contents md:relative md:w-full md:col-span-7 md:flex md:flex-col md:justify-center md:gap-y-sm md:pt-10 md:pb-4">

                    {/* Title — full width on mobile */}
                    {props?.title &&
                        <div className="col-span-full row-start-1 pt-10 md:pt-0">
                            <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreak]}
                                components={{
                                    p: ({ children }) => <TitleXl attributes={{ ...getAnimationAttributes('title'), ...getMobileAnimationAttributes('title') }}>{children}</TitleXl>,
                                    strong: ({ children }) => <TitleXl as="span" className={``} style={{ color: `var(--color-${props?.color || 'yellow'})` }} >{children}</TitleXl>
                                }}
                            >
                                {props?.title}
                            </ReactMarkdown>
                        </div>
                    }

                    {/* Body + CTA — left half on mobile, beside the right image */}
                    {hasBody &&
                        <div className="col-span-3 row-start-2 flex flex-col gap-y-sm">
                            {props?.text && <BodyMarkdown
                                color={props?.color || 'bright-red'}
                                components={{
                                    p: ({ children }) => <Text attributes={{ ...getAnimationAttributes('text'), ...getMobileAnimationAttributes('text') }}
                                        className="mt-0 xl:max-w-[30vw]">{children}</Text>,
                                }}
                            >{props?.text}</BodyMarkdown>}
                            {
                                props?.cta?.map((cta: any, index: number) => {
                                    return (
                                        <Button attributes={{ ...getAnimationAttributes('button'), ...getMobileAnimationAttributes('button') }} key={index} href={cta?.href} icon='right-arrow' type={cta?.type || "text"} textColor={`text-${props?.color || 'yellow'}`} buttonClassName="mt-0">{cta?.text}</Button>
                                    )
                                })
                            }
                        </div>
                    }
                </div>

                {/* Left media — full-bleed bottom row on mobile */}
                {props?.leftMediaSrc && <div
                    data-animation-atoms
                    data-from='{"y": "20svh"}'
                    data-middle='{"y": "0%" }'
                    data-to='{"y": "-20svh"}'
                    data-mobile-from='{"y": "5svh"}'
                    data-mobile-middle='{"y": "0%" }'
                    className="overflow-clip col-span-full row-start-3 md:row-[span_2/-1] md:col-span-8 -mx-(--padding-side) md:mr-0 flex items-end"
                >
                    {props?.leftRevealImageSrc ? (
                        <ImageReveal
                            src={props.leftMediaSrc!}
                            alt={props?.leftMediaAlt || ""}
                            width={props?.leftMediaWidth || 942}
                            height={props?.leftMediaHeight || 418}
                            revealSrc={props.leftRevealImageSrc}
                            className="aspect-video md:aspect-auto w-full md:h-full object-cover"
                            imageProps={{
                                'data-animation-atoms': true,
                                'data-from': '{"y": "-10svh"}',
                                'data-middle': '{"y": "0%" }',
                                'data-mobile-from': '{"scale": "1.1"}',
                                'data-mobile-middle': '{"scale": "1"}',
                            }}
                        />
                    ) : (
                        <>
                            {
                                props?.leftMediaType === "image" && <Image
                                    src={props?.leftMediaSrc} alt={props?.leftMediaAlt || ""}
                                    width={props?.leftMediaWidth || 942} height={props?.leftMediaHeight || 418}
                                    className="aspect-video md:aspect-auto w-full md:h-full object-cover"
                                    data-animation-atoms
                                    data-mobile-from='{"scale": "1.1"}'
                                    data-mobile-middle='{"scale": "1"}'
                                />
                            }
                            {
                                props?.leftMediaType === "video" && <video
                                    src={props?.leftMediaSrc} autoPlay loop muted playsInline preload="auto"
                                    className="aspect-video md:aspect-auto w-full md:h-full object-cover"
                                    data-animation-atoms
                                    data-mobile-from='{"scale": "1.1"}'
                                    data-mobile-middle='{"scale": "1"}'
                                />
                            }
                        </>
                    )}
                </div>}

                {/* Right media — right half of row 2 on mobile, beside the body text */}
                {props?.rightMediaSrc && <div
                    data-animation-atoms
                    data-from='{"y": "-40%"}'
                    data-middle='{"y": "0%" }'
                    data-to='{"y": "90"}'
                    data-mobile-from='{"y": "5svh"}'
                    data-mobile-middle='{"y": "0%" }'
                    className={`relative col-[span_3/-1] row-start-2 aspect-[3/4] md:aspect-auto md:row-span-2 md:col-[span_3/-1] h-full block overflow-clip -mr-(--padding-side)`}>

                    {props?.rightMediaType === "image" && <Image
                        src={props?.rightMediaSrc} alt={props?.rightMediaAlt || ""}
                        width={props?.rightMediaWidth || 412} height={props?.rightMediaHeight || 678}
                        className="w-full h-full max-w-none object-cover object-top md:object-contain md:object-right"
                        data-animation-atoms
                        data-mobile-from='{"scale": "1.1"}'
                        data-mobile-middle='{"scale": "1"}'
                    />}
                    {
                        props?.rightMediaType === "video" && <video
                            src={props?.rightMediaSrc} autoPlay loop muted playsInline preload="auto"
                            className="w-full h-full max-w-none object-cover object-top md:object-contain md:object-right"
                            data-animation-atoms
                            data-mobile-from='{"scale": "1.1"}'
                            data-mobile-middle='{"scale": "1"}'
                        />
                    }
                </div>}

            </div>
        </div>
    )
}

export default memo(PrimaryHeaderComponent);