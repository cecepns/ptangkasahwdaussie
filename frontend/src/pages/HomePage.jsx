import Hero from "@/components/sections/Hero";
import SplitSection from "@/components/ui/SplitSection";
import Button from "@/components/ui/Button";
import { Link } from "react-router-dom";
import { ArrowRight, Users, FileCheck, Shield, Briefcase } from "lucide-react";
import { ASSETS } from "@/assets";
import BlurredBg from "@/components/ui/BlurredBg";

const QUICK_LINKS = [
  {
    icon: Users,
    title: "About Us",
    description: "Learn about our mission and the people behind PT Angkasa HWD Aussie.",
    href: "/about",
  },
  {
    icon: FileCheck,
    title: "Our Services",
    description: "Explore complete document solutions for your journey to Australia.",
    href: "/services",
  },
  {
    icon: Shield,
    title: "Legalitas",
    description: "View our official business registration and company documents.",
    href: "/legalitas",
  },
  {
    icon: Briefcase,
    title: "Job Opportunities",
    description: "Browse current job openings and requirements for working in Australia.",
    href: "/jobs",
  },
];

export default function HomePage() {
  return (
    <>
      <Hero />

      <SplitSection
        badge="Why Choose Us"
        title="Your Trusted Partner for Australian Documents"
        subtitle="We specialize in helping Indonesian workers navigate the complex document requirements for working in Australia — with care, expertise, and transparency."
        image={ASSETS.images.australianMap}
        imageAlt="Australia destination map"
        bg="bg-white"
        reverse
      >
        <p className="text-gray-600 leading-relaxed">
          With years of dedication to serving hardworking Indonesian workers, we understand
          every step of the document process and guide you through it with confidence.
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
          <div
            data-aos="fade-up"
            className="text-center max-w-2xl mx-auto mb-12"
          >
            <span className="inline-block px-4 py-1.5 mb-4 text-xs font-semibold tracking-widest uppercase rounded-full bg-brand-blue/10 text-brand-blue">
              Explore
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Everything You Need to Know
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {QUICK_LINKS.map((item, index) => (
              <Link
                key={item.href}
                to={item.href}
                data-aos="fade-up"
                data-aos-delay={index * 100}
                className="group p-6 rounded-2xl bg-white border border-gray-100 card-hover"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-brand-blue/10 mb-4 group-hover:bg-brand-blue group-hover:text-white transition-colors text-brand-blue">
                  <item.icon className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
                <span className="inline-flex items-center gap-1 mt-4 text-sm font-semibold text-brand-blue">
                  Read more <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
