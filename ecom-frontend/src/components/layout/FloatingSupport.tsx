import { BsMessenger } from "react-icons/bs";
import { FaWhatsapp } from "react-icons/fa";

export function FloatingSupport() {
  return (
    <div className="fixed bottom-20 right-4 z-40 grid gap-2 md:bottom-5">
      <a
        href="https://wa.me/8801000000000"
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 rounded-full bg-green-600 px-4 py-3 text-sm font-bold text-white shadow-lg"
      >
        <FaWhatsapp aria-hidden="true" />
        WhatsApp
      </a>
      <a
        href="https://m.me/"
        target="_blank"
        rel="noreferrer"
        className="inline-flex items-center gap-2 rounded-full bg-[#0084FF] px-4 py-3 text-sm font-bold text-white shadow-lg transition hover:bg-[#006FE0]"
      >
        <BsMessenger aria-hidden="true" />
        Messenger
      </a>
    </div>
  );
}
