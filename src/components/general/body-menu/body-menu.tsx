"use client";
import { textSafeColor } from "@/parsers";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import { Text, TitleMd } from "@/components/helpers/typography";
import { Button } from "@/components/helpers/buttons";
import { RightArrowIcon } from "@/components/helpers/icons";
import { createIncrementalAnimationAttributes } from "@/components/helpers/animation";
import BodyMarkdown from "@/components/helpers/body-markdown/BodyMarkdown";
import { BodyMenuProps } from "./body-menu.types";

// Same layout as the "content" panel of tabbed-content (components/general/tabbed-content), without the tabs.
// Difference: the menu is laid out in two columns, filled top to bottom (first half left, second half right).

type BodyMenuFieldKey = "title" | "text" | "button" | "menu";

const fieldsOrder: BodyMenuFieldKey[] = ["title", "text", "button", "menu"];

const getAnimationAttributes = createIncrementalAnimationAttributes<BodyMenuFieldKey>({
    distances: ["-14%", "-12%", "-10%", "-8%"],
    negativeOnReverse: false,
    fieldsOrder,
});
const getMobileAnimationAttributes = createIncrementalAnimationAttributes<BodyMenuFieldKey>({
    distances: ["10svh", "8svh", "6svh", "4svh"],
    fieldsOrder,
    negativeOnReverse: false,
    axis: "y",
    screenSize: "mobile-",
    trigger: ".body-menu-container",
    start: "top 90%",
});

const BodyMenu: React.FC<BodyMenuProps> = (props) => {
    const isAnimation = props?.isAnimation || false;
    const isLightAnimation = props?.isLightAnimation || false;
    const color = props?.color || "bright-red";

    const items = props?.menu?.items || [];
    const rows = Math.ceil(items.length / 2);

    return (
        <div
            data-animation={isAnimation}
            data-light-animation={isLightAnimation}
            data-animation-component
            data-section-type="body-menu"
            className={`${props?.className || ''} ${isAnimation || isLightAnimation ? 'invisible' : ''} xl:h-svh bg-white w-full flex flex-col ${(props?.index && props?.index > 0) ? "pt-5" : "pt-(--padding-top)"} relative`}
            style={{ zIndex: props.index }}
        >
            <div className="relative overflow-clip w-full flex-grow min-h-0">
                <div className="relative grid items-start grid-cols-6 grid-rows-[auto_auto] md:grid-rows-[auto_auto_1fr] md:grid-cols-12 gap-x-4 gap-y-0 w-full h-full px-(--space-3xl)">
                    <div
                        data-animation-atoms
                        data-from='{"x": "-100%"}'
                        data-middle='{"x": "0%"}'
                        data-to='{"x": "-100%"}'
                        className="text-container w-[93%] md:w-auto z-2 col-span-full md:col-[1/span_5] row-1 -ml-(--space-3xl) md:min-h-[40vh] md:justify-center bg-white py-xl md:pt-3xl md:pb-(--padding-top) px-sm md:px-(--space-3xl) flex flex-col gap-y-md min-h-0 body-menu-container overflow-clip"
                    >
                        {props?.title && (
                            <TitleMd
                                className="whitespace-pre-line"
                                attributes={{ ...getAnimationAttributes("title"), ...getMobileAnimationAttributes("title") }}
                            >
                                {props.title}
                            </TitleMd>
                        )}
                        {props?.text && (
                            <BodyMarkdown
                                color={color}
                                components={{
                                    p: ({ children }) => <Text textSize="text-base"
                                        className="mb-sm last:mb-0"
                                        attributes={{ ...getAnimationAttributes("text"), ...getMobileAnimationAttributes("text") }}>{children}</Text>,
                                }}
                            >{props.text}</BodyMarkdown>
                        )}
                        {props?.cta && (
                            <div
                                className="w-full"
                                {...getAnimationAttributes("button")}
                                {...getMobileAnimationAttributes("button")}
                            >
                                <Button isExternal={props.cta.isExternal} href={props.cta.href} icon='right-arrow' type={props.cta.type || "text"} textColor={`text-${textSafeColor(color)}`} buttonClassName="mt-0 ">{props.cta.text}</Button>
                            </div>
                        )}
                    </div>

                    {items.length > 0 && (
                        <div
                            className="content-right z-1 col-span-full md:col-[span_7/-1] md:row-[1/span_2] -ml-4 -mr-(--padding-side) md:mr-0 self-start bg-dark-gray px-xl pb-xl pt-2xl overflow-clip md:h-[100%]"
                            data-animation-atoms
                            data-from='{"x": "20%"}'
                            data-middle='{"x": "0%"}'
                            data-to='{"x": "20%"}'
                            data-mobile-from='{"y": "10%"}'
                            data-mobile-middle='{"y": "0%"}'
                            data-mobile-start="top 25%"
                            data-mobile-duration="0.4"
                        >
                            {props?.menu?.title && (
                                <div className="pb-sm mb-sm">
                                    <Text className="text-white font-modern-era-bold text-base">
                                        {props.menu.title}
                                    </Text>
                                </div>
                            )}
                            <ul
                                className="grid grid-cols-1 md:grid-cols-2 md:grid-flow-col md:grid-rows-(--menu-rows) gap-x-lg"
                                style={{ "--menu-rows": `repeat(${rows}, auto)` } as React.CSSProperties}
                            >
                                {items.map((item, idx) => {
                                    const label = <Text className="text-white" textSize="text-base">{item.title}</Text>;
                                    return (
                                        <li key={idx} className="border-t-[.1vw] border-[#ffffff33] pt-sm mb-sm">
                                            {item.href ? (
                                                <Link href={item.href} className="flex justify-between items-center hover:px-xs transition-all">
                                                    <div className="flex-1">{label}</div>
                                                    <RightArrowIcon className="w-sm h-sm" fill="var(--color-bright-red)" />
                                                </Link>
                                            ) : label}
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )}

                    {props?.media1?.url && (
                        <div className="media-bottom md:row-span-full col-span-full md:col-[1/span_5] h-full md:h-auto md:aspect-[624/337] md:self-end overflow-hidden -ml-(--space-3xl)">
                            <Image
                                sizes="(min-width: 768px) 66vw, 100vw"
                                src={props.media1.url}
                                alt={props.media1.alt || ""}
                                width={props.media1.width || 731}
                                height={props.media1.height || 337}
                                className="w-full h-full object-cover object-bottom"
                                data-animation-atoms
                                data-from='{"y": "10%"}'
                                data-middle='{"y": "0%"}'
                                data-to='{"y": "10%"}'
                            />
                        </div>
                    )}
                    {props?.media2?.url && (
                        <div
                            className="media-side absolute top-0 right-0 w-12 md:w-(--space-3xl) md:h-[50%] overflow-hidden"
                            data-animation-atoms
                            data-from='{"clip-path": "inset(0% 0 100%)"}'
                            data-middle='{"clip-path": "inset(0% 0 0%)"}'
                            data-to='{"clip-path": "inset(100% 0 0%)"}'
                            data-mobile-from='{"clip-path": "inset(0 0 100%)"}'
                            data-mobile-middle='{"clip-path": "inset(0 0 0%)"}'
                            data-mobile-to='{"clip-path": "inset(0 0 100%)"}'
                            data-mobile-start="top 65%"
                            data-mobile-duration="0.4"
                        >
                            <Image src={props.media2.url} alt={props.media2.alt || ""} width={props.media2.width || 67} height={props.media2.height || 338} className="w-full md:h-full md:object-cover" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default BodyMenu;
