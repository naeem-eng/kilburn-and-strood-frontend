"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Small, Text } from "@/components/helpers/typography";
import { DropdownIcon, LeftArrowIcon, RightArrowIcon } from "@/components/helpers/icons";
import BodyMarkdown from "@/components/helpers/body-markdown";
import { useYoutubePlayer } from "./use-youtube-player";
import { TranscriptSegment, VideoProps } from "./video.types";

const MARKDOWN_PAGES = 3;

// Key of the caption line playing at `time`: the last line that has started, unless it ended over a second ago
const getActiveKey = (pages: TranscriptSegment[][][] | undefined, time: number | null): string | null => {
    if (!pages || time === null) return null;
    let active: string | null = null;
    pages.forEach((page, pg) => page.forEach((paragraph, p) => paragraph.forEach((segment, s) => {
        if (segment.start <= time && time <= segment.end + 1) active = `${pg}-${p}-${s}`;
    })));
    return active as string | null;
};

// Strapi transcripts have no timings, so split their paragraphs evenly across the pages
const splitMarkdown = (markdown: string, count: number): string[] => {
    const paragraphs = markdown.split(/\n{2,}/).filter((p) => p.trim());
    const perPage = Math.ceil(paragraphs.length / count) || 1;
    const pages: string[] = [];
    for (let i = 0; i < paragraphs.length; i += perPage) pages.push(paragraphs.slice(i, i + perPage).join("\n\n"));
    return pages;
};

const Video: React.FC<VideoProps> = ({ name, videoId, allowTranscript, caption, transcript, transcriptPages, className }) => {
    const [isOpen, setIsOpen] = useState(true);
    const [page, setPage] = useState(0);
    const panelId = useId();
    const frameRef = useRef<HTMLDivElement>(null);

    const isTimed = !!(allowTranscript && transcriptPages?.length);
    const { isReady, currentTime, seekTo } = useYoutubePlayer(frameRef, !!videoId);
    const activeKey = isTimed ? getActiveKey(transcriptPages, currentTime) : null;
    const activePage = activeKey ? Number(activeKey.split("-")[0]) : null;

    const markdownPages = !isTimed && allowTranscript && typeof transcript === "string" ? splitMarkdown(transcript, MARKDOWN_PAGES) : [];
    const pageCount = isTimed ? transcriptPages?.length || 0 : markdownPages.length;

    // Slide along with the video when playback moves into the next page
    useEffect(() => {
        if (activePage !== null) setPage(activePage);
    }, [activePage]);

    if (!videoId) return null;

    const hasTranscript = pageCount > 0;
    const showArrows = hasTranscript && isOpen && pageCount > 1;

    const params = new URLSearchParams({
        rel: "0",
        modestbranding: "1",
        playsinline: "1",
        enablejsapi: "1", // lets the player API hide captions and sync the transcript
    });

    const renderSegment = (segment: TranscriptSegment, key: string) => {
        const isActive = key === activeKey;
        return (
            <span key={key}>
                <span
                    data-key={key}
                    role={isReady ? "button" : undefined}
                    tabIndex={isReady ? 0 : undefined}
                    aria-current={isActive ? "true" : undefined}
                    onClick={isReady ? () => seekTo(segment.start) : undefined}
                    onKeyDown={isReady ? (e) => {
                        if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            seekTo(segment.start);
                        }
                    } : undefined}
                    className={`transition-colors duration-200 ${isActive ? 'bg-yellow/40' : ''} ${isReady ? 'cursor-pointer hover:bg-yellow/20' : ''}`}
                >
                    {segment.text}
                </span>{" "}
            </span>
        );
    };

    return (
        <figure className={`no-section min-h-full py-xl w-full xl:max-w-[90%] px-sm sm:px-xl mx-auto ${className || ''}`}>
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

            {(caption || hasTranscript) && (
                <div className="flex items-center justify-between gap-sm mt-md ">
                    {caption ? (
                        <figcaption>
                            <Small as="p" className="text-dark-gray">{caption}</Small>
                        </figcaption>
                    ) : <span />}

                    {hasTranscript && (
                        <div className="flex items-center gap-sm shrink-0">
                            <button
                                type="button"
                                aria-expanded={isOpen}
                                aria-controls={panelId}
                                onClick={() => setIsOpen((open) => !open)}
                                className="flex items-center gap-xs shrink-0 bg-light-gray px-xs py-2xs cursor-pointer"
                            >
                                <Small as="p" className="text-dark-gray">Transcript</Small>
                                <DropdownIcon className={`h-[2vw] w-auto transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {showArrows && (
                                <div className="flex items-center gap-xs">
                                    <button
                                        type="button"
                                        aria-label="Previous transcript section"
                                        aria-controls={panelId}
                                        disabled={page === 0}
                                        onClick={() => setPage((current) => Math.max(0, current - 1))}
                                        className="p-2xs cursor-pointer disabled:cursor-default disabled:opacity-30 transition-opacity"
                                    >
                                        <LeftArrowIcon />
                                    </button>
                                    <button
                                        type="button"
                                        aria-label="Next transcript section"
                                        aria-controls={panelId}
                                        disabled={page === pageCount - 1}
                                        onClick={() => setPage((current) => Math.min(pageCount - 1, current + 1))}
                                        className="p-2xs cursor-pointer disabled:cursor-default disabled:opacity-30 transition-opacity"
                                    >
                                        <RightArrowIcon />
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            )}

            {hasTranscript && (
                <div
                    id={panelId}
                    hidden={!isOpen}
                    aria-roledescription="carousel"
                    aria-label="Video transcript"
                    className="relative bg-light-gray mt-xs min-h-[300px] overflow-hidden text-dark-gray"
                >
                    <div
                        className="flex items-start transition-transform duration-500 ease-out"
                        style={{ transform: `translateX(-${page * 100}%)` }}
                    >
                        {Array.from({ length: pageCount }, (_, pg) => (
                            <div
                                key={pg}
                                role="group"
                                aria-roledescription="slide"
                                aria-label={`${pg + 1} of ${pageCount}`}
                                aria-hidden={pg !== page}
                                inert={pg !== page}
                                className="w-full shrink-0 p-md"
                            >
                                {isTimed
                                    ? transcriptPages?.[pg]?.map((paragraph, p) => (
                                        <Text as="p" key={p} className="mb-lg last:mb-0">
                                            {paragraph.map((segment, s) => renderSegment(segment, `${pg}-${p}-${s}`))}
                                        </Text>
                                    ))
                                    : (
                                        <BodyMarkdown className="text-dark-gray">
                                            {markdownPages[pg]}
                                        </BodyMarkdown>
                                    )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </figure>
    );
};

export default Video;
