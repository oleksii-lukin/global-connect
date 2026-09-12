import { Suspense } from "react";
import { Show, SignInButton } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";

export function FinalCtaSection() {
  return (
    <section
      id="join"
      className="relative overflow-hidden bg-foreground px-6 py-20 sm:py-28"
    >
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden"
        aria-hidden="true"
      >
        <div className="blob absolute -left-24 top-0 h-80 w-80 bg-lavender/15 blur-3xl" />
        <div className="blob absolute -right-20 bottom-0 h-80 w-80 bg-peach/15 blur-3xl" />
        <div className="blob absolute right-1/4 top-1/2 h-40 w-40 bg-sage/15 blur-2xl" />
      </div>

      <div className="relative mx-auto max-w-3xl text-center">
        <h2 className="font-display text-3xl leading-tight tracking-tight text-background sm:text-5xl">
          The world is bigger than you think.
        </h2>
        <p className="mt-5 text-lg text-background/75">
          Your next opportunity could be one search away.
        </p>
        <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
          <Button
            size="lg"
            variant="solid-inverse"
            render={<a href="#opportunities" />}
          >
            Explore opportunities <span aria-hidden="true">→</span>
          </Button>
          <Suspense
            fallback={
              <Button size="lg" variant="outline-inverse" disabled>
                Join Global Connect
              </Button>
            }
          >
            <Show
              when="signed-out"
              fallback={
                <Button
                  size="lg"
                  variant="outline-inverse"
                  render={<a href="/community" />}
                >
                  Join the community
                </Button>
              }
            >
              <SignInButton mode="modal">
                <Button size="lg" variant="outline-inverse">
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