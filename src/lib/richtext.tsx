import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import type { Document as RichTextDocument } from "@contentful/rich-text-types";

export function RichText({ document }: { document: RichTextDocument }) {
  return (
    <div className="prose prose-neutral max-w-none prose-headings:tracking-tight prose-a:text-brand">
      {documentToReactComponents(document)}
    </div>
  );
}