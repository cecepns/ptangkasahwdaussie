import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/context/AuthContext";
import { ContentProvider } from "@/context/ContentContext";
import Layout from "@/components/layout/Layout";
import HomePage from "@/pages/HomePage";
import AboutPage from "@/pages/AboutPage";
import ServicesPage from "@/pages/ServicesPage";
import LegalitasPage from "@/pages/LegalitasPage";
import JobsPage from "@/pages/JobsPage";
import ContactPage from "@/pages/ContactPage";
import AdminLoginPage from "@/pages/admin/AdminLoginPage";
import AdminLayout from "@/components/admin/AdminLayout";
import ProtectedRoute from "@/components/admin/ProtectedRoute";
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import AdminSettingsPage from "@/pages/admin/AdminSettingsPage";
import AdminServicesPage from "@/pages/admin/AdminServicesPage";
import AdminStatsPage from "@/pages/admin/AdminStatsPage";
import AdminContentItemsPage from "@/pages/admin/AdminContentItemsPage";
import AdminPageSectionsPage from "@/pages/admin/AdminPageSectionsPage";
import AdminLegalDocumentsPage from "@/pages/admin/AdminLegalDocumentsPage";
import AdminJobsPage from "@/pages/admin/AdminJobsPage";
import AdminContactsPage from "@/pages/admin/AdminContactsPage";

export default function App() {
  return (
    <AuthProvider>
      <ContentProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="about" element={<AboutPage />} />
              <Route path="services" element={<ServicesPage />} />
              <Route path="legalitas" element={<LegalitasPage />} />
              <Route path="jobs" element={<JobsPage />} />
              <Route path="contact" element={<ContactPage />} />
            </Route>

            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/admin" element={<AdminLayout />}>
                <Route index element={<AdminDashboardPage />} />
                <Route path="settings" element={<AdminSettingsPage />} />
                <Route path="services" element={<AdminServicesPage />} />
                <Route path="stats" element={<AdminStatsPage />} />
                <Route path="content-items" element={<AdminContentItemsPage />} />
                <Route path="page-sections" element={<AdminPageSectionsPage />} />
                <Route path="legal-documents" element={<AdminLegalDocumentsPage />} />
                <Route path="jobs" element={<AdminJobsPage />} />
                <Route path="contacts" element={<AdminContactsPage />} />
              </Route>
            </Route>
          </Routes>
        </BrowserRouter>
      </ContentProvider>
    </AuthProvider>
  );
}
