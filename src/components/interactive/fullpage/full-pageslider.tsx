"use client"

import React, { createContext, forwardRef, useContext, useEffect, useImperativeHandle, useLayoutEffect, useRef } from "react";
import gsap from 'gsap';
import { usePathname, useRouter } from "next/navigation";
// @ts-ignore
import { Observer } from "gsap/Observer";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollSmoother } from "gsap/ScrollSmoother"


gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, ScrollSmoother, Observer);

type FullPageSliderProps = {
  children: React.ReactNode;
  className?: string;
  interactive?: boolean;
};

export type FullPageSliderRef = {
  kill: () => void;
  reinit: () => void;
};

export const FullPageSliderContext = createContext<{ reinit: () => void } | null>(null);

const PENDING_ENTER_ATTR = "data-fullpage-enter-pending";
const ROUTE_EXIT_STAGGER = 0.03;
const ROUTE_ENTER_STAGGER = 0.05;
const ROUTE_ENTER_BASE_DELAY = 0.2;

function FullPageSliderInner({ children, className, interactive }: FullPageSliderProps, ref: React.ForwardedRef<FullPageSliderRef>) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const scrollRef = useRef(null);
  const cleanupRef = useRef<(() => void) | null>(null);
  const currentIndexRef = useRef(0);
  const handlersRef = useRef<HTMLElement[]>([]);
  const sectionsRef = useRef<HTMLElement[]>([]);
  const isNavigatingRef = useRef(false);
  const previousPathnameRef = useRef<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();

  const scrollToTargetRef = useRef<((target: string | HTMLElement) => void) | null>(null);
  
  const items = React.Children.toArray(children);

  const parseAnimationVars = React.useCallback((element: HTMLElement, attribute: string): gsap.TweenVars | null => {
    const value = element.getAttribute(attribute);
    if (!value) return null;

    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }, []);

  const getSlideWrappers = React.useCallback(() => {
    if (!containerRef.current) return [] as HTMLElement[];
    return Array.from(containerRef.current.querySelectorAll<HTMLElement>("[data-fullpage-slide]"));
  }, []);

  const getActiveAnimationComponent = React.useCallback(() => {
    const handlers = handlersRef.current;
    if (!handlers.length) return null;

    const activeIndex = gsap.utils.clamp(0, handlers.length - 1, currentIndexRef.current);
    return handlers[activeIndex] || null;
  }, []);

  const shouldUseFallbackRouteTransition = React.useCallback(() => {
    if (typeof window === "undefined") return !interactive;
    return !interactive || window.innerWidth < 1280;
  }, [interactive]);

  const resetRouteTransitionStyles = React.useCallback((slide: HTMLElement, atoms: HTMLElement[] = []) => {
    gsap.set(slide, { clearProps: "transform,opacity,willChange" });
    if (atoms.length) {
      gsap.set(atoms, { clearProps: "transform,opacity,willChange" });
    }
  }, []);

  const playPageExitTransition = React.useCallback(() => {
    if (shouldUseFallbackRouteTransition() && containerRef.current) {
      const pageTarget = containerRef.current;
      const pageTravel = Math.max(96, Math.round(window.innerHeight * 0.35));
      const earlyResolveProgress = 0.62;
      const slides = sectionsRef.current.length ? sectionsRef.current : getSlideWrappers();
      const firstSlide = slides[0] || null;
      const topAtoms = firstSlide
        ? Array.from(firstSlide.querySelectorAll<HTMLElement>("[data-animation-atoms]"))
        : [];

      if (topAtoms.length) {
        gsap.killTweensOf(topAtoms);
        const topOutTl = gsap.timeline({
          defaults: {
            duration: 0.8,
            ease: "power3.inOut",
            overwrite: "auto",
          },
          onComplete: () => {
            gsap.set(topAtoms, { clearProps: "willChange" });
          },
          onInterrupt: () => {
            gsap.set(topAtoms, { clearProps: "willChange" });
          },
        });

        topAtoms.forEach((atom, index) => {
          const toVars = parseAnimationVars(atom, "data-to") || { y: -40, autoAlpha: 0 };
          topOutTl.to(atom, toVars, index * ROUTE_EXIT_STAGGER);
        });
      }

      return new Promise<void>((resolve) => {
        let resolvedEarly = false;
        gsap.killTweensOf(pageTarget);
        gsap.set(pageTarget, { willChange: "transform,opacity" });
        gsap.to(pageTarget, {
          autoAlpha: 0,
          y: -pageTravel,
          duration: 0.8,
          ease: "power3.inOut",
          overwrite: "auto",
          onUpdate: function () {
            if (!resolvedEarly && this.progress() >= earlyResolveProgress) {
              resolvedEarly = true;
              resolve();
            }
          },
          onComplete: () => {
            resetRouteTransitionStyles(pageTarget);
            if (!resolvedEarly) {
              resolvedEarly = true;
              resolve();
            }
          },
          onInterrupt: () => {
            resetRouteTransitionStyles(pageTarget);
            if (!resolvedEarly) {
              resolvedEarly = true;
              resolve();
            }
          },
        });
      });
    }

    const activeComponent = getActiveAnimationComponent();
    const isFooterActive = activeComponent?.tagName.toLowerCase() === "footer";

    if (interactive && isFooterActive && containerRef.current) {
      const pageTarget = containerRef.current;
      const earlyResolveProgress = 0.55;

      return new Promise<void>((resolve) => {
        let resolvedEarly = false;
        gsap.killTweensOf(window);
        gsap.killTweensOf(pageTarget);
        gsap.set(pageTarget, { willChange: "opacity" });

        const timeline = gsap.timeline({
          defaults: {
            duration: 0.9,
            ease: "power3.inOut",
            overwrite: "auto",
          },
          onUpdate: function () {
            if (!resolvedEarly && this.progress() >= earlyResolveProgress) {
              resolvedEarly = true;
              resolve();
            }
          },
          onComplete: () => {
            resetRouteTransitionStyles(pageTarget);
            if (!resolvedEarly) {
              resolvedEarly = true;
              resolve();
            }
          },
          onInterrupt: () => {
            resetRouteTransitionStyles(pageTarget);
            if (!resolvedEarly) {
              resolvedEarly = true;
              resolve();
            }
          },
        });

        // Reverse the footer reveal by scrolling the page back up before route navigation completes.
        timeline.to(window, { scrollTo: { y: 0, offsetY: 0 } }, 0);
        timeline.to(pageTarget, { autoAlpha: 0, duration: 0.45, ease: "power1.out" }, 0.18);
      });
    }

    const slides = sectionsRef.current.length ? sectionsRef.current : getSlideWrappers();
    if (!slides.length) return Promise.resolve();

    const activeIndex = gsap.utils.clamp(0, slides.length - 1, currentIndexRef.current);
    const activeSlide = slides[activeIndex] || slides[0];
    const atoms = Array.from(activeSlide.querySelectorAll<HTMLElement>("[data-animation-atoms]"));
    const sectionTravel = Math.max(56, Math.round(window.innerHeight * 0.5));
    const earlyResolveProgress = 0.62;

    if (!atoms.length) {
      return new Promise<void>((resolve) => {
        let resolvedEarly = false;
        gsap.killTweensOf(activeSlide);
        gsap.to(activeSlide, {
          autoAlpha: 0,
          y: -sectionTravel,
          duration: 0.9,
          ease: "power3.inOut",
          overwrite: "auto",
          clearProps: "transform,opacity",
          onUpdate: function () {
            if (!resolvedEarly && this.progress() >= earlyResolveProgress) {
              resolvedEarly = true;
              resolve();
            }
          },
          onComplete: () => {
            resetRouteTransitionStyles(activeSlide);
            if (!resolvedEarly) {
              resolvedEarly = true;
              resolve();
            }
          },
          onInterrupt: () => {
            resetRouteTransitionStyles(activeSlide);
            if (!resolvedEarly) {
              resolvedEarly = true;
              resolve();
            }
          },
        });
      });
    }

    return new Promise<void>((resolve) => {
      let resolvedEarly = false;
      gsap.killTweensOf(activeSlide);
      gsap.set(activeSlide, { willChange: "transform,opacity" });

      const timeline = gsap.timeline({
        defaults: {
          duration: 0.9,
          ease: "power3.inOut",
          overwrite: "auto",
        },
        onUpdate: function () {
          if (!resolvedEarly && this.progress() >= earlyResolveProgress) {
            resolvedEarly = true;
            resolve();
          }
        },
        onComplete: () => {
          resetRouteTransitionStyles(activeSlide, atoms);
          ScrollTrigger.refresh();
          if (!resolvedEarly) {
            resolvedEarly = true;
            resolve();
          }
        },
        onInterrupt: () => {
          resetRouteTransitionStyles(activeSlide, atoms);
          ScrollTrigger.refresh();
          if (!resolvedEarly) {
            resolvedEarly = true;
            resolve();
          }
        },
      });

      // Move the full slide wrapper so route changes feel like fullpage section transitions.
      timeline.to(activeSlide, { y: -sectionTravel }, 0);
      timeline.to(activeSlide, { autoAlpha: 0, duration: 0.6, delay: 0.4, ease: "power1.inout" }, 0);

      atoms.forEach((atom, index) => {
        const toVars = parseAnimationVars(atom, "data-to") || { y: -40 };
        timeline.to(atom, { ...toVars, autoAlpha: 0 }, index * ROUTE_EXIT_STAGGER);
      });
    });
  }, [getActiveAnimationComponent, getSlideWrappers, interactive, parseAnimationVars, resetRouteTransitionStyles, shouldUseFallbackRouteTransition]);

  const playPageEnterTransition = React.useCallback(() => {
    if (shouldUseFallbackRouteTransition() && containerRef.current) {
      const pageTarget = containerRef.current;
      const pageTravel = Math.max(96, Math.round(window.innerHeight * 0.35));
      const slides = sectionsRef.current.length ? sectionsRef.current : getSlideWrappers();
      const firstSlide = slides[0] || null;
      const topAtoms = firstSlide
        ? Array.from(firstSlide.querySelectorAll<HTMLElement>("[data-animation-atoms]"))
        : [];

      gsap.killTweensOf(pageTarget);
      gsap.fromTo(
        pageTarget,
        { autoAlpha: 0, y: pageTravel, willChange: "transform,opacity" },
        {
          autoAlpha: 1,
          y: 0,
          duration: 0.9,
          ease: "power3.out",
          overwrite: "auto",
          onComplete: () => {
            resetRouteTransitionStyles(pageTarget);
          },
          onInterrupt: () => {
            resetRouteTransitionStyles(pageTarget);
          },
        }
      );

      if (topAtoms.length) {
        gsap.killTweensOf(topAtoms);
        gsap.set(topAtoms, { autoAlpha: 0, willChange: "transform,opacity" });

        const topTl = gsap.timeline({
          defaults: {
            duration:1,
            ease: "power3.out",
            overwrite: "auto",
          },
          onComplete: () => {
            gsap.set(topAtoms, { clearProps: "willChange" });
          },
          onInterrupt: () => {
            gsap.set(topAtoms, { clearProps: "willChange" });
          },
        });

        topAtoms.forEach((atom, index) => {
          const fromVars = parseAnimationVars(atom, "data-from") || { y: 40 };
          const normalizedFromVars: gsap.TweenVars = { ...fromVars };
          if (typeof normalizedFromVars.y === "number") {
            normalizedFromVars.y = Math.abs(normalizedFromVars.y);
          } else if (typeof normalizedFromVars.y === "string") {
            const trimmedY = normalizedFromVars.y.trim();
            if (trimmedY.startsWith("-")) {
              normalizedFromVars.y = trimmedY.replace(/^-+/, "");
            }
          }

          const middleVars = parseAnimationVars(atom, "data-middle") || { y: 0 };
          const duration = Number(middleVars.duration) || 0.6;
          const ease = typeof middleVars.ease === "string" ? middleVars.ease : "power3.out";

          topTl.fromTo(
            atom,
            { ...normalizedFromVars, autoAlpha: 0, immediateRender: true },
            {
              ...middleVars,
              autoAlpha: 1,
              duration,
              ease,
            },
            ROUTE_ENTER_BASE_DELAY + index * ROUTE_ENTER_STAGGER
          );
        });
      }

      return;
    }

    const slides = sectionsRef.current.length ? sectionsRef.current : getSlideWrappers();
    const firstSlide = slides[0];
    if (!firstSlide) return;
    const sectionTravel = Math.max(56, Math.round(window.innerHeight * 0.3));

    const atoms = Array.from(firstSlide.querySelectorAll<HTMLElement>("[data-animation-atoms]"));
    if (!atoms.length) {
      gsap.killTweensOf(firstSlide);
      gsap.fromTo(
        firstSlide,
        { autoAlpha: 0, y: sectionTravel },
        {
          autoAlpha: 1,
          y: 0,
          duration: 1,
          ease: "power3.out",
          overwrite: "auto",
          clearProps: "transform,opacity",
          onComplete: () => {
            resetRouteTransitionStyles(firstSlide);
            ScrollTrigger.refresh();
          },
          onInterrupt: () => {
            resetRouteTransitionStyles(firstSlide);
            ScrollTrigger.refresh();
          },
        }
      );
      return;
    }

    gsap.killTweensOf(firstSlide);
    gsap.set(firstSlide, { y: sectionTravel, autoAlpha: 0, willChange: "transform,opacity" });
    // No killTweensOf(atoms) or overwrite — would destroy the scroll-scrub's out-animation tweens.
    gsap.set(atoms, { autoAlpha: 0, willChange: "transform,opacity", overwrite: false });

    const tl = gsap.timeline({
      defaults: {
        duration: 1,
        ease: "power2.out",
      },
      onComplete: () => {
        resetRouteTransitionStyles(firstSlide, atoms);
        ScrollTrigger.refresh();
      },
      onInterrupt: () => {
        resetRouteTransitionStyles(firstSlide, atoms);
        ScrollTrigger.refresh();
      },
    });

    // overwrite: "auto" is safe — firstSlide has no scrub tweens.
    tl.to(firstSlide, { y: 0, autoAlpha: 1, duration: 0.65, ease: "power3.out", overwrite: "auto" }, 0);

    atoms.forEach((atom, index) => {
      const fromVars = parseAnimationVars(atom, "data-from") || { y: 40 };
      const normalizedFromVars: gsap.TweenVars = { ...fromVars };

      // Route enter should always travel bottom -> top, even if data-from has a negative y.
      if (typeof normalizedFromVars.y === "number") {
        normalizedFromVars.y = Math.abs(normalizedFromVars.y);
      } else if (typeof normalizedFromVars.y === "string") {
        const trimmedY = normalizedFromVars.y.trim();
        if (trimmedY.startsWith("-")) {
          normalizedFromVars.y = trimmedY.replace(/^-+/, "");
        }
      }

      const middleVars = parseAnimationVars(atom, "data-middle") || { y: 0 };
      const duration = Number(middleVars.duration) || 0.6;
      const ease = typeof middleVars.ease === "string" ? middleVars.ease : "power3.out";

      tl.fromTo(
        atom,
        { ...normalizedFromVars, autoAlpha: 0, immediateRender: true },
        {
          ...middleVars,
          autoAlpha: 1,
          duration,
          ease,
        },
        index * ROUTE_ENTER_STAGGER
      );
    });
  }, [getSlideWrappers, parseAnimationVars, resetRouteTransitionStyles, shouldUseFallbackRouteTransition]);

  function init(isReinit = false) {
    if (!containerRef?.current) return () => { };

    const scopedComponents = Array.from(containerRef.current.querySelectorAll<HTMLElement>('[data-animation-component]')) as HTMLElement[];
    const footerComponent = document.querySelector<HTMLElement>('footer[data-animation-component]');
    const components = Array.from(new Set([
      ...scopedComponents,
      ...(footerComponent ? [footerComponent] : []),
    ])).sort((a, b) => a.offsetTop - b.offsetTop);

    let currentIndex = 0;
    let animating = false;
    let activeScrollTween: gsap.core.Tween | null = null;
    const mm = gsap.matchMedia();
    const createdScrollTriggers: Array<ReturnType<typeof ScrollTrigger.create>> = [];

    const createTrackedScrollTrigger = (vars: ScrollTrigger.Vars) => {
      const st = ScrollTrigger.create(vars);
      createdScrollTriggers.push(st);
      return st;
    };

    const handlers = components
      .map((child: HTMLElement) => {
        if (!child) return null
        const props = child.attributes
        const hasAnimation =
          props?.getNamedItem('data-animation')?.value == 'true' ||
          props?.getNamedItem('data-light-animation')?.value == 'true'

        return hasAnimation ? child : null
      })
      .filter(Boolean);

    handlersRef.current = handlers as HTMLElement[];
    const slideWrappers = getSlideWrappers();
    slideWrappers.forEach((slide) => resetRouteTransitionStyles(slide));
    sectionsRef.current = slideWrappers.length ? slideWrappers : components;


    // // //console.log({ handlers, components })

    const getMaxScrollY = () => Math.max(0, document.documentElement.scrollHeight - window.innerHeight);

    const getSectionAnchorY = (section: HTMLElement) => {
      if (components[0] === section) return 0;

      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const viewportHeight = window.innerHeight;

      // Full/tall sections keep top anchoring; shorter sections anchor their bottom.
      const targetY = sectionHeight >= viewportHeight
        ? sectionTop
        : sectionTop + sectionHeight - viewportHeight;

      return gsap.utils.clamp(0, getMaxScrollY(), targetY);
    };

    const getSectionSnapPoints = () => {
      const maxScrollY = getMaxScrollY();

      if (maxScrollY <= 0) {
        return [0];
      }

      const rawPoints = components.map((section) => getSectionAnchorY(section) / maxScrollY);
      const normalized = rawPoints.map((point) => gsap.utils.clamp(0, 1, point));
      const dedupedSorted = Array.from(new Set([0, ...normalized])).sort((a, b) => a - b);

      return dedupedSorted;
    };

    // Main scroll snapping
    if (interactive) {
      mm.add('(min-width: 1280px)', () => {
        createTrackedScrollTrigger({
          trigger: containerRef.current,
          start: "top top",
          end: () => "+=" + getMaxScrollY(),
          scrub: 2,
          snap: {
            snapTo: (value: number) => {
              const snapPoints = getSectionSnapPoints();
              return gsap.utils.snap(snapPoints, value);
            },
            duration: 0.8,
            delay: 0,
            ease: "power3.inOut",
            directional: false
          }
        });
      });
    }


    const getClosestSectionIndex = () => {
      if (!components.length) return 0;

      const currentY = window.scrollY;
      let closestIndex = 0;
      let closestDistance = Number.POSITIVE_INFINITY;

      components.forEach((section, index) => {
        const distance = Math.abs(getSectionAnchorY(section) - currentY);
        if (distance < closestDistance) {
          closestDistance = distance;
          closestIndex = index;
        }
      });

      return closestIndex;
    };

    // Track last-known cursor position for synthetic mousemove during scroll
    let lastCursorX = 0;
    let lastCursorY = 0;
    let cursorToggle = false;
    const trackCursor = (e: MouseEvent) => {
      lastCursorX = e.clientX;
      lastCursorY = e.clientY;
    };
    document.addEventListener("mousemove", trackCursor, { passive: true, capture: true });

    // Nudge cursor 1px left/right so ImageReveal's mousemove handler fires during scroll
    const nudgeCursor = () => {
      cursorToggle = !cursorToggle;
      const offsetX = cursorToggle ? 1 : -1;
      document.dispatchEvent(
        new MouseEvent("mousemove", {
          clientX: lastCursorX + offsetX,
          clientY: lastCursorY,
          bubbles: true,
        })
      );
    };

    // 🧠 Helper: scroll to specific section
    function gotoSection(index: number, _direction: number) {
      const earlyUnlockProgress = 0.82;
      let unlockedEarly = false;

      if (animating) return;
      index = gsap.utils.clamp(0, components.length - 1, index);
      currentIndex = index;
      const targetY = index === 0 ? 0 : getSectionAnchorY(components[index]);

      // Avoid creating no-op tweens that can cause tiny top-offset drift.
      if (Math.abs(window.scrollY - targetY) < 1) {
        animating = false;
        return;
      }

      animating = true;
      activeScrollTween?.kill();
      activeScrollTween = gsap.to(window, {
        scrollTo: { y: targetY, offsetY: 0 },
        duration: 1.5,
        ease: "power3.inOut",
        onUpdate: function () {
          // Synthetic mousemove so ImageReveal tracks cursor during scroll
          nudgeCursor();
          if (!unlockedEarly && this.progress() >= earlyUnlockProgress) {
            animating = false;
            unlockedEarly = true;
          }
        },
        onComplete: () => {
          animating = false;
          // One final nudge after scroll finishes
          nudgeCursor();
        },
      });
    }

    // Smooth scroll to an element by id (used by data-scroll-to and #hash links)
    const scrollToTarget = (target: string | HTMLElement) => {
      const el = typeof target === "string"
        ? document.getElementById(decodeURIComponent(target.replace(/^#/, "")))
        : target;
      if (!el) return;

      const isDesktopFullpage = interactive && window.innerWidth >= 1280;

      if (isDesktopFullpage) {
        const sectionIndex = components.findIndex(
          (section) => section === el || section.contains(el)
        );
        if (sectionIndex !== -1) {
          // A click should always win over an in-progress wheel scroll
          activeScrollTween?.kill();
          animating = false;
          gotoSection(sectionIndex, sectionIndex > currentIndex ? 1 : -1);
          return;
        }
      }

      // Mobile / non-interactive: normal smooth scroll, offset by the header
      const header = document.getElementById("header");
      activeScrollTween?.kill();
      activeScrollTween = gsap.to(window, {
        scrollTo: { y: el, offsetY: header?.offsetHeight ?? 0 },
        duration: 1.2,
        ease: "power3.inOut",
      });
    };
    scrollToTargetRef.current = scrollToTarget;

    
    if (interactive) {
      mm.add('(min-width: 1280px)', () => {
        gsap.set(handlers, {
          autoAlpha: 1
        })
      });
    }

    const createdTimelines: gsap.core.Timeline[] = [];
    let observer: Observer | null = null;
    mm.add('(min-width: 1280px)', () => {
      if (interactive) {
        observer = Observer.create({
          target: window,
          type: "wheel",
          ignore: ".dropdownPanel, .scrollable, [data-scroll-ignore]",
          wheelSpeed: -1,
          onDown: () => {
            if (animating) return;
            const index = getClosestSectionIndex();
            if (index <= 0) return;
            gotoSection(index - 1, -1)
          },
          onUp: () => {
            if (animating) return;
            const index = getClosestSectionIndex();
            if (index >= components.length - 1) return;
            gotoSection(index + 1, 1)
          },
          tolerance: 10,
          preventDefault: true,
        });
      }

      handlers.forEach((section: HTMLElement | null, index: number) => {
        if (!section) return;
        const sectionIndex = components.indexOf(section);
        const nextSection = sectionIndex >= 0 ? components[sectionIndex + 1] : null;
        const disableOutAnimation = Boolean(nextSection && nextSection.offsetHeight < window.innerHeight);
        // const belowSectionOffset = nextSection ? nextSection.offsetHeight : 0;
        // if (section.hasAttribute("data-primary-header")) {
        const elements = Array.from(
          section.querySelectorAll<HTMLElement>("[data-animation-atoms]")
        );
        // make sections visible with gsap so we don't see FOUC https://gsap.com/resources/fouc/

        // Slide wrapper as trigger avoids firstOffset misalignment on the first slide.
        const slideWrapper = section.closest<HTMLElement>('[data-fullpage-slide]') || section;

        createTrackedScrollTrigger({
          trigger: section,
          start: "top center",      // when section enters
          end: "bottom center",
          onEnter: () => {
            currentIndexRef.current = index;
          },
          onLeave: () => {
            // // //console.log("leave section", index);
            currentIndex = Math.min(index + 1, components.length - 1)
          },
          onEnterBack: () => {
            currentIndexRef.current = index;
          },
          onLeaveBack: () => {
            //  // //console.log("leave section", index);
            currentIndex = Math.max(index - 1, 0)
          },
        });


        const isLightAnimationSection =
          section.hasAttribute("data-light-animation") &&
          section.getAttribute("data-light-animation") === "true"

        elements.forEach((el, elIndex) => {
          const delay = parseFloat(el.getAttribute("data-delay") || "0")
          const staggerAmount = parseFloat(el.getAttribute("data-stagger") || "0") // Only use attribute value
          const lightAnimationStart = el.getAttribute("data-light-animation-start") || "top 90%" // Only use attribute value
          const fromVars = el.hasAttribute("data-from")
            ? JSON.parse(el.getAttribute("data-from") || "{}")
            : {}
          const middleVars = el.hasAttribute("data-middle")
            ? JSON.parse(el.getAttribute("data-middle") || "{}")
            : {}
          const toVars = el.hasAttribute("data-to")
            ? JSON.parse(el.getAttribute("data-to") || "{}")
            : {}

          const tl = gsap.timeline({
            scrollTrigger: isLightAnimationSection
              ? {
                trigger: section,
                start: `${lightAnimationStart}`,
                end: "bottom top",
                toggleActions: "play none play reverse",
              }
              : disableOutAnimation
                ? {
                  trigger: section,
                  start: `top-=${staggerAmount} bottom`,
                  end: "top top",
                  scrub: true,
                }
                : {
                  trigger: slideWrapper,
                  start: `top-=${staggerAmount} bottom`,  // Offset start position
                  end: `bottom-=${staggerAmount} top`,    // Offset end position
                  scrub: true                             // link progress to scroll
                }
          })

          createdTimelines.push(tl);
          if (isLightAnimationSection) {
            if (elIndex === 0) {
              tl.to(section, {
                autoAlpha: 1,
                duration: 0.6,
                immediateRender: true,
                ease: "power3.inOut"
              })
            }
            tl.fromTo(el, fromVars, middleVars, delay)
          } else {
            tl.fromTo(el, fromVars, middleVars, delay)
            if (!disableOutAnimation) {
              tl.to(el, toVars, 0.5 + delay)
            }
          }
        });
      });
    });
    mm.add('(max-width: 1279px)', () => {
      // lower screens
      handlers.forEach((section: HTMLElement | null, index: number) => {
        if (!section) return;
        // if (section.hasAttribute("data-primary-header")) {
        const elements = Array.from(
          section.querySelectorAll<HTMLElement>("[data-animation-atoms]")
        );

        createTrackedScrollTrigger({
          trigger: section,
          start: "top center",      // when section enters
          end: "bottom center",
          onEnter: () => {
            currentIndexRef.current = index;
          },
          onLeave: () => {
            // // //console.log("leave section", index);
            currentIndex = Math.min(index + 1, components.length - 1)
          },
          onEnterBack: () => {
            currentIndexRef.current = index;
          },
          onLeaveBack: () => {
            //  // //console.log("leave section", index);
            currentIndex = Math.max(index - 1, 0)
          },
        });

        elements.forEach((el, i) => {
          const defaultStart = 'top 80%';
          const isTablet = window.matchMedia('(min-width: 48rem)').matches;

          // use mobile attributes by default; tablet overrides when available
          const triggerElement = isTablet
            ? (el.hasAttribute("data-tablet-trigger") ? section.querySelector<HTMLElement>(el.getAttribute('data-tablet-trigger') || '') : null)
            : (el.hasAttribute("data-mobile-trigger") ? section.querySelector<HTMLElement>(el.getAttribute('data-mobile-trigger') || '') : null);

          const fromAttribute = isTablet
            ? (el.hasAttribute("data-tablet-from") ? "data-tablet-from" : "data-from")
            : (el.hasAttribute("data-mobile-from") ? "data-mobile-from" : "data-from");

          const middleAttribute = isTablet
            ? (el.hasAttribute("data-tablet-middle") ? "data-tablet-middle" : "data-middle")
            : (el.hasAttribute("data-mobile-middle") ? "data-mobile-middle" : "data-middle");

          const triggerAttribute: string | HTMLElement = triggerElement ? triggerElement : section;
          const startAttribute: string = isTablet
            ? (el.hasAttribute("data-tablet-start") ? (el.getAttribute("data-tablet-start") ?? defaultStart) : defaultStart)
            : (el.hasAttribute("data-mobile-start") ? (el.getAttribute("data-mobile-start") ?? defaultStart) : defaultStart);

          const delayAttribute: number = isTablet
            ? (el.hasAttribute("data-tablet-delay") ? parseFloat(el.getAttribute("data-tablet-delay") || "0") : 0)
            : (el.hasAttribute("data-mobile-delay") ? parseFloat(el.getAttribute("data-mobile-delay") || "0") : 0);

          const durationAttribute: number = isTablet
            ? (el.hasAttribute("data-tablet-duration") ? parseFloat(el.getAttribute("data-tablet-duration") || "0.5") : 0.5)
            : (el.hasAttribute("data-mobile-duration") ? parseFloat(el.getAttribute("data-mobile-duration") || "0.5") : 0.5);

          let fromVars = el.hasAttribute(fromAttribute)
            ? JSON.parse(el.getAttribute(fromAttribute) || "{}")
            : {};
          let middleVars = el.hasAttribute(middleAttribute)
            ? JSON.parse(el.getAttribute(middleAttribute) || "{}")
            : {};

          if (durationAttribute) {
            middleVars.duration = durationAttribute;
          }
          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: triggerAttribute,
              start: startAttribute,      // Offset start position
              end: 'bottom top',          // Offset end position
              toggleActions: 'play none play reverse',
            },
          });
          createdTimelines.push(tl);

          if (i === 0) {
            tl.to(section, {
              autoAlpha: 1,
              duration: 0.5,
              ease: "power3.inOut"
            })
          }
          tl.fromTo(el, fromVars, middleVars, delayAttribute);
        });
      });
    });

    if (isReinit) {
      if (window.innerWidth < 1280 || !interactive) {
        createdTimelines.forEach((tl) => {
          const st = tl.scrollTrigger;
          if (!st) return;
          const targetProgress = (st as { scrub?: boolean }).scrub
            ? st.progress
            : st.progress > 0
              ? 1
              : st.progress;
          if (targetProgress > 0) {
            tl.progress(targetProgress, true);
          }
        });
      }
    }

    return () => {
      activeScrollTween?.kill();
      observer?.kill();
      document.removeEventListener("mousemove", trackCursor, { capture: true });
      createdTimelines.forEach((tl) => tl.kill());
      createdScrollTriggers.forEach((st) => st.kill());
      mm.revert();

      // Defensive cleanup for any trigger created against nodes in this container.
      if (containerRef.current) {
        ScrollTrigger.getAll().forEach((st) => {
          const trigger = (st as unknown as { trigger?: unknown }).trigger;
          if (trigger instanceof HTMLElement && containerRef.current?.contains(trigger)) {
            st.kill();
          }
        });
      }

      handlersRef.current = [];
      sectionsRef.current = [];
    };
  }

  useEffect(() => {
    const normalizePathname = (value: string) => {
      if (!value) return "/";
      const trimmed = value.replace(/\/+$/, "");
      return trimmed || "/";
    };

    const isSameRoute = (targetUrl: URL, currentUrl: URL) => {
      return (
        normalizePathname(targetUrl.pathname) === normalizePathname(currentUrl.pathname) &&
        targetUrl.search === currentUrl.search
      );
    };

    const handleDocumentClick = (event: MouseEvent) => {
      if (
        event.defaultPrevented ||
        event.button !== 0 ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      ) {
        return;
      }

      

      const target = event.target as HTMLElement | null;

      // NEW: smooth scroll for anything with data-scroll-to="someId"
      const scrollEl = target?.closest<HTMLElement>("[data-scroll-to]");
      if (scrollEl) {
        event.preventDefault();
        event.stopPropagation(); // stops Button's own onClick / Link from running
        scrollToTargetRef.current?.(scrollEl.getAttribute("data-scroll-to") || "");
        return;
      }



      const anchor = target?.closest("a[href]") as HTMLAnchorElement | null;
      if (!anchor) return;
      if (anchor.closest("[data-page-transition='off']")) return;
      if (anchor.closest("[data-scroll-ignore]")) return;

      const href = anchor.getAttribute("href");
       // NEW: smooth scroll for href="#someId" links
      if (href?.startsWith("#")) {
        if (href?.length > 1) {
          event.preventDefault();
          event.stopPropagation(); // stops the browser's instant jump / Next Link
          scrollToTargetRef.current?.(href.slice(1));
        }
        return;
      }

      if (anchor.target === "_blank" || anchor.hasAttribute("download")) return;

      const url = new URL(anchor.href, window.location.href);
      const current = new URL(window.location.href);

      if (url.origin !== current.origin) return;
      if (isSameRoute(url, current)) {
        // Strict no-op for current-route clicks: don't run transitions or refreshes.
        event.preventDefault();
        return;
      }

      if (isNavigatingRef.current) {
        event.preventDefault();
        return;
      }

      event.preventDefault();
      isNavigatingRef.current = true;
      document.documentElement.setAttribute(PENDING_ENTER_ATTR, "true");

      playPageExitTransition()
        .catch(() => {
          // Always continue route navigation even if animation fails.
        })
        .finally(() => {
          const latest = new URL(window.location.href);
          if (isSameRoute(url, latest)) {
            event.preventDefault();
            return;
          }
          router.push(`${url.pathname}${url.search}${url.hash}`);
        });
    };

    // Capture phase ensures we can block Next Link navigation before it runs.
    document.addEventListener("click", handleDocumentClick, true);
    return () => {
      document.removeEventListener("click", handleDocumentClick, true);
    };
  }, [interactive, playPageExitTransition, router]);

  useLayoutEffect(() => {
    document.documentElement.setAttribute(PENDING_ENTER_ATTR, "true");
    const hasPathChanged = previousPathnameRef.current !== null && previousPathnameRef.current !== pathname;
    const hasPendingEnter = document.documentElement.getAttribute(PENDING_ENTER_ATTR) === "true";
    cleanupRef.current = init();

    if (hasPathChanged || hasPendingEnter) {
      requestAnimationFrame(() => {
        playPageEnterTransition();
      });
      document.documentElement.removeAttribute(PENDING_ENTER_ATTR);
    }

    previousPathnameRef.current = pathname;
    isNavigatingRef.current = false;

    return () => {
      cleanupRef.current?.();
    };
  }, [interactive, pathname, items.length, playPageEnterTransition]);

  const reinit = React.useCallback(() => {
    cleanupRef.current?.();
    if (containerRef.current) {
      cleanupRef.current = init(true);
    }
  }, []);

  useImperativeHandle(ref, () => ({
    kill: () => cleanupRef.current?.(),
    reinit,
  }), [reinit]);

  const contextValue = React.useMemo(() => ({ reinit }), [reinit]);

  useEffect(() => {
      const updateHeight = () => {
          // setTimeout(() => {
            const header = document.getElementById('header');
            const placeholder = document.getElementsByClassName('firstOffset')?.[0] as HTMLElement;
            // console.log("header", header, placeholder, pathname);

            if (header && placeholder) {
                placeholder.style.paddingTop = `${header.offsetHeight}px`;
                ScrollTrigger.refresh();
            }
          // }, 100);
      };

      updateHeight();

      window.addEventListener('resize', updateHeight);
      return () => window.removeEventListener('resize', updateHeight);
  }, [pathname]);


  const content = !interactive ? (
    <div className={`${className} overflow-hidden`} style={{ position: "relative", zIndex: 1 }}>
      <div ref={containerRef}>
        {items.map((child, i) => (
          <div key={i} data-fullpage-slide className="firstOffset [&:has(.no-section)]:xl:min-h-auto section w-full bg-white">
            {child}
          </div>
        ))}
      </div>
    </div>
  ) : (
    <div ref={scrollRef} id={'panelContainer'} className={`${className} overflow-hidden`} style={{ position: "relative", zIndex: 1 }}>
      <div ref={containerRef}>
        {items.map((child, i) => (
          <div key={i} data-fullpage-slide className="firstOffset [&:has(.no-section)]:xl:h-auto section w-full xl:h-screen bg-white">
            {child}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <FullPageSliderContext.Provider value={contextValue}>
      {content}
    </FullPageSliderContext.Provider>
  );
}

const FullPageSlider = forwardRef<FullPageSliderRef, FullPageSliderProps>(FullPageSliderInner);
export default FullPageSlider;