"use client";

import { useEffect, useRef, useState } from "react";
import VideoSlide from "./video-slide";
import { VideoProps } from "./video.types";

// Video listing: ← → slide the whole video (player, caption, transcript) to the next one.
// With a single video there's no carousel and no arrows.
const Video: React.FC<VideoProps> = ({ name, videos, className }) => {
    const [current, setCurrent] = useState(0);
    const [isTranscriptOpen, setIsTranscriptOpen] = useState(true);
    const [height, setHeight] = useState<number>();
    const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

    const items = videos?.filter((video) => video.videoId) || [];
    const count = items.length;
    const index = Math.min(current, Math.max(0, count - 1));

    // Size the carousel to the slide in view, so a short transcript doesn't leave the height of a long one
    useEffect(() => {
        const slide = slideRefs.current[index];
        if (!slide || count < 2) return;
        const update = () => setHeight(slide.offsetHeight);
        update();
        const observer = new ResizeObserver(update);
        observer.observe(slide);
        return () => observer.disconnect();
    }, [index, count]);

    if (!count) return null;

    const slideProps = (i: number) => ({
        ...items[i],
        isActive: i === index,
        isOpen: isTranscriptOpen,
        onToggle: () => setIsTranscriptOpen((open) => !open),
        count,
        current: i,
        onPrev: () => setCurrent(Math.max(0, i - 1)),
        onNext: () => setCurrent(Math.min(count - 1, i + 1)),
    });

    return (
        <figure
            aria-roledescription={count > 1 ? "carousel" : undefined}
            aria-label={name || "Videos"}
            className={`no-section min-h-full py-xl w-full xl:max-w-[90%] px-sm sm:px-xl mx-auto ${className || ''}`}
        >
            {count === 1 ? (
                <VideoSlide {...slideProps(0)} />
            ) : (
                <div
                    className="overflow-hidden transition-[height] duration-500 ease-out"
                    style={{ height }}
                >
                    <div
                        className="flex items-start transition-transform duration-500 ease-out"
                        style={{ transform: `translateX(-${index * 100}%)` }}
                    >
                        {items.map((video, i) => (
                            <div
                                key={`${i}-${video.videoId}`}
                                ref={(el) => { slideRefs.current[i] = el; }}
                                role="group"
                                aria-roledescription="slide"
                                aria-label={`${i + 1} of ${count}${video.name ? `: ${video.name}` : ''}`}
                                aria-hidden={i !== index}
                                inert={i !== index}
                                className="w-full shrink-0"
                            >
                                <VideoSlide {...slideProps(i)} />
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </figure>
    );
};

export default Video;
