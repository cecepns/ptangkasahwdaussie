import { useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { NAV_LINKS, COMPANY } from "@/constants/company";
import { ASSETS } from "@/assets";
import { useScrollPosition } from "@/hooks/useScroll";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const scrolled = useScrollPosition();
  const location = useLocation();
  const isHome = location.pathname === "/";
  const showSolidBg = !isHome || scrolled;

  const closeMobile = () => setMobileOpen(false);

  const navLinkClass = ({ isActive }) =>
    `block px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
      isActive
        ? "text-brand-blue bg-brand-blue/10"
        : "text-gray-700 hover:text-brand-blue hover:bg-brand-blue/5"
    }`;

  const mobileNavLinkClass = ({ isActive }) =>
    `block px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
      isActive
        ? "text-brand-blue bg-brand-blue/10"
        : "text-gray-700 hover:text-brand-blue hover:bg-brand-blue/5"
    }`;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        showSolidBg
          ? "bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100"
          : "bg-transparent"
      }`}
    >
      <nav className="section-container">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link
            to="/"
            onClick={closeMobile}
            className="flex items-center gap-3 group"
          >
            <img
              src={ASSETS.logo}
              alt={COMPANY.name}
              className="h-10 lg:h-12 w-auto object-contain"
            />
          </Link>

          <ul className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <NavLink to={link.href} className={navLinkClass}>
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <Link
            to="/contact"
            className="hidden lg:inline-flex items-center px-5 py-2.5 text-sm font-semibold text-white bg-brand-blue rounded-xl hover:bg-brand-blue/90 transition-colors shadow-lg shadow-brand-blue/20"
          >
            Get in Touch
          </Link>

          <button
            type="button"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="lg:hidden p-2 rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </nav>

      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          mobileOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="section-container pb-4 bg-white/95 backdrop-blur-md border-b border-gray-100">
          <ul className="flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <NavLink
                  to={link.href}
                  className={mobileNavLinkClass}
                  onClick={closeMobile}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
          </ul>
          <Link
            to="/contact"
            onClick={closeMobile}
            className="mt-2 flex items-center justify-center w-full px-5 py-3 text-sm font-semibold text-white bg-brand-blue rounded-xl"
          >
            Get in Touch
          </Link>
        </div>
      </div>
    </header>
  );
}
