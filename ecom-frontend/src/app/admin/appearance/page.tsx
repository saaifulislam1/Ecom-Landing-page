"use client";

import { useMemo, useState } from "react";
import { updateAdminTheme } from "@/lib/api";
import { AdminButton } from "@/components/admin/ui/AdminButton";
import { ColorSwatch } from "@/components/admin/ui/ColorSwatch";
import { Field, FormInput, FormSelect } from "@/components/admin/ui/AdminForm";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { ThemeCard } from "@/components/admin/ui/ThemeCard";

const adminThemes = [
  { id: "modern-blue", name: "Modern Blue", bestFor: "General Store", primary: "#2563EB", secondary: "#0F172A", accent: "#F97316", background: "#F8FAFC", surface: "#FFFFFF", text: "#0F172A", muted: "#64748B", border: "#E2E8F0" },
  { id: "beauty-pink", name: "Beauty Pink", bestFor: "Beauty", primary: "#EC4899", secondary: "#831843", accent: "#FBBF24", background: "#FFF7FB", surface: "#FFFFFF", text: "#3F0F2F", muted: "#8B5C75", border: "#FBCFE8" },
  { id: "organic-green", name: "Organic Green", bestFor: "Organic Food", primary: "#16A34A", secondary: "#14532D", accent: "#F97316", background: "#F7F8F2", surface: "#FFFFFF", text: "#1F2933", muted: "#6B7280", border: "#D9E6D2" },
  { id: "premium-black", name: "Premium Black", bestFor: "Luxury", primary: "#111827", secondary: "#000000", accent: "#D4AF37", background: "#FAFAF9", surface: "#FFFFFF", text: "#111827", muted: "#6B7280", border: "#E5E7EB" },
  { id: "bright-orange", name: "Bright Orange", bestFor: "Deals", primary: "#F97316", secondary: "#7C2D12", accent: "#2563EB", background: "#FFF7ED", surface: "#FFFFFF", text: "#1F2937", muted: "#6B7280", border: "#FED7AA" },
  { id: "warm-beige", name: "Warm Beige", bestFor: "Handmade/Boutique", primary: "#A16207", secondary: "#422006", accent: "#DC2626", background: "#FFFBEB", surface: "#FFFFFF", text: "#292524", muted: "#78716C", border: "#FDE68A" },
];

