import { ASSETS } from "@/assets";

export const COMPANY = {
  name: "PT Angkasa HWD Aussie",
  shortName: "Angkasa HWD Aussie",
  tagline: "The Reliable Solution for your documents on your journey to AUSSIE",
  director: "Hery Wardanu",
  emails: [
    "ptangkasahwdaussie@gmail.com",
    "angkasahwdaussie@gmail.com",
    "hwdaussie@gmail.com",
  ],
  phones: [
    { label: "Indonesia", number: "+62 823-1302-3434", href: "tel:+6282313023434" },
    { label: "Australia", number: "+61 468 293 119", href: "tel:+61468293119" },
  ],
  whatsapp: {
    number: "6282313023434",
    href: "https://wa.me/6282313023434",
    defaultMessage:
      "Hello PT Angkasa HWD Aussie, I would like to inquire about your document services.",
  },
  address: {
    title: "Kantor Pusat",
    line1: "Gedung Veteran RI, Graha Purna Yudha, Lantai VI",
    line2: "Jalan Jenderal Sudirman Kav. 50, Karet Semanggi",
    line3: "RT. 1 / RW 4, Kecamatan Setia Budi",
    city: "Kota Jakarta Selatan, DKI Jakarta 12930",
    full: "Gedung Veteran RI, Graha Purna Yudha, Lantai VI, Jalan Jenderal Sudirman Kav. 50, Karet Semanggi, RT. 1 / RW 4, Kecamatan Setia Budi, Kota Jakarta Selatan, DKI Jakarta 12930",
    mapsUrl:
      "https://www.google.com/maps/search/Gedung+Veteran+RI+Graha+Purna+Yudha+Jakarta+Selatan",
  },
  about: `A genuine and sincere objective of Mr. Hery Wardanu in founding PT. Angkasa HWD Aussie is to provide and assist dedicated, hard-working, honest Indonesian workers in order to find better livelihood abroad, particularly in Australia.`,
  officeImages: [
    {
      src: ASSETS.gedung.vet1,
      alt: "Gedung Graha Purna Yudha — Kantor Pusat",
    },
    {
      src: ASSETS.gedung.vet3,
      alt: "Gedung Veteran RI — Graha Purna Yudha",
    },
  ],
  legalitas: [
    {
      id: "nib",
      title: "NIB PT. Angkasa HWD Aussie",
      description: "Nomor Induk Berusaha (NIB) — legal business registration certificate.",
      file: ASSETS.legalitas.nib,
      type: "NIB",
      fileType: "pdf",
    },
    {
      id: "sk",
      title: "SK PT Angkasa HWD Aussie",
      description: "Surat Keputusan (SK) — official company establishment decree.",
      file: ASSETS.legalitas.sk,
      type: "SK",
      fileType: "pdf",
    },
    {
      id: "npwp",
      title: "NPWP PT. Angkasa HWD Aussie",
      description: "Nomor Pokok Wajib Pajak (NPWP) — official tax identification card.",
      file: ASSETS.legalitas.npwp,
      type: "NPWP",
      fileType: "image",
    },
  ],
};

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Legalitas", href: "/legalitas" },
  { label: "Jobs", href: "/jobs" },
  { label: "Contact", href: "/contact" },
];

export const SERVICES = [
  {
    icon: "FileText",
    title: "Document Processing",
    description:
      "Complete assistance for all travel and work-related documents required for your journey to Australia.",
  },
  {
    icon: "Plane",
    title: "Visa & Work Permit",
    description:
      "Guidance and support for visa applications, work permits, and immigration requirements.",
  },
  {
    icon: "Stamp",
    title: "Document Legalization",
    description:
      "Official legalization and authentication of certificates, diplomas, and personal documents.",
  },
  {
    icon: "Languages",
    title: "Translation Services",
    description:
      "Certified translation of documents between Indonesian and English for official submissions.",
  },
  {
    icon: "Users",
    title: "Worker Consultation",
    description:
      "Personalized consultation for Indonesian workers seeking better opportunities in Australia.",
  },
  {
    icon: "ShieldCheck",
    title: "Compliance Support",
    description:
      "Ensure all your documents meet Australian immigration and employer requirements.",
  },
];

export const STATS = [
  { value: "100%", label: "Dedicated Service" },
  { value: "AU", label: "Australia Focus" },
  { value: "24/7", label: "Support Ready" },
  { value: "Legal", label: "Registered Company" },
];
