import { richTextToMarkdown } from "@/utils/utils";
import { TranscriptSegment } from "@/components/general/video/video.types";
import { VideoParserType } from "./video-parser.types";

// Handles youtu.be/ID, youtube.com/watch?v=ID, /embed/ID, /shorts/ID, /live/ID
export const getYoutubeId = (url?: string | null): string | undefined => {
    if (!url) return;
    try {
        const u = new URL(url.trim());
        if (u.hostname.includes("youtu.be")) return u.pathname.split("/")[1] || undefined;
        if (u.searchParams.get("v")) return u.searchParams.get("v") || undefined;
        return u.pathname.match(/\/(embed|shorts|live)\/([^/?]+)/)?.[2];
    } catch {
        return;
    }
};

// Group caption lines into paragraphs, breaking at a sentence end after ~50 words (hard cap 90 for auto captions with no punctuation)
export const toParagraphs = (segments: TranscriptSegment[], min = 50, max = 90): TranscriptSegment[][] => {
    const paragraphs: TranscriptSegment[][] = [];
    let current: TranscriptSegment[] = [];
    let words = 0;

    for (const segment of segments) {
        current.push(segment);
        words += segment.text.split(" ").length;
        if ((words >= min && /[.?!]$/.test(segment.text)) || words >= max) {
            paragraphs.push(current);
            current = [];
            words = 0;
        }
    }
    if (current.length) paragraphs.push(current);
    return paragraphs;
};

// Transcript slider: 3 pages for videos under 10 minutes, 4 for longer ones
export const getTranscriptPageCount = (durationSeconds: number) => (durationSeconds < 600 ? 3 : 4);

// Split caption lines into equal slices of video time, then into paragraphs within each slice
export const toTimedPages = (segments: TranscriptSegment[]): TranscriptSegment[][][] => {
    const duration = segments[segments.length - 1]?.end || 0;
    const count = getTranscriptPageCount(duration);
    const slice = duration / count || 1;

    const pages: TranscriptSegment[][] = Array.from({ length: count }, () => []);
    segments.forEach((segment) => pages[Math.min(count - 1, Math.floor(segment.start / slice))].push(segment));

    return pages.filter((page) => page.length).map((page) => toParagraphs(page));
};

const videoParser = (section: any) => {
    if(!section) return

    const transcript = section?.allowTranscript ? richTextToMarkdown(section?.transcript)?.trim() || undefined : undefined;
    const segments: TranscriptSegment[] | undefined = section?.transcriptSegments;

    return {
        component: 'components.video',
        props: {
            name: section?.name,
            videoId: getYoutubeId(section?.url),
            allowTranscript: !!section?.allowTranscript,
            caption: section?.caption || undefined,
            transcript,
            // Only used when there's no Strapi transcript (with-video-transcripts adds these from YouTube)
            transcriptPages: section?.allowTranscript && !transcript && segments?.length ? toTimedPages(segments) : undefined,
        } as VideoParserType["props"]
    } as VideoParserType
}

export default videoParser;
