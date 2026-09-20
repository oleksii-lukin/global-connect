import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, INLINES } from "@contentful/rich-text-types";
import type { Document as RichTextDocument } from "@contentful/rich-text-types";

type AssetFile = {
  url?: string;
  details?: { image?: { width?: number; height?: number } };
  contentType?: string;
};

const YOUTUBE_RE =
  /(?:youtube\.com\/(?:watch\?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/;

function youtubeEmbedUrl(url: string): string | null {
  const m = url.match(YOUTUBE_RE);
  return m ? `https://www.youtube-nocookie.com/embed/${m[1]}` : null;
}

function assetUrl(
  target: unknown,
): { url: string; alt: string; width?: number; height?: number } | null {
  const asset = target as {
    fields?: {
      title?: string | Record<string, string>;
      description?: string | Record<string, string>;
      file?: AssetFile | Record<string, AssetFile>;
    };
  } | null;
  // Contentful delivery returns localized fields unwrapped; the bundled seed
  // wraps them under the "en-US" locale. Support both shapes.
  const loc = <T,>(v: T | Record<string, T> | undefined): T | undefined =>
    v && typeof v === "object" && !Array.isArray(v) && "en-US" in v
      ? (v as Record<string, T>)["en-US"]
      : (v as T | undefined);
  const file = loc<AssetFile>(asset?.fields?.file);
  if (!file?.url) return null;
  const url = file.url.startsWith("//") ? `https:${file.url}` : file.url;
  const alt =
    loc(asset?.fields?.description) ??
    loc(asset?.fields?.title) ??
    "";
  return {
    url,
    alt,
    width: file.details?.image?.width,
    height: file.details?.image?.height,
  };
}

export function RichText({ document }: { document: RichTextDocument }) {
  return (
    <div className="prose prose-neutral max-w-none prose-headings:tracking-tight prose-a:text-brand prose-img:rounded-2xl prose-img:my-8">
      {documentToReactComponents(document, {
        renderNode: {
          [BLOCKS.EMBEDDED_ASSET]: (node) => {
            const asset = assetUrl(node.data.target);
            if (!asset) return null;
            return (
              // eslint-disable-next-line @next/next/no-img-element -- CMS-rich-text images come from Contentful (images.ctfassets.net) and local fallback; next/image would need remotePatterns
              <img
                src={asset.url}
                alt={asset.alt}
                width={asset.width}
                height={asset.height}
                loading="lazy"
                className="my-8 w-full rounded-2xl object-cover"
              />
            );
          },
          [INLINES.ASSET_HYPERLINK]: (node, children) => {
            const asset = assetUrl(node.data.target);
            if (!asset) return <>{children}</>;
            return (
              <a href={asset.url} target="_blank" rel="noopener noreferrer">
                {children}
              </a>
            );
          },
          [BLOCKS.EMBEDDED_ENTRY]: (node, children) => {
            const entry = node.data.target as
              | { sys?: { contentType?: { sys?: { id?: string } } }; fields?: Record<string, unknown> }
              | undefined;
            const typeId = entry?.sys?.contentType?.sys?.id;
            if (typeId === "video" && entry?.fields) {
              const rawUrl =
                typeof entry.fields.videoUrl === "string"
                  ? entry.fields.videoUrl
                  : typeof entry.fields.videoUrl === "object" &&
                      entry.fields.videoUrl !== null &&
                      "en-US" in (entry.fields.videoUrl as Record<string, unknown>)
                    ? (entry.fields.videoUrl as Record<string, string>)["en-US"]
                    : "";
              const embedSrc = youtubeEmbedUrl(rawUrl);
              if (!embedSrc) return null;
              const title =
                typeof entry.fields.title === "string"
                  ? entry.fields.title
                  : typeof entry.fields.title === "object" &&
                      entry.fields.title !== null &&
                      "en-US" in (entry.fields.title as Record<string, unknown>)
                    ? (entry.fields.title as Record<string, string>)["en-US"]
                    : "Video";
              const caption =
                typeof entry.fields.caption === "string"
                  ? entry.fields.caption
                  : typeof entry.fields.caption === "object" &&
                      entry.fields.caption !== null &&
                      "en-US" in (entry.fields.caption as Record<string, unknown>)
                    ? (entry.fields.caption as Record<string, string>)["en-US"]
                    : undefined;
              return (
                <figure className="my-8">
                  <div className="aspect-video relative w-full overflow-hidden rounded-2xl">
                    <iframe
                      src={embedSrc}
                      title={title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                      loading="lazy"
                      className="absolute inset-0 h-full w-full"
                    />
                  </div>
                  {caption && (
                    <figcaption className="mt-3 text-center text-sm text-muted-foreground">
                      {caption}
                    </figcaption>
                  )}
                </figure>
              );
            }
            return <>{children}</>;
          },
        },
      })}
    </div>
  );
}
