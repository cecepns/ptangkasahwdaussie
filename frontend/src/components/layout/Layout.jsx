import { Outlet } from "react-router-dom";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollToTop from "@/components/layout/ScrollToTop";
import ScrollProgress from "@/components/layout/ScrollProgress";
import WhatsAppButton from "@/components/ui/WhatsAppButton";

export default function Layout() {
  return (
    <div className="min-h-screen w-full overflow-x-clip">
      <ScrollToTop />
      <ScrollProgress />
      <Navbar />
      <main className="w-full">
        <Outlet />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}
