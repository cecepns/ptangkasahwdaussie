import { useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, MessageCircle } from "lucide-react";
import Button from "@/components/ui/Button";
import { useContent } from "@/context/ContentContext";
import { resolveMediaUrl } from "@/utils/api";

export default function JobLightbox({ jobs, currentIndex, onClose, onNavigate }) {
  const { content } = useContent();
  const settings = content.settings;
  const job = jobs[currentIndex];
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < jobs.length - 1;

  const handleNavigate = useCallback(
    (direction) => {
      const next = currentIndex + direction;
      if (next >= 0 && next < jobs.length) onNavigate(next);
    },
    [currentIndex, jobs.length, onNavigate]
  );

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") handleNavigate(-1);
      if (e.key === "ArrowRight") handleNavigate(1);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKey);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [onClose, handleNavigate]);

  if (!job) return null;

  const whatsappMessage = `Hello ${settings.company_name}, I am interested in ${job.label} listed on your Job Opportunities page. Please provide more information.`;
  const whatsappUrl = `${settings.whatsapp?.href}?text=${encodeURIComponent(whatsappMessage)}`;
  const imageSrc = resolveMediaUrl(job.src) || job.src;

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Job opportunity detail"
    >
      <div
        className="relative w-full max-w-lg max-h-[90vh] flex flex-col rounded-2xl bg-white overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-white shrink-0">
          <div>
            <p className="font-bold text-gray-900">{job.label}</p>
            <p className="text-xs text-gray-500">
              {currentIndex + 1} of {jobs.length}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 bg-slate-50">
          <img
            src={imageSrc}
            alt={job.alt}
            className="w-full h-auto object-contain"
          />
        </div>

        <div className="flex items-center justify-between gap-3 px-4 py-3 border-t border-gray-100 bg-white shrink-0">
          <button
            type="button"
            onClick={() => handleNavigate(-1)}
            disabled={!hasPrev}
            className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Prev
          </button>

          <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
            <Button variant="secondary" size="sm">
              <MessageCircle className="w-4 h-4" />
              Apply via WhatsApp
            </Button>
          </a>

          <button
            type="button"
            onClick={() => handleNavigate(1)}
            disabled={!hasNext}
            className="flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg border border-gray-200 disabled:opacity-30 hover:bg-gray-50 transition-colors"
          >
            Next
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
