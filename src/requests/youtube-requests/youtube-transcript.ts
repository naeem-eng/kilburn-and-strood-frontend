import { YoutubeTranscript } from "youtube-transcript";
import { TranscriptSegment } from "@/components/general/video/video.types";
import { toParagraphs } from "@/parsers/section-parser/video-parser/video-parser";

export type { TranscriptSegment };

const decodeEntities = (str: string) =>
    str
        .replace(/&amp;/g, "&")
        .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
        .replace(/&quot;/g, '"')
        .replace(/&#39;|&apos;/g, "'")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">");

// [Music], [Applause] and the "foreign" ASR noise word
const isNoise = (text: string) => /^\[.*\]$/.test(text) || text.toLowerCase() === "foreign";

export const fetchYoutubeTranscriptSegments = async (videoId?: string): Promise<TranscriptSegment[] | undefined> => {
    if (!videoId) return;
    try {
        const raw = await YoutubeTranscript.fetchTranscript(videoId, { lang: "en" });
        // The package returns milliseconds for most tracks and seconds for some older ones
        const unit = raw.some(s => s.duration > 100) ? 1000 : 1;

        const segments = raw
            .map(s => ({
                start: s.offset / unit,
                end: (s.offset + s.duration) / unit,
                text: decodeEntities(s.text).replace(/\s+/g, " ").trim(),
            }))
            .filter(s => s.text && !isNoise(s.text));

        return segments.length ? segments : undefined;
    } catch (err) {
        // Throws when captions are disabled, the video is private, or YouTube blocks the request
        console.warn(`fetchYoutubeTranscript failed: ${videoId}`, (err as Error)?.message);
        return;
    }
};

export const fetchYoutubeTranscript = async (videoId?: string): Promise<string | undefined> => {
    const segments = await fetchYoutubeTranscriptSegments(videoId);
    if (!segments) return;
    return toParagraphs(segments).map(p => p.map(s => s.text).join(" ")).join("\n\n");
};
