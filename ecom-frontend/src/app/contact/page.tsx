import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/FormControls";
import { SectionHeading } from "@/components/ui/SectionHeading";

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <SectionHeading title="Contact us" description="Reach store support by email, phone, WhatsApp, or Messenger." />
      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <form action="mailto:support@plugcommerce.test" method="post" encType="text/plain" className="space-y-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <label className="grid gap-2 text-sm font-semibold"><span>Name<span className="ml-1 text-red-600" aria-label="required">*</span></span><Input name="name" required /></label>
          <label className="grid gap-2 text-sm font-semibold"><span>Email<span className="ml-1 text-red-600" aria-label="required">*</span></span><Input name="email" type="email" required /></label>
          <label className="grid gap-2 text-sm font-semibold"><span>Message<span className="ml-1 text-red-600" aria-label="required">*</span></span><Textarea name="message" required /></label>
          <Button type="submit">Send message</Button>
        </form>
        <aside className="space-y-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <h2 className="text-xl font-bold">Store support</h2>
          <p className="text-sm text-[var(--color-muted)]">Phone: +880 1000 000000</p>
          <p className="text-sm text-[var(--color-muted)]">Email: support@plugcommerce.test</p>
          <p className="text-sm text-[var(--color-muted)]">Address: Dhaka, Bangladesh</p>
          <div className="flex flex-wrap gap-2 pt-2">
            <a href="https://wa.me/8801000000000" target="_blank" rel="noreferrer" className="rounded-md bg-green-600 px-4 py-2 text-sm font-bold text-white">WhatsApp</a>
            <a href="https://m.me/" target="_blank" rel="noreferrer" className="rounded-md bg-[var(--color-primary)] px-4 py-2 text-sm font-bold text-white">Messenger</a>
          </div>
        </aside>
      </div>
    </div>
  );
}
