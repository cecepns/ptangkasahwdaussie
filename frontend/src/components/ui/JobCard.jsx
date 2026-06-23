import { Maximize2, MapPin } from "lucide-react";

export default function JobCard({ job, index, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(index)}
      data-aos="fade-up"
      data-aos-delay={(index % 6) * 60}
      className="group text-left w-full rounded-2xl overflow-hidden border border-gray-100 bg-white shadow-sm card-hover focus:outline-none focus:ring-2 focus:ring-brand-blue/40"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-slate-100">
        <img
          src={job.src}
          alt={job.alt}
          loading="lazy"
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 text-xs font-semibold text-brand-blue opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow">
          <Maximize2 className="w-3.5 h-3.5" />
          View
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between gap-2">
          <p className="font-semibold text-gray-900 text-sm">{job.label}</p>
          <span className="shrink-0 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-md bg-brand-red/10 text-brand-red">
            AU
          </span>
        </div>
        <p className="mt-1.5 flex items-center gap-1 text-xs text-gray-500">
          <MapPin className="w-3 h-3 shrink-0" />
          Australia Job Opening
        </p>
      </div>
    </button>
  );
}
