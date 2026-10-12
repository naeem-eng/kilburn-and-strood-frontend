"use client";

import React, { useRef, useCallback, useEffect } from "react";
import Image from "next/image";

export type ImageRevealProps = {
    /** The base image src */
    src: string;
    alt?: string;
    width?: number;
    height?: number;
    /** The reveal image src (shown inside the hover window) */
    revealSrc: string;
    revealAlt?: string;
    /** Size of the square reveal window in vw units */
    windowSize?: number;
    /** className applied to the base image */
    className?: string;
    /** Any extra props to spread on the base image (data-* attributes, etc.) */
    imageProps?: Record<string, unknown>;
    /** Any extra props to spread on the outer wrapper */
    wrapperProps?: Record<string, unknown>;
};

const ImageReveal: React.FC<ImageRevealProps> = ({
    src,
    alt = "Image",
    width = 942,
    height = 418,
    revealSrc,
    revealAlt = "Reveal image",
    windowSize = 15,
    className = "",
    imageProps = {},
    wrapperProps = {},
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const overlayRef = useRef<HTMLDivElement>(null);
    const rectRef = useRef<DOMRect | null>(null);
    const rafRef = useRef<number | null>(null);
    const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const currentHalf = useRef(0);
    const targetHalf = useRef(0);
    const lastPos = useRef({ x: 0, y: 0 });
    const activeRef = useRef(false);
    const isShowing = useRef(false);
    const animStartTime = useRef(0);
    const startHalf = useRef(0);
    const justActivatedRef = useRef(false);
    const opacityTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const animDuration = 1000; // ms
    const opacityDuration = 500; // ms

    // Convert vw to pixels
    const getHalf = useCallback(() => {
        if (typeof window === "undefined") return 0;
        return (windowSize / 100) * window.innerWidth / 2;
    }, [windowSize]);

    // Always read the latest half value — store in ref for stable closures
    const halfRef = useRef(0);
    halfRef.current = getHalf();
    const half = halfRef.current;

    // Easing function — slow ease-out
    const ease = (t: number) => {
        return t < 1 ? 1 - Math.pow(1 - t, 5) : 1;
    };

    const applyPosition = useCallback(() => {
        const rect = rectRef.current;
        const overlay = overlayRef.current;
        if (!rect || !overlay ) return;

        const { x, y } = lastPos.current;
        const h = currentHalf.current;

        const top = y - h;
        const right = rect.width - x - h;
        const bottom = rect.height - y - h;
        const left = x - h;

        // Expand clip by 1px on each side to prevent sub-pixel hairline artifacts
        overlay.style.clipPath = `inset(${top - 1}px ${right - 1}px ${bottom - 1}px ${left - 1}px)`;

    }, []);

    // Returns true if the square (centered on cursor) overlaps the image rect
    const squareOverlapsImage = useCallback(
        (cx: number, cy: number, h: number) => {
            const rect = rectRef.current;
            if (!rect) return false;
            // cx/cy are relative to the container
            return (
                cx + h > 0 &&
                cx - h < rect.width &&
                cy + h > 0 &&
                cy - h < rect.height
            );
        },
        []
    );

    const tick = useCallback(() => {
        if (!activeRef.current) return;

        const target = targetHalf.current;
        const from = startHalf.current;
        const elapsed = performance.now() - animStartTime.current;
        const progress = Math.min(elapsed / animDuration, 1);
        const easedProgress = ease(progress);

        currentHalf.current = from + (target - from) * easedProgress;

        applyPosition();

        if (progress < 1) {
            rafRef.current = requestAnimationFrame(tick);
        } else {
            currentHalf.current = target;
            applyPosition();
        }
    }, [applyPosition]);

    const startAnimation = useCallback(
        (to: number) => {
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
            startHalf.current = currentHalf.current;
            targetHalf.current = to;
            activeRef.current = true;
            animStartTime.current = performance.now();
            rafRef.current = requestAnimationFrame(tick);
        },
        [tick]
    );

    const show = useCallback(
        (cx: number, cy: number) => {
            const overlay = overlayRef.current;
            if (!overlay) return;

            const h = halfRef.current;
            isShowing.current = true;
            lastPos.current = { x: cx, y: cy };

            if (hideTimeoutRef.current) {
                clearTimeout(hideTimeoutRef.current);
                hideTimeoutRef.current = null;
            }

            const softEntry = justActivatedRef.current;
            justActivatedRef.current = false;

            if (softEntry) {
                // Cursor was already over the image when we activated — fade in
                overlay.style.transition = "none";
                overlay.style.opacity = "0";
                overlay.style.visibility = "visible";
                // Force reflow so the browser commits opacity:0 before transitioning to 1
                void overlay.offsetHeight;
                overlay.style.transition = `opacity ${opacityDuration}ms ease-out`;
                overlay.style.opacity = "1";
                // Strip transition after it completes so it doesn't affect normal show/hide
                if (opacityTimeoutRef.current) clearTimeout(opacityTimeoutRef.current);
                opacityTimeoutRef.current = setTimeout(() => {
                    if (overlayRef.current) {
                        overlayRef.current.style.transition = "none";
                    }
                }, opacityDuration + 10);
            } else {
                overlay.style.transition = "none";
                overlay.style.opacity = "1";
                overlay.style.visibility = "visible";
            }

            // If not already at full size, animate in
            if (currentHalf.current < h) {
                if (currentHalf.current === 0) {
                    // Soft entry: grow from near-zero; side entry: from 50%
                    currentHalf.current = softEntry ? h * 0.1 : h * 0.5;
                }
                applyPosition();
                startAnimation(h);
            } else {
                applyPosition();
            }
        },
        [applyPosition, startAnimation]
    );

    const hide = useCallback(() => {
        isShowing.current = false;
        const h = halfRef.current;
        // Animate down to 50% then hide
        startAnimation(h * 0.5);
        // After animation, hide elements
        hideTimeoutRef.current = setTimeout(() => {
            if (!isShowing.current) {
                currentHalf.current = 0;
                if (overlayRef.current) {
                    overlayRef.current.style.visibility = "hidden";
                    overlayRef.current.style.opacity = "";
                    overlayRef.current.style.transition = "none";
                }
            }
        }, animDuration + 10);
    }, [startAnimation]);

    useEffect(() => {
        // Skip on touch/pointer devices (mobile & tablet)
        const isTouch = window.matchMedia("(pointer: coarse)").matches;
        if (isTouch) return;

        const container = containerRef.current;
        if (!container) return;

        let listenersActive = false;

        const handleDocumentMouseMove = (e: MouseEvent) => {
            const ctr = containerRef.current;
            if (!ctr) return;

            // Refresh rect periodically (on first move, or if not cached)
            if (!rectRef.current) {
                rectRef.current = ctr.getBoundingClientRect();
            }
            const rect = rectRef.current;
            const h = halfRef.current;

            // Early bail-out: skip expensive work if cursor is far from this instance
            // Use a generous margin (2x the half size) so we don't miss the edge
            const margin = h * 2;
            if (
                e.clientX < rect.left - margin ||
                e.clientX > rect.right + margin ||
                e.clientY < rect.top - margin ||
                e.clientY > rect.bottom + margin
            ) {
                // If we were showing, trigger hide
                if (isShowing.current) {
                    hide();
                }
                return;
            }

            const cx = e.clientX - rect.left;
            const cy = e.clientY - rect.top;
            lastPos.current = { x: cx, y: cy };

            const overlaps = squareOverlapsImage(cx, cy, halfRef.current);

            if (overlaps && !isShowing.current) {
                // Cursor's square just entered the image area
                rectRef.current = ctr.getBoundingClientRect();
                const freshCx = e.clientX - rectRef.current.left;
                const freshCy = e.clientY - rectRef.current.top;
                lastPos.current = { x: freshCx, y: freshCy };
                show(freshCx, freshCy);
            } else if (!overlaps && isShowing.current) {
                // Square has fully left the image area
                hide();
            } else if (isShowing.current) {
                // Still inside — update position
                if (currentHalf.current === targetHalf.current) {
                    applyPosition();
                }
            } else {
                // Mouse is near but not overlapping — clear soft-entry so
                // a subsequent side-entry doesn't get the fade treatment
                justActivatedRef.current = false;
            }
        };

        // Refresh rect on scroll/resize
        const refreshRect = () => {
            rectRef.current = containerRef.current?.getBoundingClientRect() ?? null;
        };
        const onResize = () => {
            refreshRect();
            halfRef.current = getHalf();
        };

        const addListeners = () => {
            if (listenersActive) return;
            listenersActive = true;
            justActivatedRef.current = true;
            document.addEventListener("mousemove", handleDocumentMouseMove);
            window.addEventListener("scroll", refreshRect, { passive: true });
            window.addEventListener("resize", onResize, { passive: true });
        };

        const removeListeners = () => {
            if (!listenersActive) return;
            listenersActive = false;
            document.removeEventListener("mousemove", handleDocumentMouseMove);
            window.removeEventListener("scroll", refreshRect);
            window.removeEventListener("resize", onResize);
            // Clean up state if we were showing
            if (isShowing.current) {
                isShowing.current = false;
                currentHalf.current = 0;
                if (overlayRef.current) overlayRef.current.style.visibility = "hidden";
            }
            rectRef.current = null;
        };

        // Only register listeners when the component is visible in the viewport
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    addListeners();
                } else {
                    removeListeners();
                }
            },
            { rootMargin: "200px" }
        );
        observer.observe(container);

        return () => {
            observer.disconnect();
            removeListeners();
        };
    }, [squareOverlapsImage, show, hide, applyPosition, getHalf]);

    useEffect(() => {
        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
            if (opacityTimeoutRef.current) clearTimeout(opacityTimeoutRef.current);
            if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current);
        };
    }, []);

    return (
        <div
            ref={containerRef}
            style={{ position: "relative" }}
            {...wrapperProps}
        >
            {/* Base image */}
            <Image
                unoptimized
                src={src}
                alt={alt}
                width={width}
                height={height}
                className={className}
                {...imageProps}
            />

            {/* Reveal overlay – always mounted, visibility toggled via ref */}
            <div
                ref={overlayRef}
                aria-hidden="true"
                style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "100%",
                    pointerEvents: "none",
                    overflow: "hidden",
                    visibility: "hidden",
                    clipPath: "inset(50% 50% 50% 50%)",
                    backfaceVisibility: "hidden",
                    transform: "translateZ(0)",
                }}
            >
                <Image
                    src={revealSrc}
                    alt={revealAlt}
                    width={width}
                    height={height}
                    className={className}
                    style={{ pointerEvents: "none" }}
                />
            </div>

        </div>
    );
};

export default ImageReveal;
