import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, ArrowUp } from "lucide-react";
import { COMPANY, NAV_LINKS } from "@/constants/company";
import { ASSETS } from "@/assets";

export default function Footer() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="bg-brand-dark text-white">
      <div className="section-container section-padding pb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          <div data-aos="fade-up" className="lg:col-span-1">
            <img
              src={ASSETS.logoFooter}
              alt={COMPANY.name}
              className="h-14 w-auto object-contain mb-4"
            />
            <p className="text-sm text-gray-400 leading-relaxed">
              {COMPANY.tagline}
            </p>
          </div>

          <div data-aos="fade-up" data-aos-delay="100">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div data-aos="fade-up" data-aos-delay="200">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-4">
              Contact
            </h3>
            <ul className="space-y-3">
              {COMPANY.emails.map((email) => (
                <li key={email}>
                  <a
                    href={`mailto:${email}`}
                    className="flex items-start gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    <Mail className="w-4 h-4 mt-0.5 shrink-0 text-brand-red" />
                    {email}
                  </a>
                </li>
              ))}
              {COMPANY.phones.map((phone) => (
                <li key={phone.number}>
                  <a
                    href={phone.href}
                    className="flex items-start gap-2 text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    <Phone className="w-4 h-4 mt-0.5 shrink-0 text-brand-blue" />
                    <span>
                      <span className="text-gray-500 text-xs block">{phone.label}</span>
                      {phone.number}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div data-aos="fade-up" data-aos-delay="300">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-gray-300 mb-4">
              Office
            </h3>
            <address className="not-italic text-sm text-gray-400 leading-relaxed">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5 shrink-0 text-brand-green" />
                <div>
                  <p className="font-medium text-gray-300 mb-1">{COMPANY.address.title}</p>
                  <p>{COMPANY.address.line1}</p>
                  <p>{COMPANY.address.line2}</p>
                  <p>{COMPANY.address.line3}</p>
                  <p>{COMPANY.address.city}</p>
                </div>
              </div>
            </address>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} {COMPANY.name}. All rights reserved.
          </p>
          <p className="text-sm text-gray-500">
            Director: <span className="text-gray-400">{COMPANY.director}</span>
          </p>
          <button
            type="button"
            onClick={scrollToTop}
            className="p-2.5 rounded-xl bg-white/10 hover:bg-white/20 transition-colors"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
