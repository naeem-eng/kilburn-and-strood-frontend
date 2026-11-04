"use client";

import { useEffect, useRef, useState, VideoHTMLAttributes } from "react";

type LazyVideoProps = Omit<VideoHTMLAttributes<HTMLVideoElement>, "src"> & {
    src?: string | null;
    /** how far outside the viewport to start loading */
    rootMargin?: string;
    [dataAttr: `data-${string}`]: unknown;
};

// Muted autoplay loop for videos below the fold: the file only downloads once the video is near the viewport.
// It keeps the `autoplay` attribute, so MotionToggle still finds it (video[autoplay]) and pauses it when motion is reduced.
// Hero videos that are on screen at load should stay a plain <video>.
const LazyVideo = ({ src, rootMargin = "300px 0px", ...rest }: LazyVideoProps) => {
    const ref = useRef<HTMLVideoElement>(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const video = ref.current;
        if (!video || inView) return;
        if (typeof IntersectionObserver === "undefined") {
            setInView(true);
            return;
        }
        const observer = new IntersectionObserver(([entry]) => {
            if (entry?.isIntersecting) {
                setInView(true);
                observer.disconnect();
            }
        }, { rootMargin });
        observer.observe(video);
        return () => observer.disconnect();
    }, [inView, rootMargin]);

    if (!src) return null;

    return (
        <video
            ref={ref}
            src={inView ? src : undefined}
            autoPlay
            loop
            muted
            playsInline
            preload={inView ? "auto" : "none"}
            {...rest}
        />
    );
};

export default LazyVideo;
