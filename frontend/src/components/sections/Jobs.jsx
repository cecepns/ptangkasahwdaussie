import { useState } from "react";
import { Briefcase, MessageCircle, ArrowRight } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import BlurredBg from "@/components/ui/BlurredBg";
import JobCard from "@/components/ui/JobCard";
import JobLightbox from "@/components/ui/JobLightbox";
import Button from "@/components/ui/Button";
import { JOB_LISTINGS } from "@/assets/jobs";
import { ASSETS } from "@/assets";
import { COMPANY } from "@/constants/company";

export default function Jobs() {
  const [lightboxIndex, setLightboxIndex] = useState(null);

  const whatsappUrl = `${COMPANY.whatsapp.href}?text=${encodeURIComponent(
    "Hello PT Angkasa HWD Aussie, I would like to inquire about job opportunities in Australia."
  )}`;

  return (
    <>
      <section className="relative section-padding bg-white pt-28 lg:pt-32 overflow-x-clip">
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <BlurredBg src={ASSETS.bg.one} position="top-right" size="lg" />
          <BlurredBg src={ASSETS.bg.two} position="bottom-left" size="md" />
        </div>

        <div className="section-container relative z-10">
          <SectionHeader
            badge="Job Opportunities"
            title="Job Required — Work in Australia"
            subtitle="Explore the latest job openings in Australia. Click any listing to view full details and apply through our team."
          />

          <div
            data-aos="fade-up"
            className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 mb-12 p-6 rounded-2xl bg-gradient-to-r from-brand-blue/5 to-brand-red/5 border border-gray-100"
          >
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-brand-blue text-white">
                <Briefcase className="w-7 h-7" />
              </div>
              <div className="text-center sm:text-left">
                <p className="text-3xl font-bold gradient-text">{JOB_LISTINGS.length}+</p>
                <p className="text-sm text-gray-600 font-medium">Active Job Listings</p>
              </div>
            </div>
            <div className="hidden sm:block w-px h-12 bg-gray-200" />
            <p className="text-sm text-gray-600 text-center sm:text-left max-w-md leading-relaxed">
              We connect dedicated Indonesian workers with trusted employers across Australia.
              Tap a card to view the full job posting.
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {JOB_LISTINGS.map((job, index) => (
              <JobCard
                key={job.id}
                job={job}
                index={index}
                onOpen={setLightboxIndex}
              />
            ))}
          </div>

          <div
            data-aos="fade-up"
            className="mt-16 p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-brand-blue to-brand-blue/90 text-white text-center"
          >
            <h3 className="text-xl sm:text-2xl font-bold mb-3">
              Interested in a Position?
            </h3>
            <p className="text-white/80 max-w-xl mx-auto mb-6 text-sm sm:text-base leading-relaxed">
              Contact our team for application guidance, document preparation, and full
              support on your journey to working in Australia.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="secondary" size="lg">
                  <MessageCircle className="w-5 h-5" />
                  Inquire via WhatsApp
                </Button>
              </a>
              <Button to="/contact" variant="outline" size="lg" className="!border-white !text-white hover:!bg-white hover:!text-brand-blue">
                Contact Us
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {lightboxIndex !== null && (
        <JobLightbox
          jobs={JOB_LISTINGS}
          currentIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
        />
      )}
    </>
  );
}
