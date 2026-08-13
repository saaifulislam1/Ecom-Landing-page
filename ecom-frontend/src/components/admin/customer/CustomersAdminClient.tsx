"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { FiEye } from "react-icons/fi";
import { BackendCustomer } from "@/lib/api";
import { formatCurrency } from "@/lib/format";
import { DataTable } from "@/components/admin/ui/DataTable";
import { Field, FormInput } from "@/components/admin/ui/AdminForm";
import { PageHeader } from "@/components/admin/ui/PageHeader";
import { StatusBadge } from "@/components/admin/ui/StatusBadge";

export function CustomersAdminClient({ customers }: { customers: BackendCustomer[] }) {
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) return customers;
    return customers.filter((customer) => [customer.name, customer.phone, customer.email ?? ""].some((value) => value.toLowerCase().includes(normalizedQuery)));
  }, [customers, query]);

  return (
    <>
      <PageHeader title="Customers" description="Customer profiles, spending, order history, and support tags." />
      <div className="mb-4 rounded-lg border border-[#E2E8F0] bg-white p-4">
        <Field label="Search customer"><FormInput value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name, phone, email" /></Field>
      </div>
      <DataTable columns={["Customer", "Phone", "Email", "Orders", "Total spent", "Last order", "Tag", "Action"]}>
        {filtered.map((customer) => (
          <tr key={customer.id}>
            <td className="px-4 py-3 font-bold">{customer.name}</td>
            <td className="px-4 py-3">{customer.phone}</td>
            <td className="px-4 py-3">{customer.email}</td>
            <td className="px-4 py-3">{customer.totalOrders}</td>
            <td className="px-4 py-3 price-text">{formatCurrency(customer.totalSpent)}</td>
            <td className="px-4 py-3">{new Date(customer.createdAt).toLocaleDateString()}</td>
            <td className="px-4 py-3"><StatusBadge status={customer.tags[0] ?? "New"} /></td>
            <td className="px-4 py-3"><Link href={`/admin/customers/${customer.id}`} className="inline-flex cursor-pointer items-center gap-1 font-semibold text-[#2563EB]"><FiEye aria-hidden="true" /> View customer</Link></td>
          </tr>
        ))}
      </DataTable>
    </>
  );
}
