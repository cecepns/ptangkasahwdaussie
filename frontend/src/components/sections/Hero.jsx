import { ArrowRight, Phone, FileCheck } from "lucide-react";
import { ASSETS } from "@/assets";
import Button from "@/components/ui/Button";
import BlurredBg from "@/components/ui/BlurredBg";
import { useIsDesktop } from "@/hooks/useAosAnimation";
import { useContent } from "@/context/ContentContext";

export default function Hero() {
  const isDesktop = useIsDesktop();
  const { content } = useContent();
  const settings = content.settings;
  const stats = content.stats || [];

  return (
    <section className="relative min-h-screen flex items-center overflow-x-clip bg-gradient-to-br from-slate-50 via-white to-blue-50/50">
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
        <BlurredBg src={ASSETS.bg.one} position="top-right" size="lg" opacity={0.06} />
        <BlurredBg src={ASSETS.bg.two} position="bottom-left" size="md" opacity={0.06} />
        <div className="absolute -top-40 -right-40 w-64 sm:w-96 h-64 sm:h-96 bg-brand-blue/5 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-64 sm:w-96 h-64 sm:h-96 bg-brand-red/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[min(100%,800px)] aspect-square bg-gradient-to-r from-brand-blue/[0.03] to-brand-red/[0.03] rounded-full blur-3xl" />
      </div>

      <div className="section-container relative z-10 pt-28 pb-16 lg:pt-32 lg:pb-24 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div
            data-aos="fade-up"
            data-aos-duration="800"
            data-aos-delay="100"
            className="order-2 lg:order-1"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-6 text-sm font-medium rounded-full bg-brand-blue/10 text-brand-blue border border-brand-blue/20">
              <FileCheck className="w-4 h-4" />
              {settings.hero_badge || "Trusted Document Solutions"}
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-gray-900 leading-[1.1]">
              {settings.hero_title || (
                <>
                  Your Journey to{" "}
                  <span className="gradient-text">Australia</span>{" "}
                  Starts Here
                </>
              )}
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-gray-600 leading-relaxed max-w-xl">
              {settings.tagline}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-4">
              <Button to="/contact" variant="primary" size="lg">
                Consult Now
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button to="/services" variant="outline" size="lg">
                Our Services
              </Button>
            </div>

            {settings.phones?.[0] && (
              <div
                data-aos="fade-up"
                data-aos-delay="300"
                className="mt-10 flex items-center gap-4 p-4 rounded-2xl bg-white/80 backdrop-blur border border-gray-100 shadow-sm max-w-md"
              >
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-brand-red/10">
                  <Phone className="w-5 h-5 text-brand-red" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">
                    Call Us Now
                  </p>
                  <a
                    href={settings.phones[0].href}
                    className="text-lg font-bold text-gray-900 hover:text-brand-blue transition-colors"
                  >
                    {settings.phones[0].number}
                  </a>
                </div>
              </div>
            )}
          </div>

          <div
            data-aos={isDesktop ? "fade-left" : "fade-up"}
            data-aos-duration="900"
            data-aos-delay="200"
            className="order-1 lg:order-2 relative"
          >
            <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
              <img
                src={ASSETS.images.australia}
                alt="Sydney Opera House Australia"
                className="w-full max-w-full h-auto object-contain"
              />
            </div>
          </div>
        </div>

        <div className="mt-16 lg:mt-24 grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, index) => (
            <div
              key={stat.id || stat.label}
              data-aos="fade-up"
              data-aos-delay={index * 100}
              className="text-center p-4 sm:p-6 rounded-2xl bg-white/60 backdrop-blur border border-gray-100"
            >
              <p className="text-2xl sm:text-3xl font-bold gradient-text">
                {stat.value}
              </p>
              <p className="mt-1 text-xs sm:text-sm text-gray-500 font-medium">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
