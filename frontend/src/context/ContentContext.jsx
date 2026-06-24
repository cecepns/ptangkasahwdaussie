import { createContext, useContext, useEffect, useState } from "react";
import { get } from "@/utils/request";
import { API_ENDPOINTS } from "@/utils/endpoints";
import { COMPANY, SERVICES, STATS, NAV_LINKS } from "@/constants/company";
import { JOB_LISTINGS } from "@/assets/jobs";

const ContentContext = createContext(null);

const FALLBACK = {
  settings: {
    company_name: COMPANY.name,
    short_name: COMPANY.shortName,
    tagline: COMPANY.tagline,
    director: COMPANY.director,
    director_title: "Direktur Utama",
    about: COMPANY.about,
    emails: COMPANY.emails,
    phones: COMPANY.phones,
    whatsapp: COMPANY.whatsapp,
    address: { ...COMPANY.address, buildingTitle: "Gedung Graha Purna Yudha" },
    office_hours: [
      { days: "Monday – Friday", hours: "09:00 – 17:00 WIB" },
      { days: "Saturday", hours: "09:00 – 13:00 WIB" },
    ],
    office_images: COMPANY.officeImages.map((img) => ({
      src: img.src,
      alt: img.alt,
    })),
    seo_title: "PT Angkasa HWD Aussie — Document Services for Australia",
    seo_description: COMPANY.tagline,
    hero_badge: "Trusted Document Solutions",
    hero_title: "Your Journey to Australia Starts Here",
  },
  services: SERVICES,
  stats: STATS,
  contentItems: {
    values: [
      { icon: "Heart", title: "Genuine Care", description: "We sincerely care about every worker's journey and future abroad." },
      { icon: "Target", title: "Clear Mission", description: "Helping dedicated Indonesian workers find better livelihood in Australia." },
      { icon: "Globe", title: "Australia Focus", description: "Specialized expertise in Australian document and immigration requirements." },
      { icon: "User", title: "Personal Approach", description: "Founded by Mr. Hery Wardanu with a vision to serve honest, hardworking people." },
    ],
    quick_links: [
      { icon: "Users", title: "About Us", description: "Learn about our mission and the people behind PT Angkasa HWD Aussie.", href: "/about" },
      { icon: "FileCheck", title: "Our Services", description: "Explore complete document solutions for your journey to Australia.", href: "/services" },
      { icon: "Shield", title: "Legalitas", description: "View our official business registration and company documents.", href: "/legalitas" },
      { icon: "Briefcase", title: "Job Opportunities", description: "Browse current job openings and requirements for working in Australia.", href: "/jobs" },
    ],
    service_bullets: [
      { title: "Visa & work permit assistance" },
      { title: "Document legalization & translation" },
      { title: "Personalized worker consultation" },
    ],
  },
  pageSections: {},
  legalDocuments: COMPANY.legalitas.map((doc) => ({
    doc_type: doc.type,
    title: doc.title,
    description: doc.description,
    file_url: doc.file,
    file_type: doc.fileType,
  })),
  jobListings: JOB_LISTINGS.map((job, i) => ({
    id: job.id,
    title: job.label,
    image_url: job.src,
    alt_text: job.alt,
    location: "Australia",
    status: "active",
  })),
  navLinks: NAV_LINKS,
};

export function ContentProvider({ children }) {
  const [content, setContent] = useState(FALLBACK);
  const [loading, setLoading] = useState(true);
  const [fromApi, setFromApi] = useState(false);

  useEffect(() => {
    get(API_ENDPOINTS.CONTENT.PUBLIC).then((result) => {
      if (result.success && result.data?.success && result.data.data) {
        const apiData = result.data.data;
        setContent((prev) => ({
          ...prev,
          ...apiData,
          settings: {
            ...prev.settings,
            ...apiData.settings,
            office_images:
              apiData.settings?.office_images?.length > 0
                ? apiData.settings.office_images
                : prev.settings.office_images,
          },
          jobListings:
            apiData.jobListings?.length > 0 ? apiData.jobListings : prev.jobListings,
          legalDocuments:
            apiData.legalDocuments?.some((d) => d.file_url)
              ? apiData.legalDocuments
              : prev.legalDocuments,
          navLinks: NAV_LINKS,
        }));
        setFromApi(true);
      }
      setLoading(false);
    });
  }, []);

  return (
    <ContentContext.Provider value={{ content, loading, fromApi }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  const ctx = useContext(ContentContext);
  if (!ctx) throw new Error("useContent must be used within ContentProvider");
  return ctx;
}

export function getSection(content, page, key) {
  return content.pageSections?.[page]?.[key] || null;
}
