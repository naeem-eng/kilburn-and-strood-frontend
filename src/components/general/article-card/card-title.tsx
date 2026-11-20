"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { TextLg } from "@/components/helpers/typography";

const MAX_LINES = 3;

// Card title cut to 3 lines, ending at a whole word with "…" (client approval, Impact article title length).
// Only for listing cards: detail pages show the full title.
// - The server HTML has the full title (SEO) with a CSS 3-line clamp, so long titles never break the layout,
//   even before JS runs; CSS alone can cut the last word, so after layout the text is trimmed to whole words.
// - Screen readers get the full title; the trimmed text is aria-hidden.
// - The title stays an inline span so the hover underline still follows each line.
const CardTitle: React.FC<{ title?: string }> = ({ title = "" }) => {
    const headingRef = useRef<HTMLDivElement>(null);
    const [shown, setShown] = useState(title);

    useLayoutEffect(() => {
        const heading = headingRef.current;
        if (!heading || !title) return;

        const words = title.trim().split(/\s+/);
        // off-screen copy at the same width and font, so measuring doesn't touch what's displayed
        const measurer = document.createElement("div");
        measurer.setAttribute("aria-hidden", "true");
        measurer.style.cssText = "position:absolute;left:0;right:0;top:0;visibility:hidden;pointer-events:none;";
        const span = document.createElement("span");
        span.className = "animated-underline";
        measurer.appendChild(span);

        const lines = (text: string) => {
            span.textContent = text;
            return span.getClientRects().length; // an inline span has one rect per line
        };
        const withEllipsis = (count: number) => words.slice(0, count).join(" ").replace(/[\s,;:&–—\-]+$/, "") + "…";

        const fit = () => {
            heading.appendChild(measurer);
            let next = title;
            if (lines(title) > MAX_LINES) {
                // most words that still fit in 3 lines with the ellipsis
                let low = 1, high = words.length - 1;
                while (low < high) {
                    const mid = Math.ceil((low + high) / 2);
                    if (lines(withEllipsis(mid)) <= MAX_LINES) low = mid;
                    else high = mid - 1;
                }
                next = withEllipsis(low);
            }
            measurer.remove();
            setShown(next);
        };

        fit();
        // widths change with the viewport; the web font can change the wrapping once it loads
        let lastWidth = heading.clientWidth;
        const observer = new ResizeObserver(() => {
            if (heading.clientWidth === lastWidth) return;
            lastWidth = heading.clientWidth;
            fit();
        });
        observer.observe(heading);
        document.fonts?.ready.then(fit).catch(() => {});
        return () => {
            observer.disconnect();
            measurer.remove();
        };
    }, [title]);

    const trimmed = shown !== title;
    return (
        <TextLg as="h3" className="text-dark-gray font-modern-era-medium">
            {/* relative: positions the measuring copy; line-clamp-3: fallback until (or without) JS */}
            <span ref={headingRef} className="relative line-clamp-3">
                <span className="animated-underline" aria-hidden={trimmed || undefined}>{shown}</span>
                {trimmed && <span className="sr-only">{title}</span>}
            </span>
        </TextLg>
    );
};

export default CardTitle;
