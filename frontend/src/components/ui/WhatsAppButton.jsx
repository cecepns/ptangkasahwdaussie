import { MessageCircle } from "lucide-react";
import { useContent } from "@/context/ContentContext";

export default function WhatsAppButton() {
  const { content } = useContent();
  const whatsapp = content.settings?.whatsapp;
  const whatsappUrl = `${whatsapp?.href}?text=${encodeURIComponent(whatsapp?.defaultMessage || "")}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/40 hover:bg-[#20BD5A] hover:scale-110 active:scale-95 transition-all duration-300 group"
    >
      <span className="absolute inset-0 rounded-full bg-[#25D366] max-sm:animate-none sm:animate-ping opacity-20" />
      <MessageCircle className="w-7 h-7 relative z-10" fill="currentColor" strokeWidth={0} />
      <span className="absolute right-full mr-3 px-3 py-1.5 text-sm font-medium text-white bg-gray-900 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none hidden sm:block">
        Chat on WhatsApp
      </span>
    </a>
  );
}
