import { BsMessenger } from "react-icons/bs";
import { FaWhatsapp } from "react-icons/fa";

export function FloatingSupport({ whatsappNumber, messengerLink }: { whatsappNumber?: string | null; messengerLink?: string | null }) {
  const whatsappHref = whatsappNumber ? `https://wa.me/${whatsappNumber.replace(/\D/g, "")}` : null;
  if (!whatsappHref && !messengerLink) return null;

  return (
    <div className="fixed bottom-20 right-4 z-40 grid gap-2 md:bottom-5">
      {whatsappHref ? (
        <a
          href={whatsappHref}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-green-600 px-4 py-3 text-sm font-bold text-white shadow-lg"
        >
          <FaWhatsapp aria-hidden="true" />
          WhatsApp
        </a>
      ) : null}
      {messengerLink ? (
        <a
          href={messengerLink}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 rounded-full bg-[#0084FF] px-4 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-[#006FE0]"
        >
          <BsMessenger aria-hidden="true" />
          Messenger
        </a>
      ) : null}
    </div>
  );
}
