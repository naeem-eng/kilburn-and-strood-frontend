"use client";

import { RefObject, useCallback, useEffect, useRef, useState } from "react";

// Just the parts of the YouTube IFrame Player API we use
type YTPlayer = {
    getCurrentTime: () => number;
    seekTo: (seconds: number, allowSeekAhead: boolean) => void;
    playVideo: () => void;
    getPlayerState: () => number;
    unloadModule: (name: string) => void;
};

type YTNamespace = {
    Player: new (
        el: HTMLIFrameElement,
        options: { events?: { onReady?: () => void; onStateChange?: (e: { data: number }) => void } }
    ) => YTPlayer;
    PlayerState: { PLAYING: number };
};

declare global {
    interface Window {
        YT?: YTNamespace;
        onYouTubeIframeAPIReady?: () => void;
    }
}

let apiPromise: Promise<YTNamespace> | null = null;

const loadYoutubeApi = (): Promise<YTNamespace> => {
    if (window.YT?.Player) return Promise.resolve(window.YT);
    if (apiPromise) return apiPromise;

    apiPromise = new Promise((resolve) => {
        const previous = window.onYouTubeIframeAPIReady;
        window.onYouTubeIframeAPIReady = () => {
            previous?.();
            if (window.YT) resolve(window.YT);
        };
        const script = document.createElement("script");
        script.src = "https://www.youtube.com/iframe_api";
        script.async = true;
        document.head.appendChild(script);
    });
    return apiPromise;
};

/**
 * Attaches the YouTube IFrame API to the embed inside `containerRef` and reports the playback time while it plays.
 * The iframe src must include enablejsapi=1.
 */
export const useYoutubePlayer = (containerRef: RefObject<HTMLElement | null>, enabled: boolean) => {
    const playerRef = useRef<YTPlayer | null>(null);
    const [isReady, setIsReady] = useState(false);
    const [currentTime, setCurrentTime] = useState<number | null>(null);

    useEffect(() => {
        const container = containerRef.current;
        if (!enabled || !container) return;

        let cancelled = false;
        let interval: number | undefined;

        const poll = () => {
            const time = playerRef.current?.getCurrentTime();
            if (typeof time === "number") setCurrentTime(time);
        };
        const stopPolling = () => {
            window.clearInterval(interval);
            interval = undefined;
        };

        // Keep the video clean: YouTube remembers a viewer's CC choice across embeds, so switch captions off explicitly.
        // The captions module (re)loads when playback starts, hence calling this on ready and on play.
        const hideCaptions = () => {
            playerRef.current?.unloadModule("captions");
            playerRef.current?.unloadModule("cc");
        };

        const startPolling = () => {
            stopPolling();
            interval = window.setInterval(poll, 250);
        };

        const attach = async () => {
            // Always read the current iframe: the consent manager may swap in a new element
            const iframe = container.querySelector("iframe");
            if (playerRef.current || !iframe?.src.includes("youtube")) return;
            const YT = await loadYoutubeApi();
            if (cancelled || playerRef.current) return;

            playerRef.current = new YT.Player(iframe, {
                events: {
                    onReady: () => {
                        setIsReady(true);
                        hideCaptions();
                        // Visitor may have pressed play before the API connected
                        if (playerRef.current?.getPlayerState() === YT.PlayerState.PLAYING) startPolling();
                        poll();
                    },
                    onStateChange: ({ data }) => {
                        if (data === YT.PlayerState.PLAYING) {
                            hideCaptions();
                            startPolling();
                        } else stopPolling();
                        poll();
                    },
                },
            });
        };

        // iubenda keeps the iframe on about:blank until cookie consent, then swaps in the real src (or a new iframe)
        attach();
        const observer = new MutationObserver(attach);
        observer.observe(container, { attributes: true, attributeFilter: ["src"], childList: true, subtree: true });

        return () => {
            cancelled = true;
            observer.disconnect();
            stopPolling();
            // Not calling destroy(): it removes the iframe, which React still owns
            playerRef.current = null;
        };
    }, [containerRef, enabled]);

    const seekTo = useCallback((seconds: number) => {
        const player = playerRef.current;
        if (!player) return;
        player.seekTo(seconds, true);
        player.playVideo();
        setCurrentTime(seconds);
    }, []);

    return { isReady, currentTime, seekTo };
};
