import SplitSection from "@/components/ui/SplitSection";
import ContactForm from "@/components/ui/ContactForm";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { COMPANY } from "@/constants/company";
import { ASSETS } from "@/assets";
import { useIsDesktop } from "@/hooks/useAosAnimation";

export default function Contact() {
  const isDesktop = useIsDesktop();

  return (
    <>
      <SplitSection
        badge="Contact Us"
        title="We Are Here to Help"
        subtitle="Have questions about your documents? Reach out to us and our team will assist you promptly."
        image={ASSETS.images.callCenter}
        imageAlt="Customer service ready to assist you"
        bg="bg-white"
        className="pt-28 lg:pt-32 overflow-x-clip"
      >
        <div className="space-y-3 text-sm text-gray-600">
          <p>
            <span className="font-semibold text-gray-900">Phone: </span>
            <a href={COMPANY.phones[0].href} className="hover:text-brand-blue">
              {COMPANY.phones[0].number}
            </a>
          </p>
          <p>
            <span className="font-semibold text-gray-900">Email: </span>
            <a href={`mailto:${COMPANY.emails[0]}`} className="hover:text-brand-blue break-all">
              {COMPANY.emails[0]}
            </a>
          </p>
          <p>
            <span className="font-semibold text-gray-900">Office: </span>
            {COMPANY.address.city}
          </p>
        </div>
      </SplitSection>

      <section className="section-padding bg-slate-50 overflow-x-clip">
        <div className="section-container">
          <div className="max-w-4xl mx-auto mb-10 text-center lg:hidden">
            <h2 className="text-2xl font-bold text-gray-900">Send a Message</h2>
            <p className="mt-2 text-sm text-gray-500">
              Fill out the form below and we will get back to you as soon as possible.
            </p>
          </div>

          <div className="grid lg:grid-cols-5 gap-10 lg:gap-12 items-start">
            <div
              className="lg:col-span-2 space-y-6"
              data-aos={isDesktop ? "fade-right" : "fade-up"}
            >
              <div className="p-6 rounded-2xl bg-white border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-brand-blue/10">
                    <Mail className="w-5 h-5 text-brand-blue" />
                  </div>
                  <h3 className="font-bold text-gray-900">Email</h3>
                </div>
                <ul className="space-y-2">
                  {COMPANY.emails.map((email) => (
                    <li key={email}>
                      <a
                        href={`mailto:${email}`}
                        className="text-sm text-gray-600 hover:text-brand-blue transition-colors break-all"
                      >
                        {email}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-brand-red/10">
                    <Phone className="w-5 h-5 text-brand-red" />
                  </div>
                  <h3 className="font-bold text-gray-900">Phone</h3>
                </div>
                <ul className="space-y-3">
                  {COMPANY.phones.map((phone) => (
                    <li key={phone.number}>
                      <a
                        href={phone.href}
                        className="block hover:text-brand-blue transition-colors"
                      >
                        <span className="text-xs text-gray-400 font-medium uppercase tracking-wide">
                          {phone.label}
                        </span>
                        <p className="text-sm font-semibold text-gray-800">
                          {phone.number}
                        </p>
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 rounded-2xl bg-white border border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-brand-green/10">
                    <MapPin className="w-5 h-5 text-brand-green" />
                  </div>
                  <h3 className="font-bold text-gray-900">{COMPANY.address.title}</h3>
                </div>
                <address className="not-italic text-sm text-gray-600 leading-relaxed">
                  <p>{COMPANY.address.line1}</p>
                  <p>{COMPANY.address.line2}</p>
                  <p>{COMPANY.address.line3}</p>
                  <p className="mt-1 font-medium text-gray-800">{COMPANY.address.city}</p>
                </address>
                <a
                  href={COMPANY.address.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block mt-4 text-sm font-semibold text-brand-blue hover:underline"
                >
                  View on Google Maps →
                </a>
              </div>

              <div className="p-6 rounded-2xl bg-gradient-to-r from-brand-blue to-brand-blue/90 text-white">
                <div className="flex items-center gap-3 mb-2">
                  <Clock className="w-5 h-5" />
                  <h3 className="font-bold">Office Hours</h3>
                </div>
                <p className="text-sm text-white/80">
                  Monday – Friday: 09:00 – 17:00 WIB
                </p>
                <p className="text-sm text-white/80 mt-1">
                  Saturday: 09:00 – 13:00 WIB
                </p>
              </div>
            </div>

            <div
              data-aos={isDesktop ? "fade-left" : "fade-up"}
              data-aos-delay="100"
              className="lg:col-span-3 h-fit self-start p-6 sm:p-8 rounded-2xl bg-white border border-gray-100 shadow-sm"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-1 hidden lg:block">
                Send a Message
              </h3>
              <p className="text-sm text-gray-500 mb-6 hidden lg:block">
                Fill out the form below and we will get back to you as soon as possible.
              </p>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
