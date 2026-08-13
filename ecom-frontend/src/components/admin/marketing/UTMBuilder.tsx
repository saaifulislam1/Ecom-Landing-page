"use client";

import { useMemo, useState } from "react";
import { Field, FormInput } from "@/components/admin/ui/AdminForm";
import { CopyButton } from "@/components/admin/ui/CopyButton";

export function UTMBuilder() {
  const [destination, setDestination] = useState("https://store.example.com/products");
  const [source, setSource] = useState("facebook");
  const [medium, setMedium] = useState("paid_social");
  const [campaign, setCampaign] = useState("july_sale");
  const [content, setContent] = useState("hero_banner");

  const url = useMemo(() => {
    const target = new URL(destination || "https://store.example.com");
    target.searchParams.set("utm_source", source);
    target.searchParams.set("utm_medium", medium);
    target.searchParams.set("utm_campaign", campaign);
    target.searchParams.set("utm_content", content);
    return target.toString();
  }, [campaign, content, destination, medium, source]);

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Field label="Destination URL"><FormInput value={destination} onChange={(event) => setDestination(event.target.value)} /></Field>
        <Field label="UTM source"><FormInput value={source} onChange={(event) => setSource(event.target.value)} /></Field>
        <Field label="UTM medium"><FormInput value={medium} onChange={(event) => setMedium(event.target.value)} /></Field>
        <Field label="UTM campaign"><FormInput value={campaign} onChange={(event) => setCampaign(event.target.value)} /></Field>
        <Field label="UTM content"><FormInput value={content} onChange={(event) => setContent(event.target.value)} /></Field>
      </div>
      <div className="rounded-md bg-[#F8FAFC] p-3 text-sm text-[#0F172A] break-all">{url}</div>
      <CopyButton value={url} label="Copy URL" />
    </div>
  );
}
