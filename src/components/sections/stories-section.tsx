import { SectionHeading, CardShell } from "@/components/sections/section";
import { Carousel } from "@/components/carousel";
import type { HomepageSectionData, StoryData } from "@/types/models";

const avatarColors = [
  "bg-lavender/25 text-accent-foreground",
  "bg-pastel-blue/25 text-secondary-foreground",
  "bg-sage/30 text-secondary-foreground",
];
const dotColors = ["bg-lavender", "bg-pastel-blue", "bg-sage"];

export function StoriesSection({
  stories,
  config,
}: {
  stories: StoryData[];
  config?: HomepageSectionData;
}) {
  return (
    <section className="relative overflow-hidden bg-background px-6 py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="blob absolute -left-24 top-10 h-72 w-72 bg-lavender/20 blur-3xl" />
        <div className="blob absolute right-[-6rem] top-1/3 h-80 w-80 bg-pastel-blue/20 blur-3xl" />
        <div className="blob absolute bottom-0 left-1/3 h-72 w-72 bg-sage/20 blur-3xl" />
        <div className="blob absolute right-1/4 top-10 h-40 w-40 bg-peach/25 blur-2xl" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <SectionHeading
          eyebrow={config?.eyebrow}
          eyebrowDot="lavender"
          title={config?.title ?? "Stories"}
          description={config?.description}
          className="mx-auto max-w-2xl text-center"
        />

        <Carousel ariaLabel="Student stories" className="mt-16">
          {stories.map((story, index) => (
            <CardShell key={story.id} variant="story">
              <span
                className="font-display text-6xl leading-none text-lavender/40 select-none"
                aria-hidden="true"
              >
                &ldquo;
              </span>
              <p className="mt-2 flex-1 text-[0.975rem] leading-relaxed text-foreground/85">
                {story.quote}
              </p>
              <div className="mt-8 flex items-center gap-4 border-t border-border/70 pt-6">
                <div
                  className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-display text-lg font-semibold ${avatarColors[index % avatarColors.length]}`}
                >
                  {story.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="font-medium text-foreground">{story.name}</p>
                  <div className="mt-0.5 flex items-center gap-1.5">
                    <span
                      className={`h-1.5 w-1.5 rounded-full ${dotColors[index % dotColors.length]}`}
                    />
                    <span className="text-xs text-muted-foreground">
                      {story.role}
                      {story.location ? ` · ${story.location}` : ""}
                    </span>
                  </div>
                </div>
              </div>
            </CardShell>
          ))}
        </Carousel>

        <div className="mt-14 text-center">
          <a
            href="#"
            className="group inline-flex items-center gap-2 text-base font-medium text-foreground transition-colors hover:text-accent-foreground"
          >
            Share your Global Connect story
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
              →
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}