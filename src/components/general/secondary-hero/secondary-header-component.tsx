import { Button } from "@/components/helpers/buttons";
import { Text, TitleMd } from "@/components/helpers/typography/typography";
import Image from "next/image";
import { memo } from "react";
import { SecondaryHeaderComponentProps } from "./secondary-header-component.types";
import BodyMarkdown from "@/components/helpers/body-markdown/BodyMarkdown";
import { createIncrementalAnimationAttributes } from "@/components/helpers/animation";



const SecondaryHeaderComponent: React.FC<SecondaryHeaderComponentProps> = (props: SecondaryHeaderComponentProps) => {
    type AnimatedFieldKey = 'back-button' | 'title' | 'text' | 'button'

    const animatedFieldsOrder: AnimatedFieldKey[] = []
    if (props?.goBackCta) animatedFieldsOrder.push('back-button')
    if (props?.title) animatedFieldsOrder.push('title')
    if (props?.text) animatedFieldsOrder.push('text')
    if (props?.cta?.length) animatedFieldsOrder.push('button')

        console.log({props})

    const getAnimationAttributes = createIncrementalAnimationAttributes<AnimatedFieldKey>({
        distances: ['20svh', '12svh', '8svh', '4svh'],
        fieldsOrder: animatedFieldsOrder
    })

    const getTabletAnimationAttributes = createIncrementalAnimationAttributes<AnimatedFieldKey>({
        distances: ['10svh', '8svh', '6svh', '4svh'],
        negativeOnReverse: false,
        fieldsOrder: animatedFieldsOrder,
        start: 'top 80%',
        screenSize: 'mobile-',
        trigger: '.text-container',
        delay: 0.1,
        stagger: true,
        staggerAmount: 0.05
    })

    const getMobileAnimationAttributes = createIncrementalAnimationAttributes<AnimatedFieldKey>({
        distances: ['10svh', '8svh', '6svh', '4svh'],
        negativeOnReverse: false,
        fieldsOrder: animatedFieldsOrder,
        start: 'top 90%',
        screenSize: 'mobile-',
        trigger: '.text-container',
        delay: 0.1,
        stagger: true,
        staggerAmount: 0.05
    })
    const isAnimation = props?.isAnimation || false;
    const isLightAnimation = props?.isLightAnimation || false;
    const hasLongTitle = (props?.title?.length || 0) > 38;
    const hasVeryLongTitle = (props?.title?.length || 0) > 45;
    const contentMaxWidthClass = hasVeryLongTitle ? 'max-w-[100%]' : hasLongTitle ? 'max-w-[90%]' : 'max-w-[80%]';
    return (
        <div
            data-animation={isAnimation}
            data-light-animation={isLightAnimation}
            data-animation-component
            data-primary-header
            data-section-type="secondary-header"
            className={`${isAnimation || isLightAnimation ? 'invisible' : ''} h-full xl:min-h-screen xl:h-screen w-full relative flex flex-col pt-0 justify-end items-end bg-white overflow-hidden`} style={{
                zIndex: props.index
            }}>
            <div className={`flex md:flex-row gap-x-2xl w-full justify-between items-stretch xl:items-start h-full flex-col`}>
                <div className="md:max-w-1/2 flex-1 min-h-full flex items-stretch flex-col-reverse md:flex-col mt-auto">
                    {(props?.title || props?.goBackCta || props?.text) && <div
                        className={`pl-sm md:pl-xl flex-1 w-full md:h-[40%] flex flex-col gap-y-sm relative ${contentMaxWidthClass} md:justify-center items-start mt-3xl mb-sm md:my-0`}
                    >
                        {props?.goBackCta &&
                            <Button
                                icon='left-arrow'
                                type="text"
                                textColor="text-dark-gray"
                                buttonClassName={`mt-lg ${props?.goBackCta ? '' : 'invisible'}`}
                                attributes={{ ...getAnimationAttributes('back-button'), ...getTabletAnimationAttributes('back-button'), ...getMobileAnimationAttributes('back-button') }}
                            >
                                {props?.goBackCta?.text}
                            </Button>}
                        {(props?.title || props?.text) && <div className="mb-auto">
                            {props?.title &&
                                <TitleMd className="" attributes={{ ...getAnimationAttributes('title'), ...getTabletAnimationAttributes('title'), ...getMobileAnimationAttributes('title') }}>
                                    {props?.title}
                                </TitleMd>
                            }
                            {props?.text &&
                                <BodyMarkdown
                                    color={props?.color || 'bright-red'}
                                    attributes={{ ...getAnimationAttributes('text'), ...getTabletAnimationAttributes('text'), ...getMobileAnimationAttributes('text') }}
                                    components={{
                                        p: ({ children }) => <Text className="mt-sm line-clamp-7">{children}</Text>,
                                    }}
                                >
                                    {props?.text}
                                </BodyMarkdown>}
                        </div>}
                        {
                            props?.cta?.map((cta: any, index: number) => {
                                return (
                                    <Button
                                        key={index}
                                        href={cta?.href}
                                        icon={cta?.toContactForm ? 'down-arrow' : 'right-arrow'}
                                        type={cta?.type || "text"}
                                        textColor={`text-${props?.color || 'yellow'}`}
                                        buttonClassName="mt-0"
                                        attributes={{ ...getAnimationAttributes('button'), ...getTabletAnimationAttributes('button'), ...getMobileAnimationAttributes('button') }}
                                    >
                                        {cta?.text}
                                    </Button>
                                )
                            })
                        }
                    </div>}

                    {/* Left image — hidden on mobile (not in the Figma mobile design) */}
                    {props?.leftImageSrc && <div
                        data-animation-atoms
                        data-from='{"y": "100%"}'
                        data-middle='{"y": "0%" }'
                        data-to='{"y": "-60%"}'
                        className="hidden md:flex h-1/2 flex-1 mt-xl md:w-auto justify-end items-end">
                        <Image unoptimized src={props?.leftImageSrc} alt={props?.leftImageAlt || "Image 1"} width={props?.leftImageWidth || 600} height={props?.leftImageHeight || 400} className="w-full max-w-none object-cover h-full" />
                    </div>}
                </div>

                <div className="md:max-w-1/2 flex items-stretch flex-col md:flex-1 xl:min-h-full xl:h-full relative">
                    {/* Vertical strip — full height of this column on mobile, 70% on desktop */}
                    <div
                        data-animation-atoms
                        data-from='{"y": "50%"}'
                        data-middle='{"y": "0%" }'
                        className="absolute right-0 bottom-0 w-[16%] md:w-[11%] top-0 md:top-auto md:h-[70%] z-1"
                    >
                        {/* TODO: this needs to be dynamic */}
                        {props?.media3?.url && <> {
                            props?.media3?.type === "image" ? (<Image unoptimized src={props?.media3?.url} alt={props?.media3?.alt || "Image 1"} width={props?.media3?.width || 731} height={props?.media3?.height || 337} className="w-full h-full object-cover" />)
                                :
                                <video
                                    src={props?.media3?.url}
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    preload="auto"
                                    className="w-full h-full object-cover"
                                />
                        }</>}

                    </div>

                    {/* Colour block at the bottom of the strip */}
                    <div
                        data-animation-atoms
                        data-from='{"clip-path": "inset(100% 0% 0% 0%)"}'
                        data-middle='{"clip-path": "inset(0% 0% 0% 0%)"}'
                        data-to='{"clip-path": "inset(0% 0% 100%)"}'
                        className={
                            `bg-${props?.color || 'dark-purple'} w-[16%] md:w-[11%] h-[16%] md:h-[20%] absolute right-0 bottom-0 z-2`
                        }
                    />

                    {/* Main image — bleeds to the left edge on mobile and stops where the strip begins */}
                    {props?.rightImageSrc && <div
                        data-animation-atoms
                        data-from='{"clip-path": "inset(100% 0% 0%)"}'
                        data-middle='{"clip-path": "inset(0% 0% 0%)"}'
                        data-to='{"clip-path": "inset(0% 0% 100%)"}'
                        className="h-full relative top-0 mr-[16%] md:mr-2xl left-0 bottom-0 flex justify-end items-end z-3 bg-white mt-3xl md:mt-0">
                        <Image unoptimized src={props?.rightImageSrc} alt={props?.rightImageAlt || "Image 1"} width={props?.rightImageWidth || 600} height={props?.rightImageHeight || 400} className="w-full md:max-w-full object-cover aspect-[7/9] h-auto md:aspect-auto md:h-full" />
                    </div>}
                </div>
            </div>
        </div>
    )
}

export default memo(SecondaryHeaderComponent);