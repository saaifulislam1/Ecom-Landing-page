"use client";

import { useMemo, useState } from "react";
import { FiCheckCircle, FiExternalLink, FiSave } from "react-icons/fi";
import { AdminButton } from "@/components/admin/ui/AdminButton";
import { Field, FormInput, FormSelect, FormTextarea } from "@/components/admin/ui/AdminForm";
import {
  BackendStore,
  BackendStoreSettings,
  BackendTheme,
  BackendMarketingSettings,
  updateAdminStore,
  updateAdminMarketingSettings,
  updateAdminStoreSettings,
  updateAdminTheme,
} from "@/lib/api";

const fallbackStore: BackendStore = {
  id: "",
  name: "Demo Fashion Store",
  slug: "demo-fashion-store",
  email: "support@demo.test",
  phone: "+8801000000000",
  address: "Dhaka, Bangladesh",
  currency: "BDT",
};

const fallbackSettings: BackendStoreSettings = {
  enableCOD: true,
  enableBkash: false,
  enableNagad: false,
  enableBankTransfer: false,
  minimumOrderAmount: 0,
  insideCityDeliveryCharge: 80,
  outsideCityDeliveryCharge: 140,
  freeDeliveryMinAmount: null,
};

const fallbackTheme: BackendTheme = {
  themeName: "Modern Blue",
  primaryColor: "#111827",
  secondaryColor: "#047857",
  accentColor: "#F97316",
  backgroundColor: "#F7F7F2",
  surfaceColor: "#FFFFFF",
  textColor: "#111827",
  mutedColor: "#6B7280",
  borderColor: "#E5E7EB",
  headingFont: "Manrope",
  bodyFont: "Manrope",
  layoutStyle: "CLASSIC_ECOMMERCE",
};

