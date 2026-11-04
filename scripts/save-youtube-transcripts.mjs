#!/usr/bin/env node
// Saves YouTube captions into the Strapi `transcript` field of video items (components.video → video[]).
//
// Why: YouTube blocks transcript requests from Vercel's servers, so the live site can't fetch them at runtime.
// Run this from your own machine instead; once `transcript` is filled in Strapi the site uses it and never calls YouTube.
//
// Only video items with allow_transcript on and an empty transcript are touched (use --force to overwrite).
// Changes go to the DRAFT; publish the listed entries in Strapi afterwards.
//
//   node scripts/save-youtube-transcripts.mjs                      dry run: lists what would be saved
//   node scripts/save-youtube-transcripts.mjs --slug my-article     limit to one entry
//   node scripts/save-youtube-transcripts.mjs --write              save (needs STRAPI_WRITE_TOKEN)
//   options: --collections articles,events   --force
//
// STRAPI_WRITE_TOKEN: a Strapi API token with update permission on those collections, set in your shell or .env.local.
// The site's own read token is never used for writing.

import fs from "node:fs";
import path from "node:path";
import { YoutubeTranscript } from "youtube-transcript";

// ---------- args / env ----------
const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const option = (name) => { const i = args.indexOf(`--${name}`); return i > -1 ? args[i + 1] : undefined; };

const WRITE = flag("write");
const FORCE = flag("force");
const SLUG = option("slug");
const COLLECTIONS = (option("collections") || "articles").split(",").map((c) => c.trim()).filter(Boolean);

function exit(message) { console.error(`✖ ${message}`); process.exit(1); }

