import { ArrowRight } from "lucide-react";
import { User, Target, Heart, Globe } from "lucide-react";
import SplitSection from "@/components/ui/SplitSection";
import SectionHeader from "@/components/ui/SectionHeader";
import Button from "@/components/ui/Button";
import { COMPANY } from "@/constants/company";
import { ASSETS } from "@/assets";
import BlurredBg from "@/components/ui/BlurredBg";

const VALUES = [
  {
    icon: Heart,
    title: "Genuine Care",
    description: "We sincerely care about every worker's journey and future abroad.",
  },
  {
    icon: Target,
    title: "Clear Mission",
    description: "Helping dedicated Indonesian workers find better livelihood in Australia.",
  },
  {
    icon: Globe,
    title: "Australia Focus",
    description: "Specialized expertise in Australian document and immigration requirements.",
  },
  {
    icon: User,
    title: "Personal Approach",
    description: "Founded by Mr. Hery Wardanu with a vision to serve honest, hardworking people.",
  },
];

export default function About() {
  return (
    <>
      <SplitSection
        badge="About Us"
        title="Building Bridges to a Better Future"
        subtitle="We are committed to helping Indonesian workers achieve their dreams of working abroad with complete, reliable document support."
        image={ASSETS.images.australianMap}
        imageAlt="Australia map"
        bg="bg-white"
        className="pt-28 lg:pt-32"
      >
        <blockquote className="text-base text-gray-700 leading-relaxed italic border-l-4 border-brand-blue pl-4">
          &ldquo;{COMPANY.about}&rdquo;
        </blockquote>
        <div className="mt-6 flex items-center gap-4">
          <div>
            <p className="font-bold text-gray-900">{COMPANY.director}</p>
            <p className="text-sm text-gray-500">Direktur Utama</p>
          </div>
        </div>
        <Button to="/contact" variant="primary" className="mt-6">
          Contact Us
          <ArrowRight className="w-4 h-4" />
        </Button>
      </SplitSection>

      <section className="relative section-padding bg-slate-50 overflow-x-clip">
        <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
          <BlurredBg src={ASSETS.bg.two} position="top-left" size="md" />
        </div>
        <div className="section-container relative z-10">
          <SectionHeader
            badge="Our Values"
            title="What We Stand For"
            subtitle="Guided by sincerity and dedication to every worker we serve."
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {VALUES.map((value, index) => (
              <div
                key={value.title}
                data-aos="fade-up"
                data-aos-delay={index * 80}
                className="p-6 rounded-2xl bg-white border border-gray-100 card-hover"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-brand-blue/10 mb-4">
                  <value.icon className="w-6 h-6 text-brand-blue" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{value.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-padding bg-white">
        <div className="section-container">
          <div
            data-aos="zoom-in"
            data-aos-duration="900"
            className="p-8 sm:p-10 rounded-3xl bg-gradient-to-r from-brand-blue to-brand-blue/90 text-white text-center"
          >
            <p className="text-sm font-semibold uppercase tracking-widest text-white/70 mb-3">
              Our Vision
            </p>
            <p className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-tight max-w-4xl mx-auto">
              &ldquo;{COMPANY.tagline}&rdquo;
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
