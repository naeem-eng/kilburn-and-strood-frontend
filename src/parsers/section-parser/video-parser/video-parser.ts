import { richTextToMarkdown } from "@/utils/utils";
import { TranscriptSegment, VideoItem } from "@/components/general/video/video.types";
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

// Repeatable list of Single-video items. Falls back to the old single-video shape (fields on the section itself).
export const getVideoItems = (section: any): any[] => {
    const items = section?.videos ?? section?.video;
    if (Array.isArray(items)) return items.filter(Boolean);
    return section?.url ? [section] : [];
};

const videoItemParser = (item: any): VideoItem => {
    const transcript = item?.allowTranscript ? richTextToMarkdown(item?.transcript)?.trim() || undefined : undefined;
    const segments: TranscriptSegment[] | undefined = item?.transcriptSegments;

    return {
        name: item?.name,
        videoId: getYoutubeId(item?.url),
        allowTranscript: !!item?.allowTranscript,
        caption: item?.caption || undefined,
        transcript,
        // Only used when there's no Strapi transcript (with-video-transcripts adds these from YouTube)
        transcriptParagraphs: item?.allowTranscript && !transcript && segments?.length ? toParagraphs(segments) : undefined,
    };
};

const videoParser = (section: any) => {
    if(!section) return

    return {
        component: 'components.video',
        props: {
            name: section?.name,
            videos: getVideoItems(section).map(videoItemParser).filter((video) => video.videoId),
        } as VideoParserType["props"]
    } as VideoParserType
}

export default videoParser;
