import { Suspense } from "react";
import { Show, SignInButton } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import type { HomepageSectionData } from "@/types/models";

export function FinalCtaSection({
  config,
}: {
  config?: HomepageSectionData;
}) {
  return (
    <section
      id="join"
      className="relative overflow-hidden px-6 py-20 sm:py-28"
    >
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="blob absolute left-[-8rem] top-0 h-96 w-96 bg-lavender/25 blur-3xl" />
        <div className="blob absolute right-[-6rem] top-1/4 h-80 w-80 bg-pastel-blue/25 blur-3xl" />
        <div className="blob absolute bottom-[-4rem] left-1/2 h-80 w-80 -translate-x-1/2 bg-sage/20 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-3xl text-center">
        {config?.title && (
          <h2 className="font-display text-4xl leading-[1.08] text-foreground sm:text-6xl">
            {config.title}
          </h2>
        )}
        {config?.description && (
          <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
            {config.description}
          </p>
        )}
        <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
          <Button
            size="lg"
            variant="default"
            render={<a href="#opportunities" />}
          >
            Explore opportunities
          </Button>
          <Suspense
            fallback={
              <Button size="lg" variant="outline" disabled>
                Join Global Connect
              </Button>
            }
          >
            <Show
              when="signed-out"
              fallback={
                <Button
                  size="lg"
                  variant="outline"
                  render={<a href="/community" />}
                >
                  Join Global Connect
                </Button>
              }
            >
              <SignInButton mode="modal">
                <Button size="lg" variant="outline">
                  Join Global Connect
                </Button>
              </SignInButton>
            </Show>
          </Suspense>
        </div>
      </div>
    </section>
  );
}