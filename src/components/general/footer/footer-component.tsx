"use client";

import { Button } from "@/components/helpers/buttons";
import { CTAButtonProps } from "@/components/helpers/buttons/buttons";
import { Small, Text, TextMd, TitleLg, TitleMd, TitleSm, TitleXl } from "@/components/helpers/typography/typography";
import Image from "next/image";
import Link from "next/link";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkBreak from 'remark-breaks';


type FooterComponentProps = {
    logo: string;
    footer: {
        title: string;
        cta: Array<CTAButtonProps>;
        footerMenu: {
            footerCta: Array<CTAButtonProps>;
        };
        socialCta: Array<CTAButtonProps>;
        subMenu: Array<CTAButtonProps>;
    };
}

// footer links: grey text with a purple hover underline that follows the wrapped text
const underlinePurple = { '--underline-color': 'var(--color-dark-purple)' } as React.CSSProperties;

const FooterComponent = (props: FooterComponentProps) => {

    const [fixed, setFixed] = useState(false);
    const footerLogoRef = useRef<HTMLDivElement>(null);
    const calculatedHegiht = useRef<HTMLDivElement>(null);
    const {
        title,
        cta,
        footerMenu,
        socialCta,
        subMenu,
    } = props?.footer;


    useEffect(() => {
        if (!calculatedHegiht?.current || !footerLogoRef.current) return;

        const resize = () => {
            if (!calculatedHegiht?.current || !footerLogoRef.current) return;

            // offsetTop includes the wrapper's top padding (pt-[7vw]), which the content height alone missed:
            // on short screens the links' bottom row ended up hidden behind the fixed logo.
            const contentBottom = calculatedHegiht.current.offsetTop + calculatedHegiht.current.offsetHeight;
            const logoHeight = footerLogoRef.current.getBoundingClientRect().height;

            setFixed(window.innerHeight < contentBottom + logoHeight);
        }
        window.addEventListener('resize', resize);
        // fonts / the logo image can change the heights after mount
        const observer = new ResizeObserver(resize);
        observer.observe(calculatedHegiht.current);
        observer.observe(footerLogoRef.current);
        resize();

        return () => {
            window.removeEventListener('resize', resize);
            observer.disconnect();
        }

    }, [calculatedHegiht, footerLogoRef]);


    useEffect(() => {
        if (!footerLogoRef?.current) return;


        function runReveal() {
            if (!footerLogoRef.current) return;
            const el = footerLogoRef.current;
            const rect = footerLogoRef.current.getBoundingClientRect();
            const scrollPos = window.innerHeight + window.scrollY;
            const pageHeight = document.body.offsetHeight;
            const footer = document.getElementById('footer');


            // the big logo slides up only at the very bottom of the page
            if (scrollPos >= pageHeight - (window.innerHeight - rect.height)) {
                el.classList.add('-bottom-0!');
            } else {
                el.classList.remove('-bottom-0!');
            }

            // the (fixed) footer links show as soon as the footer's space scrolls into view, so scrolling
            // up a little no longer hides them and leaves a blank white area
            if (footer) {
                footer.style.opacity = footer.getBoundingClientRect().top < window.innerHeight ? '1' : '0';
            }
        }


        window.addEventListener('scroll', runReveal, { passive: true });

        // Initial run
        runReveal();

        return () => {
            window.removeEventListener('scroll', runReveal);
        };
    }, []);

    // Strapi sends the footer links as one flat list (Services…, Sectors…, Contact…) with no column field.
    // Start a new column at a heading without a link ("Sectors") and when a run of /sectors/ links ends,
    // so each group stays together however many links it has. Falls back to chunks of 5.
    const cols = useMemo(() => {
        const items = footerMenu?.footerCta || [];
        if (!items.length) return [];

        const isSector = (item?: CTAButtonProps) => Boolean(item?.link?.startsWith('/sectors/'));
        const result: CTAButtonProps[][] = [];
        items.forEach((item, i) => {
            const prev = items[i - 1];
            const startsColumn = i === 0 || !item.link || (isSector(prev) && !isSector(item));
            if (startsColumn) result.push([]);
            result[result.length - 1].push(item);
        });

        if (result.length > 1) return result;

        const chunked: CTAButtonProps[][] = [];
        for (let i = 0; i < items.length; i += 5) chunked.push(items.slice(i, i + 5));
        return chunked;
    }, [footerMenu]);


    return (
        <>
            <footer
                data-animation={true}
                data-animation-component
                id="footer"
                className={`md:min-h-screen [body.tablet_&]:min-h-[70vh] [body.tablet_&]:h-[70vh] w-full md:pb-0 pb-xl bg-[#ffffff] opacity-0`}
                style={{
                    zIndex: 0
                }}>
                <div className={`${fixed ? 'relative' : 'md:fixed md:max-h-[70vh]'} w-full top-0 [body.tablet_&]:top-[30vh] right-0 left-0  flex flex-col pt-3xl md:pt-[7vw] md:[body.tablet_&]:min-h-[70vh]`}>
                    <div ref={calculatedHegiht} className="w-full px-sm md:px-xl  flex flex-row justify-start md:justify-between items-start flex-wrap">

                        <div className="min-w-full mb-3xl xl:flex-1 xl:max-w-[42%] xl:min-w-[42%] xl:pr-xl xl:mb-0">

                            <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreak]}
                                components={{
                                    p: ({ children }) => <TitleSm as="h2">{children}</TitleSm>,
                                }}
                            >
                                {title}
                            </ReactMarkdown>
                            {
                                cta?.map((item, index) => {
                                    return (
                                        <Button
                                            key={index}
                                            icon={item.isExternal ? 'external-link' : item.icon}
                                            type={item.type || "text"}
                                            textColor="text-dark-purple"
                                            buttonClassName="mt-md text-base! font-modern-era-medium"
                                            href={item.link}
                                        >{item.text}</Button>
                                    )
                                })
                            }
                        </div>

                        <div className="flex flex-col gap-y-2xl w-full xl:flex-1 xl:max-w-[58%]">
                            {/* link columns, with the B Corp logo top right (as in the design) */}
                            <div className="flex flex-col md:flex-row md:items-start gap-x-md gap-y-xl">
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-md gap-y-xl flex-1">
                                {
                                    cols.map((col, colIndex) => {
                                        const isLast = colIndex === cols.length - 1;
                                        return (
                                            <div key={colIndex} className="flex flex-col items-start gap-y-sm md:gap-y-md min-w-0">
                                                {
                                                    col.map((item, index) => {
                                                        return (
                                                            <Button key={index} href={item.link || '#'} type="text" wrapUnderline dynamicIconColor={`var(--color-dark-purple)`}
                                                                outlineColor="after:bg-[var(--color-dark-purple)]!" textColor="text-dark-purple"
                                                                buttonClassName="mb-0 text-md! font-modern-era-medium max-w-fit !text-left text-dark-gray! "
                                                                style={underlinePurple}
                                                            >
                                                                {item.text}
                                                            </Button>
                                                        )
                                                    })
                                                }
                                                {/* social links (LinkedIn etc.) sit at the end of the last column */}
                                                {isLast && socialCta?.map((item, index) => {
                                                    return (
                                                        <Button isExternal={item?.isExternal} href={item?.link || "#"} key={`social-${index}`} icon={item.icon} type="text" wrapUnderline style={underlinePurple} dynamicIconColor={`var(--color-dark-purple)`} outlineColor="after:bg-[var(--color-dark-purple)]!" textColor="text-dark-purple"
                                                            buttonClassName="mb-0 !text-left text-md! font-modern-era-medium max-w-fit text-dark-gray! " iconClassName="h-lg! w-lg! md:h-md! md:w-md! xl:h-md! xl:w-md! shrink-0" >{item.text}</Button>
                                                    )
                                                })}
                                            </div>
                                        )
                                    })
                                }
                            </div>
                            <Image
                                src="/icons/bcorp.svg"
                                alt="Certified B Corporation"
                                width={137}
                                height={200}
                                className="hidden md:block md:h-[9vw] xl:h-[5.5vw] w-auto shrink-0 self-start md:ml-auto"
                            />
                            </div>

                            <div className=" border-t-[.1vw] border-dark-gray flex-1 flex flex-row flex-wrap gap-sm xl:flex-nowrap xl:gap-0 justify-between items-start md:items-center pt-sm">

                                {subMenu?.length && <div className="flex gap-x-sm flex-col sm:flex-row">
                                    {
                                        subMenu?.map((item, index) => {
                                            return (
                                                <Button key={index} href={item.link || '#'} type="text" dynamicIconColor={`var(--color-dark-purple)`}
                                                    outlineColor="after:bg-[var(--color-dark-purple)]!" textColor="text-dark-purple"
                                                    buttonClassName="mb-xs md:mb-0 text-md! font-modern-era-medium text-dark-gray! "
                                                >
                                                    <Small textSize="text-xs sm:text-sm xl:text-[.8vw]" className="text-inherit font-modern-era! whitespace-nowrap">
                                                        {item.text}
                                                    </Small>
                                                </Button>
                                            )
                                        })
                                    }
                                </div>}

                                {/* mobile: copyright and the B Corp logo share the last row; md+: copyright alone at the right, logo sits top right */}
                                <div className="w-full md:w-auto md:ml-auto flex items-center justify-between gap-sm pt-sm md:pt-0">
                                    <Small textSize="text-xs sm:text-sm xl:text-[.8vw]" className="text-dark-gray font-modern-era! whitespace-nowrap">
                                        © Kilburn & Strode LLP, {new Date().getFullYear()}
                                    </Small>
                                    <Image
                                        src="/icons/bcorp.svg"
                                        alt="Certified B Corporation"
                                        width={137}
                                        height={200}
                                        className="md:hidden h-[16vw] w-auto shrink-0"
                                    />
                                </div>
                            </div>
                        </div>

                    </div>
                    
                </div>
            </footer>
            {props?.logo && <div ref={footerLogoRef} className={`relative ${fixed ? 'relative' : 'md:fixed'} w-full md:pt-[0vw] left-0 right-0 -bottom-[100%] transition-all duration-800 ease-in-out bg-[#ffffff] px-sm md:px-xl pb-sm md:pb-[2vw]`}>
                <Image src={props?.logo} alt="" width={1200} height={600} className="w-full max-w-full object-contain object-bottom" />
            </div>}
        </>
    )

}

export default memo(FooterComponent)