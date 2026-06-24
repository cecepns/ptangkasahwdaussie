import SplitSection from "@/components/ui/SplitSection";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";
import { Link } from "react-router-dom";
import { ASSETS } from "@/assets";
import BlurredBg from "@/components/ui/BlurredBg";
import { useContent, getSection } from "@/context/ContentContext";
import { getIcon } from "@/utils/icons";

export default function Services() {
  const { content } = useContent();
  const intro = getSection(content, "services", "intro");
  const gridHeader = getSection(content, "services", "grid_header");
  const cta = getSection(content, "services", "cta");
  const services = content.services || [];
  const bullets = content.contentItems?.service_bullets || [];

  return (
    <>
      <SplitSection
        badge={intro?.badge || "Our Services"}
        title={intro?.title || "Complete Document Solutions"}
        subtitle={intro?.subtitle || "From visa applications to document legalization, we provide end-to-end support for your journey to Australia."}
        image={ASSETS.images.phone}
        imageAlt="Mobile document services"
        bg="bg-slate-50"
        className="pt-28 lg:pt-32"
        reverse
      >
        <ul className="space-y-3 text-gray-600">
          {bullets.map((item, i) => (
            <li key={item.id || i} className="flex items-center gap-2">
              <span className={`w-1.5 h-1.5 rounded-full ${i % 3 === 0 ? "bg-brand-red" : i % 3 === 1 ? "bg-brand-blue" : "bg-brand-green"}`} />
              {item.title}
            </li>
          ))}
        </ul>
        <Button to="/contact" variant="secondary" className="mt-6">
          Free Consultation
        </Button>
      </SplitSection>

      <section className="relative section-padding bg-white overflow-x-clip">
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <BlurredBg src={ASSETS.bg.one} position="bottom-right" size="lg" />
        </div>
        <div className="section-container relative z-10">
          <SectionHeader
            badge={gridHeader?.badge || "What We Offer"}
            title={gridHeader?.title || "Services Tailored for You"}
            subtitle={gridHeader?.subtitle || "Every service is designed to simplify your document journey to Australia."}
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {services.map((service, index) => {
              const Icon = getIcon(service.icon);
              return (
                <div
                  key={service.id || service.title}
                  data-aos="fade-up"
                  data-aos-delay={index * 80}
                  className="group relative p-8 rounded-2xl bg-slate-50 border border-gray-100 card-hover"
                >
                  <div className="absolute top-0 left-8 w-12 h-1 rounded-b-full bg-gradient-to-r from-brand-red to-brand-blue opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-blue/10 to-brand-red/10 mb-6 group-hover:scale-110 transition-transform">
                    <Icon className="w-7 h-7 text-brand-blue" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {service.description}
                  </p>
                </div>
              );
            })}
          </div>

          <div data-aos="fade-up" className="mt-12 text-center">
            <p className="text-gray-600 mb-4">
              {cta?.subtitle || "Need help with your documents? We are here to assist you every step of the way."}
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 text-brand-blue font-semibold hover:underline"
            >
              Contact us for a free consultation
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
