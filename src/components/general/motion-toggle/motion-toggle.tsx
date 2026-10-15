"use client";

import { useEffect, useState } from "react";
import { isMotionReduced, MOTION_STORAGE_KEY, onMotionChange, setMotionReduced } from "@/utils/motion";

// Pauses every autoplaying <video> while motion is reduced, and resumes them afterwards.
const syncVideos = (reduced: boolean, root: ParentNode = document) => {
  root.querySelectorAll<HTMLVideoElement>("video[autoplay]").forEach((video) => {
    if (reduced) {
      video.pause();
    } else if (video.paused) {
      video.play().catch(() => {});
    }
  });
};

const MotionToggle: React.FC = () => {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(isMotionReduced());
    syncVideos(isMotionReduced());

    const unsubscribe = onMotionChange((value) => {
      setReduced(value);
      syncVideos(value);
    });

    // videos mounted later (route changes, carousels) must respect the current setting too
    const observer = new MutationObserver((mutations) => {
      if (!isMotionReduced()) return;
      mutations.forEach((m) => m.addedNodes.forEach((node) => {
        if (node instanceof HTMLVideoElement) node.pause();
        else if (node instanceof HTMLElement) syncVideos(true, node);
      }));
    });
    observer.observe(document.body, { childList: true, subtree: true });

    // a play() call from component code (autoPlay attr) can race the observer
    const onPlay = (e: Event) => {
      if (isMotionReduced() && e.target instanceof HTMLVideoElement) e.target.pause();
    };
    document.addEventListener("play", onPlay, true);

    // follow OS changes unless the visitor has made an explicit choice
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onOsChange = () => {
      let stored: string | null = null;
      try { stored = localStorage.getItem(MOTION_STORAGE_KEY); } catch {}
      if (!stored) setMotionReduced(query.matches, false);
    };
    query.addEventListener("change", onOsChange);

    return () => {
      unsubscribe();
      observer.disconnect();
      document.removeEventListener("play", onPlay, true);
      query.removeEventListener("change", onOsChange);
    };
  }, []);

  return (
    <button
      type="button"
      onClick={() => setMotionReduced(!reduced)}
      aria-pressed={reduced}
      className="fixed bottom-sm left-sm z-[60] flex items-center gap-x-2xs rounded-full bg-dark-gray px-sm py-2xs text-xs text-white font-modern-era-medium shadow-md cursor-pointer hover:bg-black"
    >
      <span aria-hidden="true" className="inline-flex w-[0.75em] h-[0.75em] items-center justify-center">
        {reduced ? (
          <svg viewBox="0 0 10 10" className="w-full h-full fill-current"><path d="M1 0l9 5-9 5z" /></svg>
        ) : (
          <svg viewBox="0 0 10 10" className="w-full h-full fill-current"><path d="M1 0h3v10H1zM6 0h3v10H6z" /></svg>
        )}
      </span>
      {reduced ? "Play animations" : "Pause animations"}
    </button>
  );
};

export default MotionToggle;
