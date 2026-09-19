"use client";

import { useDeferredValue, useMemo, useState } from "react";
import { RotateCcw } from "lucide-react";

import { OpportunityCard } from "@/components/opportunity-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";
import { Section, SectionHeading } from "@/components/sections/section";
import type { HomepageSectionData, OpportunityData } from "@/types/models";

export function OpportunityFinder({
  opportunities,
  limit,
  config,
}: {
  opportunities: OpportunityData[];
  limit?: number;
  config?: HomepageSectionData;
}) {
  const [search, setSearch] = useState("");
  const [country, setCountry] = useState("all");
  const [type, setType] = useState("all");
  const [funding, setFunding] = useState("all");
  const [age, setAge] = useState("all");
  const [deadline, setDeadline] = useState("all");

  const deferredSearch = useDeferredValue(search.trim().toLowerCase());

  const countries = useMemo(
    () => Array.from(new Set(opportunities.map((o) => o.country))).sort(),
    [opportunities],
  );
  const types = useMemo(
    () => Array.from(new Set(opportunities.map((o) => o.type))).sort(),
    [opportunities],
  );
  const fundings = useMemo(
    () => Array.from(new Set(opportunities.map((o) => o.funding))).sort(),
    [opportunities],
  );
  const ages = useMemo(
    () => Array.from(new Set(opportunities.map((o) => o.ageRange))).sort(),
    [opportunities],
  );
  const deadlines = useMemo(
    () => Array.from(new Set(opportunities.map((o) => o.deadline))).sort(),
    [opportunities],
  );

  const filtered = useMemo(() => {
    return opportunities.filter((o) => {
      if (deferredSearch) {
        const haystack =
          `${o.title} ${o.description} ${o.country} ${o.tags.join(" ")}`.toLowerCase();
        if (!haystack.includes(deferredSearch)) return false;
      }
      if (country !== "all" && o.country !== country) return false;
      if (type !== "all" && o.type !== type) return false;
      if (funding !== "all" && o.funding !== funding) return false;
      if (age !== "all" && o.ageRange !== age) return false;
      if (deadline !== "all" && o.deadline !== deadline) return false;
      return true;
    });
  }, [opportunities, deferredSearch, country, type, funding, age, deadline]);

  const hasActiveFilters =
    deferredSearch ||
    country !== "all" ||
    type !== "all" ||
    funding !== "all" ||
    age !== "all" ||
    deadline !== "all";

  function resetFilters() {
    setSearch("");
    setCountry("all");
    setType("all");
    setFunding("all");
    setAge("all");
    setDeadline("all");
  }

  return (
    <Section id="opportunities" className="scroll-mt-20">
      <SectionHeading
        eyebrow={config?.eyebrow}
        eyebrowDot="lavender"
        title={config?.title ?? "Opportunities"}
        description={config?.description}
      />

      <div className="mx-auto mb-10 mt-12 max-w-3xl">
        <div className="flex items-center gap-3 rounded-full border border-border bg-card px-5 py-3 shadow-[0_10px_30px_-22px_rgba(36,36,64,0.5)]">
          <span aria-hidden="true" className="text-lg leading-none">🔎</span>
          <Input
            type="search"
            placeholder="Search opportunities…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search opportunities"
            className="h-auto w-full border-0 bg-transparent p-0 rounded-none text-base md:text-[16px] text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-0"
          />
        </div>
        <div className="-mx-6 mt-4 overflow-x-auto px-6 pb-1">
          <div className="flex w-max gap-2 sm:w-auto sm:flex-wrap sm:justify-center">
            <FilterSelect
              label="Country"
              value={country}
              onChange={setCountry}
              options={countries}
            />
            <FilterSelect
              label="Type"
              value={type}
              onChange={setType}
              options={types}
            />
            <FilterSelect
              label="Age"
              value={age}
              onChange={setAge}
              options={ages}
            />
            <FilterSelect
              label="Funding"
              value={funding}
              onChange={setFunding}
              options={fundings}
            />
            <FilterSelect
              label="Deadline"
              value={deadline}
              onChange={setDeadline}
              options={deadlines}
            />
            {hasActiveFilters && (
              <Button
                variant="ghost"
                className="shrink-0 rounded-full px-4 py-2 text-sm"
                onClick={resetFilters}
              >
                <RotateCcw className="size-3.5" />
                Clear
              </Button>
            )}
          </div>
        </div>
      </div>

      {filtered.length > 0 ? (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(limit ? filtered.slice(0, limit) : filtered).map(
              (opportunity, index) => (
                <OpportunityCard
                  key={opportunity.id}
                  opportunity={opportunity}
                  index={index}
                />
              ),
            )}
          </div>
          {limit && filtered.length > limit && (
            <div className="mt-10 text-center">
              <Link
                href="/opportunities"
                className="group inline-flex items-center gap-2 text-base font-medium text-foreground transition-colors hover:text-accent-foreground"
              >
                View all opportunities
                <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                  →
                </span>
              </Link>
            </div>
          )}
        </>
      ) : (
        <div className="mx-auto max-w-md rounded-3xl border border-border bg-card/80 p-10 text-center">
          <p className="font-display text-xl">No opportunities match</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try clearing a filter or two to widen the search.
          </p>
          <Button className="mt-4" variant="outline" onClick={resetFilters}>
            Clear filters
          </Button>
        </div>
      )}
    </Section>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
}) {
  const isActive = value !== "all";

  return (
    <Select
      key={value}
      value={isActive ? value : undefined}
      onValueChange={(next) => onChange(next ?? "all")}
    >
      <SelectTrigger
        aria-label={label}
        className="h-auto w-fit shrink-0 gap-1 rounded-full border border-border bg-card/60 px-4 py-2.5 text-sm text-muted-foreground transition-colors hover:border-foreground/25 hover:text-foreground"
      >
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent className="min-w-48">
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}