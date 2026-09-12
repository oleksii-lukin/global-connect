import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import { BLOCKS, INLINES } from "@contentful/rich-text-types";
import type { Document as RichTextDocument } from "@contentful/rich-text-types";

type AssetFile = {
  url?: string;
  details?: { image?: { width?: number; height?: number } };
  contentType?: string;
};

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
          [BLOCKS.EMBEDDED_ENTRY]: (_node, children) => <>{children}</>,
        },
      })}
    </div>
  );
}
