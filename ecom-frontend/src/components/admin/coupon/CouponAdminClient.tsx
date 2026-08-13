"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiPlus, FiSave, FiX } from "react-icons/fi";
import { BackendCoupon, CouponPayload, createAdminCoupon, deleteAdminCoupon, updateAdminCoupon } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import { AdminButton } from "@/components/admin/ui/AdminButton";
import { ConfirmModal } from "@/components/admin/ui/ConfirmModal";
import { DataTable } from "@/components/admin/ui/DataTable";
import { Field, FormInput, FormSelect } from "@/components/admin/ui/AdminForm";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";

const emptyForm: CouponPayload = {
  code: "",
  discountType: "PERCENTAGE",
  discountValue: 0,
  status: "ACTIVE",
};

export function CouponAdminClient({ coupons }: { coupons: BackendCoupon[] }) {
  const router = useRouter();
  const [form, setForm] = useState<CouponPayload>(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  function edit(coupon: BackendCoupon) {
    setEditingId(coupon.id);
    setForm({
      code: coupon.code,
      discountType: coupon.discountType as CouponPayload["discountType"],
      discountValue: Number(coupon.discountValue),
      ...(coupon.minOrderAmount != null ? { minOrderAmount: Number(coupon.minOrderAmount) } : {}),
      ...(coupon.usageLimit != null ? { usageLimit: Number(coupon.usageLimit) } : {}),
      ...(coupon.expiresAt ? { expiresAt: coupon.expiresAt.slice(0, 10) } : {}),
      status: coupon.status as CouponPayload["status"],
    });
  }

  function reset() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        code: form.code.trim().toUpperCase(),
        discountValue: Number(form.discountValue),
        ...(form.minOrderAmount != null && String(form.minOrderAmount) !== "" ? { minOrderAmount: Number(form.minOrderAmount) } : {}),
        ...(form.usageLimit != null && String(form.usageLimit) !== "" ? { usageLimit: Number(form.usageLimit) } : {}),
        ...(form.expiresAt ? { expiresAt: new Date(form.expiresAt).toISOString() } : {}),
      };
      if (editingId) {
        await updateAdminCoupon(editingId, payload);
        setMessage("Coupon updated successfully.");
      } else {
        await createAdminCoupon(payload);
        setMessage("Coupon created successfully.");
      }
      reset();
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not save coupon.");
    } finally {
      setSubmitting(false);
    }
  }

  async function remove(couponId: string) {
    await deleteAdminCoupon(couponId);
    router.refresh();
  }

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
      <DataTable columns={["Code", "Type", "Value", "Minimum", "Usage", "Expiry", "Status", "Actions"]}>
        {coupons.map((coupon) => (
          <tr key={coupon.id}>
            <td className="px-4 py-3 font-bold">{coupon.code}</td>
            <td className="px-4 py-3">{coupon.discountType}</td>
            <td className="px-4 py-3">{coupon.discountType === "PERCENTAGE" ? `${coupon.discountValue}%` : formatCurrency(coupon.discountValue)}</td>
            <td className="px-4 py-3">{formatCurrency(Number(coupon.minOrderAmount ?? 0))}</td>
            <td className="px-4 py-3">{coupon.usedCount}/{coupon.usageLimit ?? "Unlimited"}</td>
            <td className="px-4 py-3">{coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString() : "No expiry"}</td>
            <td className="px-4 py-3"><StatusBadge status={coupon.status} /></td>
            <td className="px-4 py-3">
              <div className="flex gap-3">
                <button type="button" className="cursor-pointer font-semibold text-[#2563EB]" onClick={() => edit(coupon)}>Edit</button>
                <ConfirmModal title="Delete coupon" description={`Delete coupon ${coupon.code}?`} confirmLabel="Delete" onConfirm={() => remove(coupon.id)} />
              </div>
            </td>
          </tr>
        ))}
      </DataTable>
      <form id="add-coupon" onSubmit={submit} className="space-y-4 rounded-lg border border-[#E2E8F0] bg-white p-5 shadow-sm lg:sticky lg:top-24 lg:self-start">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-bold">{editingId ? "Edit coupon" : "Add coupon"}</h2>
          {editingId ? <button type="button" className="cursor-pointer text-sm font-semibold text-[#64748B]" onClick={reset}><FiX aria-hidden="true" /></button> : null}
        </div>
        <Field label="Code"><FormInput value={form.code} onChange={(event) => setForm((current) => ({ ...current, code: event.target.value }))} placeholder="WELCOME10" required /></Field>
        <Field label="Discount type">
          <FormSelect value={form.discountType} onChange={(event) => setForm((current) => ({ ...current, discountType: event.target.value as CouponPayload["discountType"] }))} required>
            <option value="PERCENTAGE">Percentage</option>
            <option value="FIXED_AMOUNT">Fixed amount</option>
            <option value="FREE_SHIPPING">Free shipping</option>
          </FormSelect>
        </Field>
        <Field label="Discount value"><FormInput type="number" min="0" step="0.01" value={form.discountValue} onChange={(event) => setForm((current) => ({ ...current, discountValue: Number(event.target.value) }))} required /></Field>
        <Field label="Minimum order amount"><FormInput type="number" min="0" value={form.minOrderAmount ?? ""} onChange={(event) => setForm((current) => ({ ...current, minOrderAmount: event.target.value ? Number(event.target.value) : undefined }))} /></Field>
        <Field label="Usage limit"><FormInput type="number" min="1" value={form.usageLimit ?? ""} onChange={(event) => setForm((current) => ({ ...current, usageLimit: event.target.value ? Number(event.target.value) : undefined }))} /></Field>
        <Field label="Expiry date"><FormInput type="date" value={form.expiresAt ?? ""} onChange={(event) => setForm((current) => ({ ...current, expiresAt: event.target.value || undefined }))} /></Field>
        <Field label="Status">
          <FormSelect value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as CouponPayload["status"] }))} required>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </FormSelect>
        </Field>
        <AdminButton type="submit" disabled={submitting}>{editingId ? <FiSave aria-hidden="true" /> : <FiPlus aria-hidden="true" />}{submitting ? "Saving..." : editingId ? "Save coupon" : "Create coupon"}</AdminButton>
        {message ? <p className="text-sm font-semibold text-emerald-700">{message}</p> : null}
        {error ? <p className="text-sm font-semibold text-red-600">{error}</p> : null}
      </form>
    </div>
  );
}
