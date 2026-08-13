export function DataTable({
  columns,
  children,
}: {
  columns: string[];
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-lg border border-[#E2E8F0] bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[760px] text-left text-sm">
          <thead className="bg-[#F8FAFC] text-xs uppercase text-[#64748B]">
            <tr>{columns.map((column) => <th key={column} className="px-4 py-3 font-bold">{column}</th>)}</tr>
          </thead>
          <tbody className="divide-y divide-[#E2E8F0]">{children}</tbody>
        </table>
      </div>
    </div>
  );
}
