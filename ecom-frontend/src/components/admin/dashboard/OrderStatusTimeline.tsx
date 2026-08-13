const steps = ["Pending", "Confirmed", "Processing", "Shipped", "Delivered"];

export function OrderStatusTimeline({ current = "Processing" }: { current?: string }) {
  const currentIndex = steps.indexOf(current);
  return (
    <ol className="space-y-4">
      {steps.map((step, index) => (
        <li key={step} className="flex gap-3">
          <span className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold ${index <= currentIndex ? "bg-[#2563EB] text-white" : "bg-[#F1F5F9] text-[#64748B]"}`}>
            {index + 1}
          </span>
          <div>
            <p className="font-semibold">{step}</p>
            <p className="text-xs text-[#64748B]">Dummy timeline status</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
