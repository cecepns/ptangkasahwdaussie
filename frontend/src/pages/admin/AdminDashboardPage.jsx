import { useEffect, useState } from "react";
import { Briefcase, FileText, Mail, Shield } from "lucide-react";
import { get } from "@/utils/request";
import { API_ENDPOINTS } from "@/utils/endpoints";
import { AdminPageHeader, AdminCard } from "@/components/admin/FormField";
import LoadingSpinner from "@/components/admin/LoadingSpinner";

const STAT_CARDS = [
  { key: "services", label: "Active Services", icon: FileText, color: "bg-brand-blue/10 text-brand-blue" },
  { key: "jobs", label: "Active Jobs", icon: Briefcase, color: "bg-brand-red/10 text-brand-red" },
  { key: "legal", label: "Legal Documents", icon: Shield, color: "bg-brand-green/10 text-brand-green" },
  { key: "newContacts", label: "New Messages", icon: Mail, color: "bg-amber-100 text-amber-700" },
];

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    get(API_ENDPOINTS.ADMIN.DASHBOARD).then((result) => {
      if (result.success && result.data?.success) {
        setStats(result.data.data);
      }
      setLoading(false);
    });
  }, []);

  if (loading) return <LoadingSpinner />;

  return (
    <div>
      <AdminPageHeader
        title="Dashboard"
        description="Overview of your website content and messages"
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {STAT_CARDS.map((card) => (
          <AdminCard key={card.key} className="p-6">
            <div className="flex items-center gap-4">
              <div className={`flex items-center justify-center w-12 h-12 rounded-xl ${card.color}`}>
                <card.icon className="w-6 h-6" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stats?.[card.key] ?? 0}</p>
                <p className="text-sm text-gray-500">{card.label}</p>
              </div>
            </div>
          </AdminCard>
        ))}
      </div>

      <AdminCard className="mt-6 p-6">
        <h2 className="font-bold text-gray-900 mb-2">Quick Guide</h2>
        <ul className="text-sm text-gray-600 space-y-2">
          <li>• <strong>Site Settings</strong> — Update company info, contact details, hero text, and SEO</li>
          <li>• <strong>Job Listings</strong> — Upload and manage job opportunity images</li>
          <li>• <strong>Legal Documents</strong> — Upload NIB, SK, NPWP files</li>
          <li>• <strong>Page Sections</strong> — Edit section titles and descriptions per page</li>
          <li>• <strong>Contact Inbox</strong> — View messages submitted from the contact form</li>
        </ul>
      </AdminCard>
    </div>
  );
}
