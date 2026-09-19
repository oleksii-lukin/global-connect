"use client";

import { usePathname } from "next/navigation";
import { Show, SignInButton, UserButton } from "@clerk/nextjs";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const NAV_LINKS = [
  { label: "Home", section: "top", page: "/" },
  { label: "Opportunities", section: "opportunities", page: "/opportunities" },
  { label: "Online Sessions", section: "sessions", page: "/sessions" },
  { label: "Guides", section: "guides", page: "/guides" },
  { label: "Community", section: "community", page: "/community" },
  { label: "About", section: "about", page: "/about" },
];

function AuthButtons({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Show
        when="signed-out"
        fallback={
          <UserButton
            appearance={{
              elements: { avatarBox: "size-8", userButtonAvatarBox: "size-8" },
            }}
          />
        }
      >
        <SignInButton mode="modal">
          <Button variant="default" size="xs">
            Join us
          </Button>
        </SignInButton>
      </Show>
    </div>
  );
}

export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";

  const links = NAV_LINKS.map((l) => ({
    label: l.label,
    href: isHome ? `#${l.section}` : l.page,
  }));
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-6 px-6">
        <Logo />

        <ul className="hidden items-center gap-7 lg:flex">
          {links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="hidden items-center gap-3 lg:flex">
          <Button
            variant="outline"
            size="xs"
            render={<a href={isHome ? "#opportunities" : "/opportunities"} />}
          >
            Explore opportunities
          </Button>
          <AuthButtons className="flex items-center" />
        </div>

        <Sheet>
          <SheetTrigger
            render={
              <button
                type="button"
                aria-label="Toggle navigation"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-foreground lg:hidden"
              >
                <span className="sr-only">Menu</span>
                <span className="flex flex-col gap-1.5">
                  <span className="block h-px w-5 bg-foreground" />
                  <span className="block h-px w-5 bg-foreground" />
                </span>
              </button>
            }
          />
          <SheetContent side="right">
            <SheetHeader className="text-left">
              <SheetTitle>Menu</SheetTitle>
              <SheetDescription>
                Explore Global Connect
              </SheetDescription>
            </SheetHeader>
            <nav className="flex flex-col gap-2 px-4" aria-label="Mobile">
              {links.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="rounded-full px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="mt-6 flex flex-col gap-3 px-4 pb-6">
              <AuthButtons className="flex items-center gap-3" />
              <Button
                variant="outline"
                size="sm"
            render={<a href={isHome ? "#opportunities" : "/opportunities"} />}
              >
                Explore opportunities
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </nav>
    </header>
  );
}