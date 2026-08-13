"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiSave } from "react-icons/fi";
import { BackendStore, BackendStoreSettings, updateAdminStore, updateAdminStoreSettings } from "@/lib/api";
import { AdminButton } from "@/components/admin/ui/AdminButton";
import { Field, FormInput, FormSelect, FormTextarea } from "@/components/admin/ui/AdminForm";

export function SettingsForm({ store, settings }: { store: BackendStore | null; settings: BackendStoreSettings | null }) {
  const router = useRouter();
  const [storeForm, setStoreForm] = useState({
    name: store?.name ?? "",
    logo: store?.logo ?? "",
    email: store?.email ?? "",
    phone: store?.phone ?? "",
    address: store?.address ?? "",
    currency: store?.currency ?? "BDT",
  });
  const [settingsForm, setSettingsForm] = useState({
    enableCOD: settings?.enableCOD ?? true,
    enableBkash: settings?.enableBkash ?? false,
    enableNagad: settings?.enableNagad ?? false,
    enableBankTransfer: settings?.enableBankTransfer ?? false,
    minimumOrderAmount: settings?.minimumOrderAmount ?? "",
    insideCityDeliveryCharge: settings?.insideCityDeliveryCharge ?? 80,
    outsideCityDeliveryCharge: settings?.outsideCityDeliveryCharge ?? 140,
    freeDeliveryMinAmount: settings?.freeDeliveryMinAmount ?? "",
    refundPolicy: settings?.refundPolicy ?? "",
    privacyPolicy: settings?.privacyPolicy ?? "",
    termsAndConditions: settings?.termsAndConditions ?? "",
    homepageSeoTitle: settings?.homepageSeoTitle ?? "",
    homepageSeoDescription: settings?.homepageSeoDescription ?? "",
    ogImage: settings?.ogImage ?? "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");
    setSubmitting(true);
    try {
      await Promise.all([
        updateAdminStore(storeForm),
        updateAdminStoreSettings({
          ...settingsForm,
          minimumOrderAmount: settingsForm.minimumOrderAmount === "" ? null : Number(settingsForm.minimumOrderAmount),
          freeDeliveryMinAmount: settingsForm.freeDeliveryMinAmount === "" ? null : Number(settingsForm.freeDeliveryMinAmount),
          insideCityDeliveryCharge: Number(settingsForm.insideCityDeliveryCharge),
          outsideCityDeliveryCharge: Number(settingsForm.outsideCityDeliveryCharge),
        }),
      ]);
      setMessage("Settings saved successfully.");
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not save settings.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-6 xl:grid-cols-2">
      <Panel title="Store information">
        <Field label="Store name"><FormInput value={storeForm.name} onChange={(event) => setStoreForm((current) => ({ ...current, name: event.target.value }))} required /></Field>
        <Field label="Store logo URL"><FormInput value={storeForm.logo} onChange={(event) => setStoreForm((current) => ({ ...current, logo: event.target.value }))} placeholder="https://..." /></Field>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Store email"><FormInput type="email" value={storeForm.email} onChange={(event) => setStoreForm((current) => ({ ...current, email: event.target.value }))} /></Field>
          <Field label="Store phone"><FormInput value={storeForm.phone} onChange={(event) => setStoreForm((current) => ({ ...current, phone: event.target.value }))} /></Field>
        </div>
        <Field label="Store address"><FormTextarea value={storeForm.address} onChange={(event) => setStoreForm((current) => ({ ...current, address: event.target.value }))} /></Field>
        <Field label="Currency"><FormSelect value={storeForm.currency} onChange={(event) => setStoreForm((current) => ({ ...current, currency: event.target.value }))} required><option>BDT</option><option>USD</option></FormSelect></Field>
      </Panel>
      <Panel title="Checkout settings">
        <Toggle label="Enable Cash on Delivery" checked={settingsForm.enableCOD} onChange={(value) => setSettingsForm((current) => ({ ...current, enableCOD: value }))} />
        <Toggle label="Enable bKash" checked={settingsForm.enableBkash} onChange={(value) => setSettingsForm((current) => ({ ...current, enableBkash: value }))} />
        <Toggle label="Enable Nagad" checked={settingsForm.enableNagad} onChange={(value) => setSettingsForm((current) => ({ ...current, enableNagad: value }))} />
        <Toggle label="Enable Bank Transfer" checked={settingsForm.enableBankTransfer} onChange={(value) => setSettingsForm((current) => ({ ...current, enableBankTransfer: value }))} />
        <Field label="Minimum order amount"><FormInput type="number" min="0" value={settingsForm.minimumOrderAmount} onChange={(event) => setSettingsForm((current) => ({ ...current, minimumOrderAmount: event.target.value }))} /></Field>
      </Panel>
      <Panel title="Delivery settings">
        <Field label="Inside city delivery charge"><FormInput type="number" min="0" value={settingsForm.insideCityDeliveryCharge} onChange={(event) => setSettingsForm((current) => ({ ...current, insideCityDeliveryCharge: Number(event.target.value) }))} required /></Field>
        <Field label="Outside city delivery charge"><FormInput type="number" min="0" value={settingsForm.outsideCityDeliveryCharge} onChange={(event) => setSettingsForm((current) => ({ ...current, outsideCityDeliveryCharge: Number(event.target.value) }))} required /></Field>
        <Field label="Free delivery minimum amount"><FormInput type="number" min="0" value={settingsForm.freeDeliveryMinAmount} onChange={(event) => setSettingsForm((current) => ({ ...current, freeDeliveryMinAmount: event.target.value }))} /></Field>
      </Panel>
      <Panel title="Policy settings">
        <Field label="Refund policy"><FormTextarea value={settingsForm.refundPolicy} onChange={(event) => setSettingsForm((current) => ({ ...current, refundPolicy: event.target.value }))} /></Field>
        <Field label="Privacy policy"><FormTextarea value={settingsForm.privacyPolicy} onChange={(event) => setSettingsForm((current) => ({ ...current, privacyPolicy: event.target.value }))} /></Field>
        <Field label="Terms and conditions"><FormTextarea value={settingsForm.termsAndConditions} onChange={(event) => setSettingsForm((current) => ({ ...current, termsAndConditions: event.target.value }))} /></Field>
      </Panel>
      <Panel title="SEO settings">
        <Field label="Homepage meta title"><FormInput value={settingsForm.homepageSeoTitle} onChange={(event) => setSettingsForm((current) => ({ ...current, homepageSeoTitle: event.target.value }))} /></Field>
        <Field label="Homepage meta description"><FormTextarea value={settingsForm.homepageSeoDescription} onChange={(event) => setSettingsForm((current) => ({ ...current, homepageSeoDescription: event.target.value }))} /></Field>
        <Field label="Open Graph image URL"><FormInput value={settingsForm.ogImage} onChange={(event) => setSettingsForm((current) => ({ ...current, ogImage: event.target.value }))} placeholder="https://..." /></Field>
        <div className="flex flex-wrap items-center gap-3">
          <AdminButton type="submit" disabled={submitting}><FiSave aria-hidden="true" />{submitting ? "Saving..." : "Save settings"}</AdminButton>
          {message ? <p className="text-sm font-semibold text-emerald-700">{message}</p> : null}
          {error ? <p className="text-sm font-semibold text-red-600">{error}</p> : null}
        </div>
      </Panel>
    </form>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-3 rounded-md border border-[#E2E8F0] bg-white p-3 text-sm font-medium">
      {label}
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="h-5 w-5 cursor-pointer accent-[#2563EB]" />
    </label>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="space-y-4 rounded-lg border border-[#E2E8F0] bg-white p-5 shadow-sm"><h2 className="text-lg font-bold">{title}</h2>{children}</section>;
}
