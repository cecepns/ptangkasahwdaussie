export const API_CONFIG = {
  baseURL: import.meta.env.VITE_API_URL || "https://api.kingcreativestudio.my.id/api",
  uploadURL: import.meta.env.VITE_UPLOAD_URL || "https://api.kingcreativestudio.my.id",
};

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    PROFILE: "/auth/profile",
  },
  CONTENT: {
    PUBLIC: "/content",
  },
  CONTACT: {
    SUBMIT: "/contact",
  },
  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    SETTINGS: "/admin/settings",
    UPLOAD: "/admin/upload",
    SERVICES: "/admin/services",
    STATS: "/admin/stats",
    CONTENT_ITEMS: "/admin/content-items",
    PAGE_SECTIONS: "/admin/page-sections",
    LEGAL_DOCUMENTS: "/admin/legal-documents",
    JOB_LISTINGS: "/admin/job-listings",
    CONTACT_SUBMISSIONS: "/admin/contact-submissions",
    detail: (resource, id) => `/admin/${resource}/${id}`,
  },
};
