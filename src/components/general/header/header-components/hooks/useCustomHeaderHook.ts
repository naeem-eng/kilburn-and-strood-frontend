
"use client";
import { MenuRequestProps } from "@/parsers/global-parser/menu/menu-parser.types";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";


interface CustomHeaderProps {
    menu: MenuRequestProps[];
}

const useCustomHeaderHook = (props: CustomHeaderProps) => {
    const { menu } = props;
    const pathname = usePathname();

    const [scrolledDown, setScrolledDown] = useState(false);
    const lastScrollY = useRef(0);


    const sortedMenu = [...menu].sort((a: MenuRequestProps, b: MenuRequestProps) => (a?.menuOrderHeader || 0) - (b?.menuOrderHeader || 0));
    const topHeaderMenu = sortedMenu.filter((v: MenuRequestProps, index: number) => v.menuPosition === "top");
    const bottomHeaderMenu = sortedMenu.filter((v: MenuRequestProps, index: number) => v.menuPosition === "bottom");

    const headerRef = useRef<HTMLDivElement>(null);
    const dropdownMenuRef = useRef<HTMLButtonElement[]>([]);
    const mobileMenuRef = useRef<HTMLButtonElement[]>([]);

    const getLiveElements = (elements: Array<HTMLButtonElement | null | undefined>) => {
        if (typeof document === 'undefined') return [] as HTMLButtonElement[];
        return Array.from(new Set(elements.filter((item): item is HTMLButtonElement => Boolean(item && document.contains(item)))));
    };

   


    useEffect(() => {
        const THRESHOLD = 2;
        const UP_DELAY = 400; // ms delay when scrolling up
        let upTimeout: NodeJS.Timeout | null = null;

        const onScroll = () => {
            const currentScrollY = window.scrollY;
            const hasActiveMenu = dropdownMenuRef.current.some((item) => item?.classList.contains('activateDropper'));
            if (hasActiveMenu) {
                resetAllMenus(null);
            }

            if (currentScrollY > lastScrollY.current + THRESHOLD) {
                if (upTimeout) {
                    clearTimeout(upTimeout);
                    upTimeout = null;
                }
                setScrolledDown(true);
            } else if (currentScrollY < lastScrollY.current - THRESHOLD) {
                if (!upTimeout) {
                    upTimeout = setTimeout(() => {
                        setScrolledDown(false);
                        upTimeout = null;
                    }, UP_DELAY);
                }
            }

            lastScrollY.current = currentScrollY;
        };

        if (window.innerWidth > 768) {
            window.addEventListener("scroll", onScroll, { passive: true });
        };

        return () => {
            if (window.innerWidth > 768) {
                window.removeEventListener("scroll", onScroll);
            }
            if (upTimeout) clearTimeout(upTimeout);
        };
    }, []);


    useEffect(() => {
    const observer = new MutationObserver(() => {
        const el = document.getElementById('lockScrollbar')!;
        if (document.body.classList.contains('blur-background')) {
            document.getElementsByTagName('body')[0].style.overflow = 'hidden';
            // el.style.scrollbarGutter = 'stable';
        } else {
            document.getElementsByTagName('body')[0].style.overflow = '';
            // el.style.scrollbarGutter = '';
        }
    });

    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
}, []);





    useEffect(() => {
        if (!dropdownMenuRef?.current) return;
        const menuHover = getLiveElements(dropdownMenuRef.current);
        dropdownMenuRef.current = menuHover;

        const handleMouseClicked = (e: Event) => {
            e.stopPropagation();
            // // //console.log("reset")

            // menuHover.forEach((item) => { 
            //     if(!item) return;
            //     const panelNextEl = item?.nextElementSibling as HTMLElement;
            //     if(item?.hasAttribute("data-secondlevel-slide")) {
            //         slideOffSecondLevelPanel(panelNextEl);  
            //     }
            //     item?.classList.remove('activateDropper');
            // });

            const el = e.currentTarget as HTMLElement;
            if (!el) return;
            const panelEl = el?.nextElementSibling as HTMLElement;


            if (!el.classList.contains("activateDropper")) {
                resetAllMenus(el);
            }

            if (!panelEl) return;

            el.classList.toggle('activateDropper');

            if (el.hasAttribute("data-dropdown")) {
                if (el.classList.contains("activateDropper")) {
                    openPanel(panelEl);
                } else {
                    closePanel(panelEl);
                }
            }

            if (el.hasAttribute("data-slide")) {
                if (el.classList.contains("activateDropper")) {
                    slideOnPanel(panelEl);
                } else {
                    slideOffPanel(panelEl);
                }
            }

                   


            if (el.hasAttribute("data-secondlevel-slide")) {
                if (el.classList.contains("activateDropper")) {
                    slideOnSecondLevelPanel(panelEl);
                    panelEl.scrollTop = 0; 
                } else {
                    panelEl.scrollTop = 0; 
                    slideOffSecondLevelPanel(panelEl);
                }
            }

            if (el.hasAttribute("data-search-slide")) {
                if (el.classList.contains("activateDropper")) {
                    openSearchContainer(panelEl);
                } else {
                    closeSearchContainer(panelEl);
                }
            }

            updateBodyBlur();

        };

        menuHover.forEach((item) => {
            item?.addEventListener('click', handleMouseClicked);
        });

        return () => {
            menuHover.forEach((item) => {
                item?.removeEventListener('click', handleMouseClicked);
            });
        };
    }, [pathname]);


    useEffect(() => {
        const reset = (e: Event) => {
            // if (!headerRef.current) return;
            // if (!headerRef.current.contains(e.target as Node)) {
            //     resetAllMenus(null);
            // }
            resetAllMenus(null);
        }

        resetAllMenus(null);
        window.addEventListener('click', reset);

        const stopPropagation = (e: Event) => {
            e.stopPropagation();
        }
        const dropdownMenuContainer = getLiveElements(dropdownMenuRef.current);
        dropdownMenuRef.current = dropdownMenuContainer;
        if (!dropdownMenuContainer) return;

        dropdownMenuContainer.forEach((item) => {
            if (!item) return
            const dropdownPanel = item?.querySelectorAll('.dropdownPanel');
            dropdownPanel.forEach((itemX) => {
                itemX.addEventListener('click', stopPropagation);
            });
        });

        return () => {
            window.removeEventListener('click', reset);
            dropdownMenuContainer.forEach((item) => {
                if (!item) return;
                const dropdownPanel = item?.querySelectorAll('.dropdownPanel');
                dropdownPanel.forEach((itemX) => {
                    itemX.removeEventListener('click', stopPropagation);
                });
            });
        };
    }, [headerRef, pathname]);


    useEffect(() => {
        if (!mobileMenuRef?.current) return;
        const menuHover = getLiveElements(mobileMenuRef.current);
        mobileMenuRef.current = menuHover;

        menuHover.forEach((item) => {
            item?.addEventListener('click', onClickMobile);
        });

        return () => {
            menuHover.forEach((item) => {
                item?.removeEventListener('click', onClickMobile);
            });
        };
    }, [mobileMenuRef, pathname]);


    const updateBodyBlur = () => {
        const menus = dropdownMenuRef.current;
        const anyActive = menus.length > 0 && menus.some((item) =>
            item?.classList.contains("activateDropper")
        );
        if (anyActive) {
            window.document.body.classList.add("blur-background");
        } else {
            window.document.body.classList.remove("blur-background");
        }
    };


    const openPanel = (panel: HTMLElement) => {
        panel.style.height = "auto";
        const fullHeight = panel?.scrollHeight + "px";
        panel.style.height = "0px";
        panel.style.pointerEvents = 'auto';
        panel.offsetHeight;
        panel.style.height = fullHeight;
        panel.addEventListener(
            "transitionend",
            () => {
                panel.style.height = "auto";
            },
            { once: true }
        );
    };

    const closePanel = (panel: HTMLElement) => {
        if (!panel) return;
        const fullHeight = panel?.scrollHeight + "px";
        panel.style.height = fullHeight;
        panel.style.pointerEvents = 'none';
        panel.offsetHeight;
        panel.style.height = "0px";
    };


    const slideOnPanel = (panel: HTMLElement) => {
        panel.style.height = "auto";
        const fullHeight = panel?.scrollHeight + "px";
        panel.style.height = "0px";
        panel.style.opacity = '100';
        panel.style.pointerEvents = 'auto';
        panel.offsetHeight;
        panel.style.height = fullHeight;
        panel.addEventListener(
            "transitionend",
            () => {
                panel.style.height = "auto";
            },
            { once: true }
        );
    };

    const slideOffPanel = (panel: HTMLElement) => {
        if (!panel) return;
        const fullHeight = panel?.scrollHeight + "px";
        panel.style.height = fullHeight;
        panel.style.opacity = '0';
        panel.style.pointerEvents = 'none';
        panel.offsetHeight;
        panel.style.height = "0px";
    };

    const slideOnSecondLevelPanel = (panel: HTMLElement) => {
        if (!panel) return;

        const megaMenu = panel.closest('.isMegaMenu') as HTMLElement;
        if (megaMenu) {
            const panelScrollHeight = panel.scrollHeight;
            if (panelScrollHeight > megaMenu.offsetHeight) {
                const spaceXl = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--space-xl')) || 48;
                megaMenu.style.height = (panelScrollHeight + spaceXl) + 'px';
            }
        }

        panel.style.transform = "translateX(0%)";
        panel.style.opacity = '100'
        panel.addEventListener(
            "transitionend",
            () => {
                panel.style.transform = "translateX(0px)";
            },
            { once: true }
        );
    };

    const slideOffSecondLevelPanel = (panel: HTMLElement) => {
        if (!panel) return;

        const megaMenu = panel.closest('.isMegaMenu') as HTMLElement;
        if (megaMenu) {
            megaMenu.style.height = 'auto';
        }

        const getWidth = panel?.getBoundingClientRect().width;
        panel.style.transform = `translateX(${getWidth}px)`;
    };

    const openSearchContainer = (panel: any) => {
        if (!panel) return;
        panel.classList.add("active-search-container");
        const layers = panel?.querySelectorAll("[data-layer]");
        let delay = 0;
        layers.forEach((layer: HTMLElement) => {
            setTimeout(() => {
                layer.classList.add("layer-active");
            }, delay);
            delay += 100;
        })

        setTimeout(() => {
            const input = panel.querySelector("#onFocusTrigger") as HTMLInputElement;
            if (input) {
                input.value = "";
                input.focus();
            }
        }, delay); 

        panel.addEventListener(
            "transitionend",
            () => {
                panel.classList.add("active-search-container");
            },
            { once: true }
        );

    }

    const closeSearchContainer = (panel: any) => {
        const layers = panel?.querySelectorAll("[data-layer]");
        let delay = 0;
        layers.forEach((layer: HTMLElement) => {
            layer.classList.remove("layer-active");
        })

        setTimeout(() => {
            panel.classList.remove("active-search-container");
        }, 300);

        panel.addEventListener(
            "transitionend",
            () => {
                panel.classList.remove("active-search-container");
            },
            { once: true }
        );
    }

    const resetAllMenus = (e: HTMLElement | null) => {
        if (!dropdownMenuRef?.current) return;
        const menuHover = dropdownMenuRef?.current
        menuHover?.forEach((item) => {
            if (!item) return;
            const panelEl = item?.nextElementSibling as HTMLElement;
            if (item.hasAttribute("data-dropdown") && !e?.hasAttribute("data-secondlevel-slide")) {
                closePanel(panelEl);
            }
            if (item.hasAttribute("data-slide") && !e?.hasAttribute("data-secondlevel-slide")) {
                slideOffPanel(panelEl);
            }
            if (item.hasAttribute("data-secondlevel-slide")) {
                slideOffSecondLevelPanel(panelEl);
            }

            if (item.hasAttribute("data-search-slide") && !e?.hasAttribute("data-search-slide")) {
                closeSearchContainer(panelEl);
            }

            item.classList.remove('activateDropper');
        });
        updateBodyBlur();
    }

    const resetAllMobileMenus = (e:any) => {
        if(!mobileMenuRef?.current) return;
        const menuHover = mobileMenuRef.current;
        setTimeout(() => {
            menuHover?.forEach((el: HTMLElement) => {
                if (!el) return;
                el.classList.remove('activateDropper');
                const panelEl = el?.nextElementSibling as HTMLElement;
                if (!panelEl) return;
                panelEl.classList.remove('mobilePanel');
            });
        }, 500) 
    }




    const onClickMobile = (e: any) => {
        e.stopPropagation();
        const el = e.currentTarget as HTMLElement;
        if (!el) return;

        if (el.hasAttribute('data-mobile-second-level')) {
            const menuHover = mobileMenuRef.current;
            const currentParentPanel = el.closest('.mobilePanel');

            // Only one sub-submenu open at a time in the same parent mobile panel.
            menuHover?.forEach((menuEl: HTMLElement) => {
                if (!menuEl || menuEl === el) return;
                if (!menuEl.hasAttribute('data-mobile-second-level')) return;
                if (currentParentPanel && menuEl.closest('.mobilePanel') !== currentParentPanel) return;

                menuEl.classList.remove('activateDropper');
                const siblingPanel = menuEl.nextElementSibling as HTMLElement;
                if (!siblingPanel) return;
                siblingPanel.classList.remove('mobilePanel');
            });

            
        }

        el.classList.toggle('activateDropper');
        const panelEl = el?.nextElementSibling as HTMLElement;
       
        if (!panelEl) return;
        panelEl.classList.toggle('mobilePanel');
        if(el.classList.contains('mobileSearchContainer')) {
            const input = panelEl.querySelector("#onFocusMobileTrigger") as HTMLInputElement;
            if(input) {
                setTimeout(() => {
                    if (input) {
                        input.value = "";
                        input.focus();
                    }
                }, 500); 
            }
        }
        
    }


    useEffect(() => {
        if (!mobileMenuRef?.current) return;
        const onWindowClick = (e: any) => {
            setTimeout(() => {
                const menuHover = mobileMenuRef.current;
                menuHover?.forEach((el: HTMLElement) => {
                    if (!el) return;
                    el.classList.remove('activateDropper');
                    const panelEl = el?.nextElementSibling as HTMLElement;
                    if (!panelEl) return;
                    panelEl.classList.remove('mobilePanel');
                });
            }, 500) 
        }
        window.addEventListener('click', onWindowClick);

        return () => {
            window.removeEventListener('click', onWindowClick);
        };
    }, [mobileMenuRef, pathname]);

    const onClickMobileReset = (e: any) => {
        e?.stopPropagation();

        if (!mobileMenuRef?.current) return;
        const menuHover = mobileMenuRef.current;

        menuHover?.forEach((el: HTMLElement) => {
            if (!el) return;
            if (!el.closest('.mobileMenuContainer')) return
            const panelEl = el?.nextElementSibling as HTMLElement;
            if (!panelEl) return;
            panelEl.classList.remove('mobilePanel');
        });
    }




    return {
        onClickMobileReset,
        mobileMenuRef,
        dropdownMenuRef,
        headerRef,
        bottomHeaderMenu,
        topHeaderMenu,
        scrolledDown,
        setScrolledDown,
        resetAllMobileMenus
    }
}

export default useCustomHeaderHook;