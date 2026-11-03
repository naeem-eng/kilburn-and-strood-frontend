"use client";

import { useEffect, useId, useRef } from "react";
import { Small, Text } from "@/components/helpers/typography";
import { DropdownIcon, LeftArrowIcon, RightArrowIcon } from "@/components/helpers/icons";
import BodyMarkdown from "@/components/helpers/body-markdown";
import { useYoutubePlayer } from "./use-youtube-player";
import { TranscriptSegment, VideoItem } from "./video.types";

type VideoSlideProps = VideoItem & {
    isActive: boolean; // the slide currently in view
    isOpen: boolean;
    onToggle: () => void;
    // Carousel controls; arrows only show when there's more than one video
    count: number;
    current: number;
    onPrev: () => void;
    onNext: () => void;
};

// Key of the caption line playing at `time`: the last line that has started, unless it ended over a second ago
const getActiveKey = (paragraphs: TranscriptSegment[][] | undefined, time: number | null): string | null => {
    if (!paragraphs || time === null) return null;
    let active: string | null = null;
    paragraphs.forEach((paragraph, p) => paragraph.forEach((segment, s) => {
        if (segment.start <= time && time <= segment.end + 1) active = `${p}-${s}`;
    }));
    return active as string | null;
};

const VideoSlide: React.FC<VideoSlideProps> = ({
    name, videoId, allowTranscript, caption, transcript, transcriptParagraphs,
    isActive, isOpen, onToggle, count, current, onPrev, onNext,
}) => {
    const panelId = useId();
    const frameRef = useRef<HTMLDivElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);

    const isTimed = !!(allowTranscript && transcriptParagraphs?.length);
    const { isReady, currentTime, seekTo, pause } = useYoutubePlayer(frameRef, !!videoId);
    const activeKey = isTimed ? getActiveKey(transcriptParagraphs, currentTime) : null;

    // Stop the video when the carousel slides away from it
    useEffect(() => {
        if (!isActive) pause();
    }, [isActive, pause]);

    // Keep the playing line in view inside the panel (scrolls the panel only, never the page)
    useEffect(() => {
        const panel = panelRef.current;
        const active = activeKey ? panel?.querySelector<HTMLElement>(`[data-key="${activeKey}"]`) : null;
        if (!panel || !active) return;
        const top = active.offsetTop - panel.offsetTop;
        if (top < panel.scrollTop || top + active.offsetHeight > panel.scrollTop + panel.clientHeight) {
            panel.scrollTo({ top: top - panel.clientHeight / 3, behavior: "smooth" });
        }
    }, [activeKey]);

    if (!videoId) return null;

    const hasTranscript = !!(allowTranscript && (transcript || isTimed));

    const params = new URLSearchParams({
        rel: "0",
        modestbranding: "1",
        playsinline: "1",
        enablejsapi: "1", // lets the player API hide captions and sync the transcript
    });

    return (
        <div>
            <div ref={frameRef} className="relative w-full aspect-video bg-dark-gray">
                <iframe
                    src={`https://www.youtube-nocookie.com/embed/${videoId}?${params.toString()}`}
                    title={name || "YouTube video"}
                    loading="lazy"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                    className="absolute inset-0 w-full h-full border-0"
                />
            </div>

            {(caption || hasTranscript || count > 1) && (
                <div className="flex items-center justify-between gap-sm mt-md ">
                    {caption ? (
                        <figcaption>
                            <Small as="p" className="text-dark-gray">{caption}</Small>
                        </figcaption>
                    ) : <span />}

                    <div className="flex items-center gap-sm shrink-0">
                        {hasTranscript && (
                            <button
                                type="button"
                                aria-expanded={isOpen}
                                aria-controls={panelId}
                                onClick={onToggle}
                                className="flex items-center gap-xs shrink-0 bg-light-gray px-xs py-2xs cursor-pointer"
                            >
                                <Small as="p" className="text-dark-gray">Transcript</Small>
                                <DropdownIcon className={`h-[2vw] w-auto transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                            </button>
                        )}

                        {count > 1 && (
                            <div className="flex items-center gap-xs">
                                <button
                                    type="button"
                                    aria-label="Previous video"
                                    disabled={current === 0}
                                    onClick={onPrev}
                                    className="p-2xs cursor-pointer disabled:cursor-default disabled:opacity-30 transition-opacity"
                                >
                                    <LeftArrowIcon />
                                </button>
                                <button
                                    type="button"
                                    aria-label="Next video"
                                    disabled={current === count - 1}
                                    onClick={onNext}
                                    className="p-2xs cursor-pointer disabled:cursor-default disabled:opacity-30 transition-opacity"
                                >
                                    <RightArrowIcon />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {hasTranscript && (
                <div
                    id={panelId}
                    ref={panelRef}
                    hidden={!isOpen}
                    aria-label="Video transcript"
                    className="relative bg-light-gray mt-xs p-md max-h-[28rem] overflow-y-auto text-dark-gray"
                >
                    {isTimed
                        ? transcriptParagraphs?.map((paragraph, p) => (
                            <Text as="p" key={p} className="mb-lg last:mb-0">
                                {paragraph.map((segment, s) => {
                                    const key = `${p}-${s}`;
                                    const isLineActive = key === activeKey;
                                    return (
                                        <span key={key}>
                                            <span
                                                data-key={key}
                                                role={isReady ? "button" : undefined}
                                                tabIndex={isReady ? 0 : undefined}
                                                aria-current={isLineActive ? "true" : undefined}
                                                onClick={isReady ? () => seekTo(segment.start) : undefined}
                                                onKeyDown={isReady ? (e) => {
                                                    if (e.key === "Enter" || e.key === " ") {
                                                        e.preventDefault();
                                                        seekTo(segment.start);
                                                    }
                                                } : undefined}
                                                className={`transition-colors duration-200 ${isLineActive ? 'bg-yellow/40' : ''} ${isReady ? 'cursor-pointer hover:bg-yellow/20' : ''}`}
                                            >
                                                {segment.text}
                                            </span>{" "}
                                        </span>
                                    );
                                })}
                            </Text>
                        ))
                        : (
                            <BodyMarkdown className="text-dark-gray">
                                {transcript}
                            </BodyMarkdown>
                        )}
                </div>
            )}
        </div>
    );
};

export default VideoSlide;
