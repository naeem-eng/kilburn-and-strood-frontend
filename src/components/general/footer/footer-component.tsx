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

          

            if (window.innerHeight < calculatedHegiht.current.getBoundingClientRect().height
                + footerLogoRef.current.getBoundingClientRect().height) {
                setFixed(true);
            } else {
                setFixed(false);
            }
        }
        window.addEventListener('resize', resize);
        resize();

        return () => {
            window.removeEventListener('resize', resize);
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


            if (scrollPos >= pageHeight - (window.innerHeight - rect.height)) {
                el.classList.add('-bottom-0!');
                if(footer) {
                    footer.style.opacity = '1';
                }
            } else {
                el.classList.remove('-bottom-0!');
                if(footer) {
                    footer.style.opacity = '0';
                }
            }
        }


        window.addEventListener('scroll', runReveal, { passive: true });

        // Initial run
        runReveal();

        return () => {
            window.removeEventListener('scroll', runReveal);
        };
    }, []);

    const cols = useMemo(() => {

        if (!footerMenu?.footerCta) return;

        const size = 5;
        const array = footerMenu?.footerCta || [];
        const result: any[][] = [];
        for (let i = 0; i < array.length; i += size) {
            result.push(array.slice(i, i + size));
        }

        return result;
    }, []);



    return (
        <>
            <footer
                data-animation={true}
                data-animation-component
                id="footer"
                className={`md:min-h-screen [body.tablet_&]:min-h-[70vh] [body.tablet_&]:h-[70vh] w-full md:pb-0 pb-xl bg-[#F8F8F8] opacity-0`}
                style={{
                    zIndex: 0
                }}>
                <div className={`${fixed ? 'relative' : 'md:fixed'} w-full top-0 [body.tablet_&]:top-[30vh] right-0 left-0  flex flex-col pt-3xl md:pt-[7vw] md:max-h-[70vh] md:[body.tablet_&]:min-h-[70vh]`}>
                    <div ref={calculatedHegiht} className="w-full px-sm md:px-xl  flex flex-row justify-start md:justify-between items-start flex-wrap">

                        <div className="w-1/2 md:flex-1 md:max-w-[40%] md:min-w-[40%] min-w-full mb-3xl md:mb-0">

                            <ReactMarkdown remarkPlugins={[remarkGfm, remarkBreak]}
                                components={{
                                    p: ({ children }) => <TitleSm>{children}</TitleSm>,
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

                        <div className="flex flex-col gap-y-xl md:flex-1 max-w-full md:max-w-1/2">
                            <div className="flex-1 flex flex-row justify-start items-start flex-wrap md:gap-x-xl gap-y-lg">
                                {/* column */}
                                {
                                    cols?.map((col, index) => {
                                        return (
                                            <div key={index} className="w-1/2 md:w-auto flex flex-col gap-y-sm md:gap-y-md md:max-w-[30%] pr-4 md:pr-0">
                                                {
                                                    col?.map((item, index) => {
                                                        return (
                                                            <Button key={index} href={item.link || '#'} type="text" dynamicIconColor={`var(--color-dark-purple)`}
                                                                outlineColor="after:bg-[var(--color-dark-purple)]!" textColor="text-dark-purple"
                                                                buttonClassName="mb-0 text-md! font-modern-era-medium text-dark-gray! "
                                                            >
                                                                {item.text}
                                                            </Button>
                                                        )
                                                    })
                                                }
                                            </div>
                                        )
                                    })
                                }


                                {/* column */}
                                {socialCta?.length && <div className="w-1/2 md:w-auto flex flex-col gap-y-md md:max-w-[30%] -mt-2 md:mt-0">
                                    {
                                        socialCta?.map((item, index) => {
                                            return (
                                                <Button isExternal={item?.isExternal} href={item?.link || "#"} key={index} icon={item.icon} type="text" dynamicIconColor={`var(--color-dark-purple)`} outlineColor="after:bg-[var(--color-dark-purple)]!" textColor="text-dark-purple"
                                                    buttonClassName="sm:mt-0 mb-xs !text-left text-md! font-modern-era-medium text-dark-gray! " iconClassName="h-lg! w-lg! md:h-md! md:w-md! xl:h-md! xl:w-md! shrink-0" >{item.text}</Button>
                                            )
                                        })
                                    }
                                </div>}
                                {/* column */}
                            </div>

                            <div className=" border-t-[.1vw] border-dark-gray flex-1 flex flex-row justify-between items-start md:items-center pt-sm">

                                {subMenu?.length && <div className="flex gap-x-sm flex-col sm:flex-row">
                                    {
                                        subMenu?.map((item, index) => {
                                            return (
                                                <Button key={index} href={item.link || '#'} type="text" dynamicIconColor={`var(--color-dark-purple)`}
                                                    outlineColor="after:bg-[var(--color-dark-purple)]!" textColor="text-dark-purple"
                                                    buttonClassName="mb-xs text-md! font-modern-era-medium text-dark-gray! "
                                                >
                                                    <Small className="text-inherit font-modern-era!">
                                                        {item.text}
                                                    </Small>
                                                </Button>
                                            )
                                        })
                                    }
                                </div>}

                                <Small className="text-dark-gray font-modern-era! text-[2vw] md:text-[.8vw] ">
                                    © Kilburn & Strode LLP, {new Date().getFullYear()}
                                </Small>
                            </div>
                        </div>

                    </div>
                    
                </div>
            </footer>
            {props?.logo && <div ref={footerLogoRef} className={`relative ${fixed ? 'relative' : 'md:fixed'} w-full md:pt-[0vw] left-0 right-0 -bottom-[100%] transition-all duration-800 ease-in-out bg-[#F8F8F8]`}>
                <Image src={props?.logo} alt="Image 1" width={1200} height={600} className="w-full max-w-full object-contain object-bottom" />
            </div>}
        </>
    )

}

export default memo(FooterComponent)