export default function AdminAppearancePage() {
  const [selectedThemeId, setSelectedThemeId] = useState(adminThemes[0].id);
  const selected = useMemo(() => adminThemes.find((theme) => theme.id === selectedThemeId) ?? adminThemes[0], [selectedThemeId]);
  const [headingFont, setHeadingFont] = useState("Inter");
  const [bodyFont, setBodyFont] = useState("Inter");
  const [layoutStyle, setLayoutStyle] = useState<"CLASSIC_ECOMMERCE" | "MODERN_GRID" | "BOUTIQUE" | "SINGLE_PRODUCT">("CLASSIC_ECOMMERCE");
  const [colors, setColors] = useState({
    primary: adminThemes[0].primary,
    secondary: adminThemes[0].secondary,
    accent: adminThemes[0].accent,
    background: adminThemes[0].background,
    surface: adminThemes[0].surface,
    text: adminThemes[0].text,
    muted: adminThemes[0].muted,
    border: adminThemes[0].border,
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function selectTheme(themeId: string) {
    const theme = adminThemes.find((item) => item.id === themeId) ?? adminThemes[0];
    setSelectedThemeId(theme.id);
    setColors({
      primary: theme.primary,
      secondary: theme.secondary,
      accent: theme.accent,
      background: theme.background,
      surface: theme.surface,
      text: theme.text,
      muted: theme.muted,
      border: theme.border,
    });
  }

  async function saveAppearance() {
    setMessage("");
    setError("");
    setSubmitting(true);
    try {
      await updateAdminTheme({
        themeName: selected.name,
        primaryColor: colors.primary,
        secondaryColor: colors.secondary,
        accentColor: colors.accent,
        backgroundColor: colors.background,
        surfaceColor: colors.surface,
        textColor: colors.text,
        mutedColor: colors.muted,
        borderColor: colors.border,
        headingFont,
        bodyFont,
        layoutStyle,
      });
      setMessage("Appearance saved successfully.");
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not save appearance.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <PageHeader title="Appearance" description="Choose storefront theme presets, custom colors, typography, layout style, and preview the result." />
      <div className="grid gap-6">
        <Panel title="Theme presets">
          <div className="mb-4">
            <Field label="Selected theme"><FormSelect value={selectedThemeId} onChange={(event) => selectTheme(event.target.value)}>{adminThemes.map((theme) => <option key={theme.id} value={theme.id}>{theme.name}</option>)}</FormSelect></Field>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {adminThemes.map((theme) => <ThemeCard key={theme.id} theme={theme} bestFor={theme.bestFor} selected={theme.id === selectedThemeId} onApply={() => selectTheme(theme.id)} />)}
          </div>
        </Panel>
        <div className="grid gap-6 xl:grid-cols-[1fr_440px]">
          <section className="space-y-6">
            <Panel title="Custom colors">
              <div className="grid gap-4 md:grid-cols-3">
                {[
                  ["primary", "Primary"],
                  ["secondary", "Secondary"],
                  ["accent", "Accent"],
                  ["background", "Background"],
                  ["text", "Text"],
                  ["border", "Border"],
                ].map(([key, label]) => <Field key={key} label={`${label} color`}><FormInput type="color" value={colors[key as keyof typeof colors]} onChange={(event) => setColors((current) => ({ ...current, [key]: event.target.value }))} /></Field>)}
              </div>
            </Panel>
            <Panel title="Typography">
              <div className="grid gap-4 md:grid-cols-2">
                <Field label="Heading font"><FormSelect value={headingFont} onChange={(event) => setHeadingFont(event.target.value)}>{["Inter", "Geist Sans", "Poppins", "Playfair Display", "Lora", "Manrope"].map((font) => <option key={font}>{font}</option>)}</FormSelect></Field>
                <Field label="Body font"><FormSelect value={bodyFont} onChange={(event) => setBodyFont(event.target.value)}>{["Inter", "Geist Sans", "Poppins", "Manrope"].map((font) => <option key={font}>{font}</option>)}</FormSelect></Field>
              </div>
            </Panel>
            <Panel title="Layout style">
              <div className="grid gap-3 md:grid-cols-2">
                {[
                  ["CLASSIC_ECOMMERCE", "Classic ecommerce"],
                  ["MODERN_GRID", "Modern grid"],
                  ["BOUTIQUE", "Boutique"],
                  ["SINGLE_PRODUCT", "Single product landing page"],
                ].map(([value, label]) => <label key={value} className="cursor-pointer rounded-md border border-[#E2E8F0] p-3 text-sm font-semibold"><input name="layout" type="radio" checked={layoutStyle === value} onChange={() => setLayoutStyle(value as typeof layoutStyle)} className="mr-2 cursor-pointer" />{label}</label>)}
              </div>
            </Panel>
          </section>
          <Panel title="Storefront preview">
            <div className="rounded-lg border p-4" style={{ backgroundColor: colors.background, borderColor: colors.border, color: colors.text }}>
              <div className="rounded-md p-4" style={{ backgroundColor: colors.surface }}>
                <div className="flex items-center justify-between"><strong>{selected.name}</strong><ColorSwatch color={colors.primary} /></div>
                <div className="mt-4 aspect-[16/9] rounded-md" style={{ backgroundColor: colors.primary }} />
                <h3 className="mt-4 text-lg font-black">Product card preview</h3>
                <p className="mt-1 text-sm" style={{ color: colors.muted }}>Color system preview using selected theme values.</p>
                <span className="mt-4 inline-flex rounded-md px-4 py-2 text-sm font-bold text-white" style={{ backgroundColor: colors.primary }}>Add to cart</span>
              </div>
            </div>
            <div className="mt-4 grid grid-cols-[120px_1fr] gap-4">
              <div className="rounded-lg border p-3" style={{ borderColor: colors.border, backgroundColor: colors.surface }}><div className="mx-auto h-44 w-20 rounded-md" style={{ backgroundColor: colors.background }} /></div>
              <p className="text-sm text-[#64748B]">Preview updates locally before saving to backend theme settings.</p>
            </div>
            <AdminButton className="mt-4" type="button" onClick={saveAppearance} disabled={submitting}>{submitting ? "Saving..." : "Save appearance"}</AdminButton>
            {message ? <p className="mt-3 text-sm font-semibold text-emerald-700">{message}</p> : null}
            {error ? <p className="mt-3 text-sm font-semibold text-red-600">{error}</p> : null}
          </Panel>
        </div>
      </div>
    </>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="space-y-4 rounded-lg border border-[#E2E8F0] bg-white p-5 shadow-sm"><h2 className="text-lg font-bold">{title}</h2>{children}</section>;
}
