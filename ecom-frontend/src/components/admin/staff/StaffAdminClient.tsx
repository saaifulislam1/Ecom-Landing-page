"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiMail, FiPlus, FiShield, FiUserCheck, FiUserX, FiUsers } from "react-icons/fi";
import { BackendStaffMember, StaffPayload, createAdminStaff, deleteAdminStaff, updateAdminStaff } from "@/lib/api";
import { AdminButton } from "@/components/admin/ui/AdminButton";
import { ConfirmModal } from "@/components/admin/ui/ConfirmModal";
import { Field, FormInput, FormSelect } from "@/components/admin/ui/AdminForm";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";

const roles: BackendStaffMember["role"][] = ["OWNER", "MANAGER", "DIGITAL_MARKETER", "MARKETING_OFFICER"];
const roleDescriptions: Record<BackendStaffMember["role"], string> = {
  OWNER: "Can access and manage everything.",
  MANAGER: "Can access and manage everything.",
  DIGITAL_MARKETER: "Can access Products and Marketing only.",
  MARKETING_OFFICER: "Can access everything except Staff.",
};
const roleScopes: Record<BackendStaffMember["role"], string[]> = {
  OWNER: ["All sections", "Staff", "Settings"],
  MANAGER: ["All sections", "Staff", "Settings"],
  DIGITAL_MARKETER: ["Products", "Marketing"],
  MARKETING_OFFICER: ["All except Staff", "Orders", "Settings"],
};

