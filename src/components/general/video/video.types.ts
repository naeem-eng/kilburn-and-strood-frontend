// One caption line, times in seconds
export type TranscriptSegment = {
    start: number;
    end: number;
    text: string;
}

export type VideoProps = {
    index?: number;
    className?: string;
    name?: string;
    videoId?: string;
    allowTranscript?: boolean;
    caption?: string;
    transcript?: any; // markdown, from Strapi rich text or the YouTube fallback
    transcriptPages?: TranscriptSegment[][][]; // timed YouTube captions: pages → paragraphs → lines, highlighted during playback
}