export function OnboardingSetupForm({
  initialStore,
  initialSettings,
  initialTheme,
  initialMarketing,
}: {
  initialStore: BackendStore | null;
  initialSettings: BackendStoreSettings | null;
  initialTheme: BackendTheme | null;
  initialMarketing: BackendMarketingSettings | null;
}) {
  const [store, setStore] = useState(initialStore ?? fallbackStore);
  const [settings, setSettings] = useState(initialSettings ?? fallbackSettings);
  const [theme, setTheme] = useState(initialTheme ?? fallbackTheme);
  const [marketing, setMarketing] = useState<BackendMarketingSettings>(initialMarketing ?? {});
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const steps = useMemo(
    () => [
      { label: "Store name", done: Boolean(store.name.trim()) },
      { label: "Logo URL", done: Boolean(store.logo?.trim()) },
      { label: "Theme colors", done: Boolean(theme.primaryColor && theme.secondaryColor) },
      { label: "Delivery charges", done: Number(settings.insideCityDeliveryCharge) >= 0 && Number(settings.outsideCityDeliveryCharge) >= 0 },
      { label: "Payment methods", done: settings.enableCOD || settings.enableBkash || settings.enableNagad || settings.enableBankTransfer },
      { label: "Social links", done: Boolean(marketing.facebookPageUrl || marketing.instagramProfileUrl || marketing.whatsappNumber) },
      { label: "Publish store", done: Boolean(store.name.trim() && store.email?.trim()) },
    ],
    [store, settings, theme, marketing],
  );

  function updateStoreField(field: keyof BackendStore, value: string) {
    setStore((current) => ({ ...current, [field]: value }));
  }

  function updateSettingsField(field: keyof BackendStoreSettings, value: string | boolean) {
    setSettings((current) => ({ ...current, [field]: value }));
  }

  function updateThemeField(field: keyof BackendTheme, value: string) {
    setTheme((current) => ({ ...current, [field]: value }));
  }

  async function save() {
    setStatus("saving");
    setErrorMessage("");
    try {
      await Promise.all([
        updateAdminStore({
          name: store.name,
          logo: store.logo,
          email: store.email,
          phone: store.phone,
          address: store.address,
          currency: store.currency,
        }),
        updateAdminStoreSettings({
          enableCOD: settings.enableCOD,
          enableBkash: settings.enableBkash,
          enableNagad: settings.enableNagad,
          enableBankTransfer: settings.enableBankTransfer,
          minimumOrderAmount: Number(settings.minimumOrderAmount ?? 0),
          insideCityDeliveryCharge: Number(settings.insideCityDeliveryCharge),
          outsideCityDeliveryCharge: Number(settings.outsideCityDeliveryCharge),
          freeDeliveryMinAmount: settings.freeDeliveryMinAmount ? Number(settings.freeDeliveryMinAmount) : undefined,
        }),
        updateAdminTheme({ ...fallbackTheme, ...theme }),
        updateAdminMarketingSettings({
          facebookPageUrl: marketing.facebookPageUrl ?? "",
          instagramProfileUrl: marketing.instagramProfileUrl ?? "",
          whatsappNumber: marketing.whatsappNumber ?? "",
        }),
      ]);
      setStatus("saved");
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Save failed.");
      setStatus("error");
    }
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[320px_1fr]">
      <aside className="rounded-lg border border-[#E2E8F0] bg-white p-5 shadow-sm">
        <ol className="space-y-4">
          {steps.map((step, index) => (
            <li key={step.label} className="flex items-center gap-3 text-sm">
              <span className={`grid h-7 w-7 place-items-center rounded-full ${step.done ? "bg-[#047857] text-white" : "bg-[#F1F5F9] text-[#64748B]"}`}>
                {step.done ? <FiCheckCircle /> : index + 1}
              </span>
              <span className="font-semibold">{step.label}</span>
            </li>
          ))}
        </ol>
      </aside>

      <section className="space-y-6 rounded-lg border border-[#E2E8F0] bg-white p-5 shadow-sm">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Store name"><FormInput value={store.name} onChange={(event) => updateStoreField("name", event.target.value)} required /></Field>
          <Field label="Currency"><FormSelect value={store.currency} onChange={(event) => updateStoreField("currency", event.target.value)} required><option>BDT</option><option>USD</option></FormSelect></Field>
          <Field label="Store logo URL"><FormInput value={store.logo ?? ""} onChange={(event) => updateStoreField("logo", event.target.value)} /></Field>
          <Field label="Store email"><FormInput value={store.email ?? ""} onChange={(event) => updateStoreField("email", event.target.value)} /></Field>
          <Field label="Store phone"><FormInput value={store.phone ?? ""} onChange={(event) => updateStoreField("phone", event.target.value)} /></Field>
          <Field label="Theme name"><FormInput value={theme.themeName} onChange={(event) => updateThemeField("themeName", event.target.value)} required /></Field>
        </div>

        <Field label="Store address"><FormTextarea value={store.address ?? ""} onChange={(event) => updateStoreField("address", event.target.value)} /></Field>

        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Primary button color"><FormInput type="color" value={theme.primaryColor} onChange={(event) => updateThemeField("primaryColor", event.target.value)} required /></Field>
          <Field label="Secondary button color"><FormInput type="color" value={theme.secondaryColor} onChange={(event) => updateThemeField("secondaryColor", event.target.value)} required /></Field>
          <Field label="Accent color"><FormInput type="color" value={theme.accentColor} onChange={(event) => updateThemeField("accentColor", event.target.value)} required /></Field>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Inside city delivery charge"><FormInput type="number" value={settings.insideCityDeliveryCharge} onChange={(event) => updateSettingsField("insideCityDeliveryCharge", event.target.value)} required /></Field>
          <Field label="Outside city delivery charge"><FormInput type="number" value={settings.outsideCityDeliveryCharge} onChange={(event) => updateSettingsField("outsideCityDeliveryCharge", event.target.value)} required /></Field>
          <Field label="Minimum order amount"><FormInput type="number" value={settings.minimumOrderAmount ?? 0} onChange={(event) => updateSettingsField("minimumOrderAmount", event.target.value)} /></Field>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {[
            ["enableCOD", "Cash on Delivery"],
            ["enableBkash", "bKash"],
            ["enableNagad", "Nagad"],
            ["enableBankTransfer", "Bank Transfer"],
          ].map(([field, label]) => (
            <label key={field} className="flex items-center justify-between gap-3 rounded-md border border-[#E2E8F0] bg-white p-3 text-sm font-medium">
              {label}
              <input
                type="checkbox"
                checked={Boolean(settings[field as keyof BackendStoreSettings])}
                onChange={(event) => updateSettingsField(field as keyof BackendStoreSettings, event.target.checked)}
                className="h-5 w-5 accent-[#047857]"
              />
            </label>
          ))}
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Field label="Facebook URL"><FormInput value={marketing.facebookPageUrl ?? ""} onChange={(event) => setMarketing((current) => ({ ...current, facebookPageUrl: event.target.value }))} /></Field>
          <Field label="Instagram URL"><FormInput value={marketing.instagramProfileUrl ?? ""} onChange={(event) => setMarketing((current) => ({ ...current, instagramProfileUrl: event.target.value }))} /></Field>
          <Field label="WhatsApp number"><FormInput value={marketing.whatsappNumber ?? ""} onChange={(event) => setMarketing((current) => ({ ...current, whatsappNumber: event.target.value }))} /></Field>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <AdminButton type="button" disabled={status === "saving"} onClick={save}>
            <FiSave /> {status === "saving" ? "Saving..." : "Save setup"}
          </AdminButton>
          <a href="/" target="_blank" className="inline-flex h-10 items-center gap-2 rounded-md border border-[#E2E8F0] bg-white px-4 text-sm font-semibold text-[#0F172A]">
            <FiExternalLink /> View storefront
          </a>
          {status === "saved" ? <span className="text-sm font-semibold text-emerald-700">Setup saved.</span> : null}
          {status === "error" ? <span className="text-sm font-semibold text-red-600">{errorMessage}</span> : null}
        </div>
      </section>
    </div>
  );
}