export function StaffAdminClient({ staff }: { staff: BackendStaffMember[] }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<BackendStaffMember["role"]>("DIGITAL_MARKETER");
  const [status, setStatus] = useState<BackendStaffMember["status"]>("ACTIVE");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setMessage("");
    setError("");
    setSubmitting(true);
    try {
      const payload: StaffPayload = { name: name.trim(), email: email.trim(), password, role, status };
      await createAdminStaff(payload);
      setName("");
      setEmail("");
      setPassword("");
      setRole("DIGITAL_MARKETER");
      setStatus("ACTIVE");
      setMessage("Staff account created successfully.");
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not add staff member.");
    } finally {
      setSubmitting(false);
    }
  }

  async function updateMember(member: BackendStaffMember, field: "role" | "status", value: string) {
    setMessage("");
    setError("");
    try {
      await updateAdminStaff(member.id, { [field]: value });
      setMessage("Staff member updated successfully.");
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not update staff member.");
    }
  }

  async function removeMember(staffId: string) {
    setMessage("");
    setError("");
    try {
      await deleteAdminStaff(staffId);
      setMessage("Staff member removed successfully.");
      router.refresh();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Could not remove staff member.");
    }
  }

  const activeCount = staff.filter((member) => member.status === "ACTIVE").length;
  const inactiveCount = staff.length - activeCount;
  const roleCounts = roles.map((item) => ({ role: item, count: staff.filter((member) => member.role === item).length }));

  return (
    <div className="grid gap-6">
      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard icon={<FiUsers />} label="Team members" value={String(staff.length)} />
        <SummaryCard icon={<FiUserCheck />} label="Active access" value={String(activeCount)} />
        <SummaryCard icon={<FiUserX />} label="Inactive access" value={String(inactiveCount)} />
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_380px]">
        <section className="space-y-5">
          <div className="grid gap-3 md:grid-cols-2 2xl:grid-cols-4">
            {roleCounts.map(({ role, count }) => (
              <article key={role} className="rounded-lg border border-[#E2E8F0] bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-black text-[#0F172A]">{formatRole(role)}</p>
                    <p className="mt-1 text-xs leading-5 text-[#64748B]">{roleDescriptions[role]}</p>
                  </div>
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-md bg-blue-50 text-sm font-black text-[#2563EB]">{count}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {roleScopes[role].map((scope) => <span key={scope} className="rounded-full bg-[#F8FAFC] px-2 py-1 text-[11px] font-bold text-[#64748B] ring-1 ring-[#E2E8F0]">{scope}</span>)}
                </div>
              </article>
            ))}
          </div>

          <div className="grid gap-4">
            {staff.length ? staff.map((member) => (
              <article key={member.id} className="rounded-lg border border-[#E2E8F0] bg-white p-4 shadow-sm">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-[#0F172A] text-sm font-black text-white">
                      {(member.user?.name ?? member.userId).slice(0, 1).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="break-words font-black text-[#0F172A]">{member.user?.name ?? member.userId}</h3>
                        <StatusBadge status={member.status} />
                      </div>
                      <p className="mt-1 flex items-center gap-1.5 break-all text-sm text-[#64748B]"><FiMail className="shrink-0" aria-hidden="true" />{member.user?.email ?? "No email"}</p>
                      <p className="mt-2 text-xs leading-5 text-[#64748B]">{roleDescriptions[member.role]}</p>
                    </div>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-[minmax(180px,1fr)_150px_auto] lg:w-[560px]">
                    <Field label="Role">
                      <FormSelect value={member.role} onChange={(event) => updateMember(member, "role", event.target.value)}>
                        {roles.map((item) => <option key={item} value={item}>{formatRole(item)}</option>)}
                      </FormSelect>
                    </Field>
                    <Field label="Status">
                      <FormSelect value={member.status} onChange={(event) => updateMember(member, "status", event.target.value)}>
                        <option value="ACTIVE">Active</option>
                        <option value="INACTIVE">Inactive</option>
                      </FormSelect>
                    </Field>
                    <div className="flex items-end">
                      <ConfirmModal title="Remove staff member" description="Remove this user from the store staff list?" confirmLabel="Remove" onConfirm={() => removeMember(member.id)} />
                    </div>
                  </div>
                </div>
              </article>
            )) : (
              <div className="rounded-lg border border-dashed border-[#CBD5E1] bg-white p-8 text-center">
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-lg bg-blue-50 text-[#2563EB]"><FiUsers aria-hidden="true" /></div>
                <h3 className="mt-4 font-black">No staff accounts yet</h3>
                <p className="mt-2 text-sm text-[#64748B]">Create the first staff account from the panel on the right.</p>
              </div>
            )}
          </div>
        </section>

      <form id="add-staff" onSubmit={submit} className="space-y-4 rounded-lg border border-[#E2E8F0] bg-white p-5 shadow-sm lg:sticky lg:top-24 lg:self-start">
        <div className="flex items-start gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-blue-50 text-[#2563EB]"><FiShield aria-hidden="true" /></div>
          <div>
            <h2 className="font-black">Create staff account</h2>
            <p className="mt-1 text-sm text-[#64748B]">Add login access and assign a role in one step.</p>
          </div>
        </div>
        <Field label="User name"><FormInput value={name} onChange={(event) => setName(event.target.value)} required /></Field>
        <Field label="Email"><FormInput type="email" value={email} onChange={(event) => setEmail(event.target.value)} required /></Field>
        <Field label="Temporary password"><FormInput type="password" minLength={6} value={password} onChange={(event) => setPassword(event.target.value)} required /></Field>
        <Field label="Role"><FormSelect value={role} onChange={(event) => setRole(event.target.value as BackendStaffMember["role"])} required>{roles.map((item) => <option key={item} value={item}>{formatRole(item)}</option>)}</FormSelect></Field>
        <div className="rounded-md bg-[#F8FAFC] p-3 text-xs leading-5 text-[#64748B]">
          <p className="font-bold text-[#0F172A]">{formatRole(role)}</p>
          <p>{roleDescriptions[role]}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">{roleScopes[role].map((scope) => <span key={scope} className="rounded-full bg-white px-2 py-1 font-bold ring-1 ring-[#E2E8F0]">{scope}</span>)}</div>
        </div>
        <Field label="Status"><FormSelect value={status} onChange={(event) => setStatus(event.target.value as BackendStaffMember["status"])} required><option value="ACTIVE">ACTIVE</option><option value="INACTIVE">INACTIVE</option></FormSelect></Field>
        <AdminButton type="submit" className="w-full" disabled={submitting}><FiPlus aria-hidden="true" />{submitting ? "Saving..." : "Create staff"}</AdminButton>
        <p className="text-sm text-[#64748B]">Share the temporary password with the staff member so they can log in.</p>
        {message ? <p className="text-sm font-semibold text-emerald-700">{message}</p> : null}
        {error ? <p className="text-sm font-semibold text-red-600">{error}</p> : null}
      </form>
      </div>
    </div>
  );
}

function SummaryCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <article className="rounded-lg border border-[#E2E8F0] bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[#64748B]">{label}</p>
          <p className="mt-1 text-2xl font-black text-[#0F172A]">{value}</p>
        </div>
        <div className="grid h-10 w-10 place-items-center rounded-lg bg-blue-50 text-[#2563EB]">{icon}</div>
      </div>
    </article>
  );
}

function formatRole(role: BackendStaffMember["role"]) {
  return role.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, (char) => char.toUpperCase());
}
