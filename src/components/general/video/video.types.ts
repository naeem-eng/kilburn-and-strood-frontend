// One caption line, times in seconds
export type TranscriptSegment = {
    start: number;
    end: number;
    text: string;
}

// One video in the carousel (Strapi sub-components.single-video)
export type VideoItem = {
    name?: string;
    videoId?: string;
    allowTranscript?: boolean;
    caption?: string;
    transcript?: any; // markdown, from Strapi rich text
    transcriptParagraphs?: TranscriptSegment[][]; // timed YouTube captions: paragraphs → lines, highlighted during playback
}

// Video listing section (Strapi components.video, display name "Video-listings")
export type VideoProps = {
    index?: number;
    className?: string;
    name?: string;
    videos?: VideoItem[];
}
