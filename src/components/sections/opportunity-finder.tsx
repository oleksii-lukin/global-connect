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
import { Section, SectionHeading } from "@/components/sections/section";
import type { OpportunityData } from "@/types/models";

export function OpportunityFinder({
  opportunities,
}: {
  opportunities: OpportunityData[];
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
        eyebrow="Opportunity finder"
        eyebrowDot="lavender"
        title="Find an opportunity that's actually for you."
        description="Stop scrolling through opportunities you can't apply for."
      />

      <div className="mx-auto mb-10 flex max-w-4xl flex-col gap-3">
        <Input
          type="search"
          placeholder="Search opportunities…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          aria-label="Search opportunities"
        />
        <div className="flex flex-wrap gap-2.5">
          <FilterSelect
            label="Any country"
            value={country}
            onChange={setCountry}
            options={countries}
          />
          <FilterSelect
            label="Any type"
            value={type}
            onChange={setType}
            options={types}
          />
          <FilterSelect
            label="Any funding"
            value={funding}
            onChange={setFunding}
            options={fundings}
          />
          <FilterSelect
            label="Any age"
            value={age}
            onChange={setAge}
            options={ages}
          />
          <FilterSelect
            label="Any deadline"
            value={deadline}
            onChange={setDeadline}
            options={deadlines}
          />
          {hasActiveFilters && (
            <Button
              variant="ghost"
              className="rounded-full px-4 py-2 text-sm"
              onClick={resetFilters}
            >
              <RotateCcw className="size-3.5" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((opportunity, index) => (
            <OpportunityCard
              key={opportunity.id}
              opportunity={opportunity}
              index={index}
            />
          ))}
        </div>
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
  return (
    <Select value={value} onValueChange={(next) => onChange(next ?? "all")}>
      <SelectTrigger
        aria-label={label}
        className="h-9 w-fit rounded-full border border-border bg-background px-4 text-sm hover:bg-muted"
      >
        <SelectValue placeholder={label} />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">
          <span className="text-muted-foreground">{label}</span>
        </SelectItem>
        {options.map((option) => (
          <SelectItem key={option} value={option}>
            {option}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}