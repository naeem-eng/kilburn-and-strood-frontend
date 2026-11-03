import { getVideoItems, getYoutubeId } from "@/parsers/section-parser/video-parser/video-parser";
import { richTextToMarkdown } from "@/utils/utils";
import { fetchYoutubeTranscriptSegments } from "./youtube-transcript";

// For each video in a listing: Strapi transcript wins; only fetch from YouTube when it's empty and allow_transcript is on.
// YouTube transcripts keep their timings so the component can highlight along with playback.
const withItemTranscript = async (item: any) => {
    if (!item?.allowTranscript || richTextToMarkdown(item?.transcript)?.trim()) return item;
    const transcriptSegments = await fetchYoutubeTranscriptSegments(getYoutubeId(item?.url));
    return { ...item, transcriptSegments };
};

export const withVideoTranscripts = async (sections?: any[]) => {
    if (!sections?.length) return sections || [];

    return Promise.all(
        sections.map(async (section: any) => {
            if (section?.component !== "components.video") return section;
            const videos = await Promise.all(getVideoItems(section).map(withItemTranscript));
            return { ...section, videos };
        })
    );
};
