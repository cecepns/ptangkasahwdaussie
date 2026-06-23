import { FileText, Download, ExternalLink, Shield, ImageIcon } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import BlurredBg from "@/components/ui/BlurredBg";
import { COMPANY } from "@/constants/company";
import { ASSETS } from "@/assets";

export default function Legalitas() {
  return (
    <section className="relative section-padding bg-white pt-28 lg:pt-32 overflow-x-clip">
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <BlurredBg src={ASSETS.bg.one} position="top-right" size="lg" />
        <BlurredBg src={ASSETS.bg.two} position="bottom-left" size="md" />
      </div>

      <div className="section-container relative z-10">
        <SectionHeader
          badge="Legalitas"
          title="Official Company Documents"
          subtitle="PT Angkasa HWD Aussie is a legally registered company. View our official business registration documents below."
        />

        <div className="max-w-5xl mx-auto">
          <div
            data-aos="fade-up"
            className="flex items-center gap-3 p-4 mb-8 rounded-2xl bg-brand-green/5 border border-brand-green/20"
          >
            <Shield className="w-6 h-6 text-brand-green shrink-0" />
            <p className="text-sm text-gray-700">
              All documents are official and issued by the relevant Indonesian government authorities.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {COMPANY.legalitas.map((doc, index) => {
              const isImage = doc.fileType === "image";
              const Icon = isImage ? ImageIcon : FileText;

              return (
                <div
                  key={doc.id}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                  className="group flex flex-col p-6 sm:p-8 rounded-2xl border border-gray-100 bg-white/80 backdrop-blur-sm card-hover"
                >
                  <div className="flex items-start gap-4 mb-4">
                    <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-red/10 shrink-0">
                      <Icon className="w-7 h-7 text-brand-red" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="inline-block px-2.5 py-0.5 mb-2 text-xs font-bold uppercase tracking-wider rounded-md bg-brand-blue/10 text-brand-blue">
                        {doc.type}
                      </span>
                      <h3 className="font-bold text-gray-900 mb-2 leading-snug">
                        {doc.title}
                      </h3>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {doc.description}
                      </p>
                    </div>
                  </div>

                  {isImage && (
                    <div className="mb-5 overflow-hidden rounded-xl border border-gray-100 bg-gray-50">
                      <img
                        src={doc.file}
                        alt={doc.title}
                        className="w-full h-40 sm:h-44 object-contain"
                      />
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3 mt-auto">
                    <a
                      href={doc.file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-brand-blue rounded-xl hover:bg-brand-blue/90 transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      {isImage ? "View Image" : "View PDF"}
                    </a>
                    <a
                      href={doc.file}
                      download
                      className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-brand-blue bg-white border border-brand-blue/30 rounded-xl hover:bg-brand-blue/5 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