const readEnvFile = (file) => {
    if (!fs.existsSync(file)) return {};
    return Object.fromEntries(fs.readFileSync(file, "utf8").split("\n")
        .map((line) => line.trim())
        .filter((line) => line && !line.startsWith("#") && line.includes("="))
        .map((line) => { const i = line.indexOf("="); return [line.slice(0, i).trim(), line.slice(i + 1).trim().replace(/^["']|["']$/g, "")]; }));
};
const env = { ...readEnvFile(".env"), ...readEnvFile(".env.local"), ...process.env };

const BASE = env.NEXT_PUBLIC_STRAPI_URL?.replace(/\/$/, "");
const READ_TOKEN = env.STRAPI_API_TOKEN;
const WRITE_TOKEN = env.STRAPI_WRITE_TOKEN;

if (!BASE || !READ_TOKEN) exit("NEXT_PUBLIC_STRAPI_URL and STRAPI_API_TOKEN must be set (.env / .env.local).");
if (WRITE && !WRITE_TOKEN) exit("--write needs STRAPI_WRITE_TOKEN (a Strapi API token with update permission).");

// ---------- strapi ----------
const strapi = async (url, { token = READ_TOKEN, method = "GET", body } = {}) => {
    const res = await fetch(`${BASE}${url}`, {
        method,
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body: body ? JSON.stringify(body) : undefined,
        signal: AbortSignal.timeout(90_000),
    });
    const json = await res.json().catch(() => ({}));
    if (!res.ok) {
        const error = new Error(json?.error?.message || `${res.status} ${res.statusText}`);
        error.details = json?.error?.details;
        throw error;
    }
    return json;
};

// Draft versions: their component ids are the ones an update must reference
const SECTIONS_QUERY = "fields[0]=slug&fields[1]=title&populate[sections][populate]=*&status=draft";

const listEntries = async (collection) => {
    const entries = [];
    for (let page = 1; ; page++) {
        const slugFilter = SLUG ? `&filters[slug][$eq]=${encodeURIComponent(SLUG)}` : "";
        const json = await strapi(`/api/${collection}?${SECTIONS_QUERY}${slugFilter}&pagination[page]=${page}&pagination[pageSize]=50`);
        entries.push(...(json.data || []));
        if (page >= (json.meta?.pagination?.pageCount || 1)) return entries;
    }
};

const getEntry = async (collection, documentId) =>
    (await strapi(`/api/${collection}/${documentId}?${SECTIONS_QUERY}`)).data;

// ---------- youtube ----------
const getYoutubeId = (url) => {
    if (!url) return;
    try {
        const u = new URL(url.trim());
        if (u.hostname.includes("youtu.be")) return u.pathname.split("/")[1] || undefined;
        if (u.searchParams.get("v")) return u.searchParams.get("v") || undefined;
        return u.pathname.match(/\/(embed|shorts|live)\/([^/?]+)/)?.[2];
    } catch { return; }
};

const decodeEntities = (str) => str
    .replace(/&amp;/g, "&").replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");

const isNoise = (text) => /^\[.*\]$/.test(text) || text.toLowerCase() === "foreign";

// Same paragraphing as the site (video-parser toParagraphs): break at a sentence end after ~50 words, hard cap 90
const toParagraphs = (lines, min = 50, max = 90) => {
    const paragraphs = [];
    let current = [];
    let words = 0;
    for (const line of lines) {
        current.push(line);
        words += line.split(" ").length;
        if ((words >= min && /[.?!]$/.test(line)) || words >= max) { paragraphs.push(current.join(" ")); current = []; words = 0; }
    }
    if (current.length) paragraphs.push(current.join(" "));
    return paragraphs;
};

const transcriptCache = new Map();
const fetchParagraphs = (videoId) => {
    if (!transcriptCache.has(videoId)) {
        transcriptCache.set(videoId, YoutubeTranscript.fetchTranscript(videoId, { lang: "en" }).then((raw) => {
            const lines = raw.map((s) => decodeEntities(s.text).replace(/\s+/g, " ").trim()).filter((t) => t && !isNoise(t));
            return toParagraphs(lines);
        }));
    }
    return transcriptCache.get(videoId);
};

// ---------- transcript field ----------
const blocksText = (nodes = []) => nodes.map((node) => (typeof node?.text === "string" ? node.text : blocksText(node?.children))).join("");
const isEmptyTranscript = (value) => {
    if (typeof value === "string") return !value.trim();
    if (Array.isArray(value)) return !blocksText(value).trim();
    return true;
};

// Rich text (Blocks) takes an array, Rich text (Markdown) a string; which one is found out on the first save
let transcriptFormat = "blocks";
const toFieldValue = (paragraphs, format) => format === "blocks"
    ? paragraphs.map((text) => ({ type: "paragraph", children: [{ type: "text", text }] }))
    : paragraphs.join("\n\n");

// Video items of a section (repeatable `video` / `videos`, or the old single-video section)
const videoListKey = (section) => (Array.isArray(section.videos) ? "videos" : Array.isArray(section.video) ? "video" : null);

// Sections without the transcripts, to check nothing else changed on save
const withoutTranscripts = (data) => JSON.stringify((data?.sections || []).map((section) => {
    const { transcript: _t, ...rest } = section;
    const key = videoListKey(section);
    return key ? { ...rest, [key]: section[key].map(({ transcript: _i, ...item }) => item) } : rest;
}));

// ---------- run ----------
const backupDir = path.join("scripts", ".transcript-backups", new Date().toISOString().replace(/[:.]/g, "-"));
const toPublish = [];
let found = 0, saved = 0, skipped = 0, failed = 0;

for (const collection of COLLECTIONS) {
    let entries;
    try {
        entries = await listEntries(collection);
    } catch (error) {
        console.warn(`! ${collection}: ${error.message} (skipped)`);
        continue;
    }

    for (const entry of entries) {
        const sections = entry.sections || [];
        const label = `${collection}/${entry.slug || entry.documentId}`;
        const updates = new Map(); // section index → Map(item index → paragraphs)

        for (const [sIndex, section] of sections.entries()) {
            if (section.__component !== "components.video") continue;
            const key = videoListKey(section);
            const items = key ? section[key] : [section];

            for (const [iIndex, item] of items.entries()) {
                if (!item?.allow_transcript) continue;
                if (!FORCE && !isEmptyTranscript(item.transcript)) { skipped++; continue; }
                const videoId = getYoutubeId(item.url);
                if (!videoId) { console.warn(`! ${label} · "${item.name}": no YouTube id in ${item.url}`); failed++; continue; }
                try {
                    const paragraphs = await fetchParagraphs(videoId);
                    if (!paragraphs.length) throw new Error("empty transcript");
                    if (!updates.has(sIndex)) updates.set(sIndex, new Map());
                    updates.get(sIndex).set(iIndex, paragraphs);
                    found++;
                    console.log(`${WRITE ? "→" : "·"} ${label} · "${item.name?.trim()}" (${videoId}): ${paragraphs.length} paragraphs`);
                } catch (error) {
                    console.warn(`! ${label} · "${item.name}" (${videoId}): ${error.message}`);
                    failed++;
                }
            }
        }

        if (!updates.size || !WRITE) continue;

        // Every section is sent back by id (kept as it is); only the transcripts are new. A section left out would be deleted.
        const payload = (format) => sections.map((section, sIndex) => {
            const base = { __component: section.__component, id: section.id };
            const itemUpdates = updates.get(sIndex);
            if (!itemUpdates) return base;
            const key = videoListKey(section);
            if (!key) return { ...base, transcript: toFieldValue(itemUpdates.get(0), format) };
            return {
                ...base,
                [key]: section[key].map((item, iIndex) => itemUpdates.has(iIndex)
                    ? { id: item.id, transcript: toFieldValue(itemUpdates.get(iIndex), format) }
                    : { id: item.id }),
            };
        });

        fs.mkdirSync(backupDir, { recursive: true });
        const backupFile = path.join(backupDir, `${collection}-${entry.documentId}.json`);
        fs.writeFileSync(backupFile, JSON.stringify(entry, null, 2));

        const put = (format) => strapi(`/api/${collection}/${entry.documentId}?status=draft`, {
            token: WRITE_TOKEN, method: "PUT", body: { data: { sections: payload(format) } },
        });

        try {
            try {
                await put(transcriptFormat);
            } catch (error) {
                // 400 from guessing the field type wrong → try the other type once
                if (!/valid|must be|array|string/i.test(`${error.message} ${JSON.stringify(error.details || {})}`)) throw error;
                const other = transcriptFormat === "blocks" ? "markdown" : "blocks";
                await put(other);
                transcriptFormat = other;
            }

            const after = await getEntry(collection, entry.documentId);
            if (withoutTranscripts(after) !== withoutTranscripts(entry)) {
                console.error(`✖ ${label}: other section content changed after saving — check it in Strapi. Backup: ${backupFile}`);
                failed++;
                continue;
            }
            saved += [...updates.values()].reduce((sum, items) => sum + items.size, 0);
            toPublish.push(label);
        } catch (error) {
            console.error(`✖ ${label}: ${error.message}${error.details ? ` ${JSON.stringify(error.details)}` : ""}`);
            failed++;
        }
    }
}

console.log("");
if (!WRITE) {
    console.log(`Dry run, nothing saved: ${found} transcript(s) to save, ${skipped} already filled, ${failed} failed. Add --write to save.`);
} else {
    console.log(`Saved ${saved} transcript(s) (${transcriptFormat}) to drafts; ${skipped} already filled; ${failed} failed.`);
    if (toPublish.length) console.log(`Publish these in Strapi to put them live:\n  ${toPublish.join("\n  ")}\nBackups: ${backupDir}`);
}
process.exit(failed ? 1 : 0);
