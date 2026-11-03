import { getYoutubeId } from "@/parsers/section-parser/video-parser/video-parser";
import { richTextToMarkdown } from "@/utils/utils";
import { fetchYoutubeTranscriptSegments } from "./youtube-transcript";

// Strapi transcript wins; only fetch from YouTube when it's empty and allow_transcript is on.
// YouTube transcripts keep their timings so the component can highlight along with playback.
export const withVideoTranscripts = async (sections?: any[]) => {
    if (!sections?.length) return sections || [];

    return Promise.all(
        sections.map(async (section: any) => {
            if (section?.component !== "components.video") return section;
            if (!section?.allowTranscript || richTextToMarkdown(section?.transcript)?.trim()) return section;

            const transcriptSegments = await fetchYoutubeTranscriptSegments(getYoutubeId(section?.url));
            return { ...section, transcriptSegments };
        })
    );
};
