"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiRefreshCw, FiSave } from "react-icons/fi";
import { BackendMarketingSettings, BackendOrder, BackendProduct, updateAdminMarketingSettings } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import { AdminButton } from "@/components/admin/ui/AdminButton";
import { CopyButton } from "@/components/admin/ui/CopyButton";
import { DataTable } from "@/components/admin/ui/DataTable";
import { Field, FormInput, FormSelect } from "@/components/admin/ui/AdminForm";
import { StatCard } from "@/components/admin/ui/StatCard";
import { MarketingChecklist } from "@/components/admin/marketing/MarketingChecklist";
import { UTMBuilder } from "@/components/admin/marketing/UTMBuilder";

export function MarketingAdminClient({ products, orders, settings }: { products: BackendProduct[]; orders: BackendOrder[]; settings: BackendMarketingSettings | null }) {
  const router = useRouter();
  const [form, setForm] = useState({
    metaPixelId: settings?.metaPixelId ?? "",
    isPixelEnabled: settings?.isPixelEnabled ?? false,
    isCapiEnabled: settings?.isCapiEnabled ?? false,
    capiAccessToken: settings?.capiAccessToken ?? "",
    metaDatasetId: settings?.metaDatasetId ?? "",
    facebookPageUrl: settings?.facebookPageUrl ?? "",
    instagramProfileUrl: settings?.instagramProfileUrl ?? "",
    whatsappNumber: settings?.whatsappNumber ?? "",
    messengerLink: settings?.messengerLink ?? "",
    tiktokUrl: settings?.tiktokUrl ?? "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const campaignRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const feedUrl = `http://localhost:5001/api/v1/public/stores/demo-fashion-store/meta-product-feed.xml`;

  async function saveMarketing() {
    setMessage("");
    setError("");
    setSubmitting(true);
    try {
      await updateAdminMarketingSettings({
        ...form,
        metaPixelId: form.metaPixelId || null,
        capiAccessToken: form.capiAccessToken || null,
        metaDatasetId: form.metaDatasetId || null,
        facebookPageUrl: form.facebookPageUrl || null,
        instagramProfileUrl: form.instagramProfileUrl || null,
        whatsappNumber: form.whatsappNumber || null,
        messengerLink: form.messengerLink || null,
        tiktokUrl: form.tiktokUrl || null,
      });
      setMessage("Marketing settings saved successfully.");
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not save marketing settings.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid gap-6">
      <Panel title="Meta Pixel setup">
        <div className="grid gap-4 md:grid-cols-2 md:items-end">
          <Field label="Pixel ID"><FormInput value={form.metaPixelId} onChange={(event) => setForm((current) => ({ ...current, metaPixelId: event.target.value }))} placeholder="1234567890" /></Field>
          <Toggle label="Enable Meta Pixel" checked={form.isPixelEnabled} onChange={(value) => setForm((current) => ({ ...current, isPixelEnabled: value }))} />
        </div>
        <MarketingChecklist />
        <div className="rounded-md bg-[#F8FAFC] p-3 text-sm text-[#64748B]">Pixel status: {form.isPixelEnabled && form.metaPixelId ? "Configured" : "Not configured"}</div>
      </Panel>

      <Panel title="Conversions API">
        <div className="rounded-md bg-blue-50 p-3 text-sm text-blue-700">Required for server-side Purchase events: Dataset or Pixel ID, CAPI access token, and Enable server events.</div>
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Access token"><FormInput type="password" value={form.capiAccessToken} onChange={(event) => setForm((current) => ({ ...current, capiAccessToken: event.target.value }))} /></Field>
          <Field label="Dataset / Pixel ID"><FormInput value={form.metaDatasetId} onChange={(event) => setForm((current) => ({ ...current, metaDatasetId: event.target.value }))} /></Field>
        </div>
        <Toggle label="Enable server events" checked={form.isCapiEnabled} onChange={(value) => setForm((current) => ({ ...current, isCapiEnabled: value }))} />
        <p className="text-sm text-[#64748B]">CAPI status: {form.isCapiEnabled && form.capiAccessToken && (form.metaDatasetId || form.metaPixelId) ? "Configured for Purchase events" : "Not configured"}</p>
      </Panel>

      <Panel title="Product feed">
        <div className="grid gap-4 md:grid-cols-3">
          <StatCard label="Product count" value={String(products.length)} />
          <StatCard label="Feed source" value="Backend API" />
          <Field label="Feed format"><FormSelect defaultValue="XML"><option>XML</option><option>CSV</option></FormSelect></Field>
        </div>
        <div className="rounded-md bg-[#F8FAFC] p-3 text-sm break-all">{feedUrl}</div>
        <div className="flex flex-wrap gap-2"><CopyButton value={feedUrl} label="Copy feed URL" /><AdminButton type="button" variant="outline" onClick={() => router.refresh()}><FiRefreshCw aria-hidden="true" /> Refresh feed data</AdminButton></div>
      </Panel>

      <Panel title="Campaign Link Builder"><UTMBuilder /></Panel>

      <Panel title="Social channels">
        <div className="grid gap-4 md:grid-cols-2">
          <Field label="Facebook page URL"><FormInput value={form.facebookPageUrl} onChange={(event) => setForm((current) => ({ ...current, facebookPageUrl: event.target.value }))} placeholder="https://facebook.com/store" /></Field>
          <Field label="Instagram profile URL"><FormInput value={form.instagramProfileUrl} onChange={(event) => setForm((current) => ({ ...current, instagramProfileUrl: event.target.value }))} placeholder="https://instagram.com/store" /></Field>
          <Field label="WhatsApp number"><FormInput value={form.whatsappNumber} onChange={(event) => setForm((current) => ({ ...current, whatsappNumber: event.target.value }))} placeholder="+880..." /></Field>
          <Field label="Messenger link"><FormInput value={form.messengerLink} onChange={(event) => setForm((current) => ({ ...current, messengerLink: event.target.value }))} placeholder="https://m.me/store" /></Field>
          <Field label="TikTok URL optional"><FormInput value={form.tiktokUrl} onChange={(event) => setForm((current) => ({ ...current, tiktokUrl: event.target.value }))} placeholder="https://tiktok.com/@store" /></Field>
        </div>
        <AdminButton type="button" onClick={saveMarketing} disabled={submitting}><FiSave aria-hidden="true" />{submitting ? "Saving..." : "Save marketing settings"}</AdminButton>
        {message ? <p className="text-sm font-semibold text-emerald-700">{message}</p> : null}
        {error ? <p className="text-sm font-semibold text-red-600">{error}</p> : null}
      </Panel>

      <Panel title="Marketing reports">
        <div className="grid gap-4 md:grid-cols-5">
          <StatCard label="Facebook visitors" value="0" />
          <StatCard label="Instagram visitors" value="0" />
          <StatCard label="Campaign carts" value="0" />
          <StatCard label="Campaign orders" value={orders.length.toString()} />
          <StatCard label="Campaign revenue" value={formatCurrency(campaignRevenue)} />
        </div>
        <DataTable columns={["Campaign", "Source", "Orders", "Revenue"]}>
          <tr><td className="px-4 py-3 font-bold">Tracked orders</td><td className="px-4 py-3">Backend</td><td className="px-4 py-3">{orders.length}</td><td className="px-4 py-3">{formatCurrency(campaignRevenue)}</td></tr>
        </DataTable>
      </Panel>
    </div>
  );
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <label className="flex min-h-10 cursor-pointer items-center justify-between gap-3 rounded-md border border-[#E2E8F0] bg-white px-3 py-2 text-sm font-semibold text-[#0F172A]">
      <span>{label}</span>
      <span className={`relative inline-flex h-6 w-11 shrink-0 rounded-full transition ${checked ? "bg-[#2563EB]" : "bg-[#CBD5E1]"}`}>
        <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition ${checked ? "left-5" : "left-0.5"}`} />
      </span>
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className="sr-only" />
    </label>
  );
}

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="space-y-4 rounded-lg border border-[#E2E8F0] bg-white p-5 shadow-sm"><h2 className="text-lg font-bold">{title}</h2>{children}</section>;
}
