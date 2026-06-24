import Hero from "@/components/sections/Hero";
import SplitSection from "@/components/ui/SplitSection";
import Button from "@/components/ui/Button";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { ASSETS } from "@/assets";
import BlurredBg from "@/components/ui/BlurredBg";
import { useContent, getSection } from "@/context/ContentContext";
import { getIcon } from "@/utils/icons";

export default function HomePage() {
  const { content } = useContent();
  const whyUs = getSection(content, "home", "why_choose_us");
  const explore = getSection(content, "home", "explore");
  const quickLinks = content.contentItems?.quick_links || [];

  return (
    <>
      <Hero />

      <SplitSection
        badge={whyUs?.badge || "Why Choose Us"}
        title={whyUs?.title || "Your Trusted Partner for Australian Documents"}
        subtitle={whyUs?.subtitle || "We specialize in helping Indonesian workers navigate the complex document requirements for working in Australia — with care, expertise, and transparency."}
        image={ASSETS.images.australianMap}
        imageAlt="Australia destination map"
        bg="bg-white"
        reverse
      >
        <p className="text-gray-600 leading-relaxed">
          {whyUs?.body || "With years of dedication to serving hardworking Indonesian workers, we understand every step of the document process and guide you through it with confidence."}
        </p>
        <Button to="/about" variant="outline" className="mt-4">
          Learn More
          <ArrowRight className="w-4 h-4" />
        </Button>
      </SplitSection>

      <section className="relative section-padding bg-slate-50 overflow-x-clip">
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <BlurredBg src={ASSETS.bg.one} position="top-left" size="md" />
          <BlurredBg src={ASSETS.bg.two} position="bottom-right" size="md" />
        </div>
        <div className="section-container relative z-10">
          <div data-aos="fade-up" className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-block px-4 py-1.5 mb-4 text-xs font-semibold tracking-widest uppercase rounded-full bg-brand-blue/10 text-brand-blue">
              {explore?.badge || "Explore"}
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              {explore?.title || "Everything You Need to Know"}
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickLinks.map((item, index) => {
              const Icon = getIcon(item.icon);
              return (
                <Link
                  key={item.id || item.href}
                  to={item.href}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                  className="group p-6 rounded-2xl bg-white border border-gray-100 card-hover"
                >
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-brand-blue/10 mb-4 group-hover:bg-brand-blue group-hover:text-white transition-colors text-brand-blue">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                  <span className="inline-flex items-center gap-1 mt-4 text-sm font-semibold text-brand-blue">
                    Read more <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>
    </>
  );
}
