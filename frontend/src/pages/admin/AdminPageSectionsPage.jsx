import { useState } from "react";
import { Pencil, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { put } from "@/utils/request";
import { API_ENDPOINTS } from "@/utils/endpoints";
import { useAdminList } from "@/hooks/useAdminList";
import { AdminPageHeader, AdminCard, FormField, inputClass, textareaClass } from "@/components/admin/FormField";
import SearchInput from "@/components/admin/SearchInput";
import Pagination from "@/components/admin/Pagination";
import Modal from "@/components/admin/Modal";
import LoadingSpinner, { EmptyState } from "@/components/admin/LoadingSpinner";

export default function AdminPageSectionsPage() {
  const { data, pagination, loading, search, setSearch, page, setPage, limit, setLimit, refresh } =
    useAdminList(API_ENDPOINTS.ADMIN.PAGE_SECTIONS, { defaultLimit: 25 });
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);

  const openEdit = (item) => { setForm({ ...item }); setModalOpen(true); };

  const handleSave = async () => {
    setSaving(true);
    const result = await put(`${API_ENDPOINTS.ADMIN.PAGE_SECTIONS}/${form.id}`, {
      badge: form.badge,
      title: form.title,
      subtitle: form.subtitle,
      body: form.body,
      sort_order: form.sort_order,
      is_active: form.is_active ? 1 : 0,
    });
    setSaving(false);
    if (result.success && result.data?.success) { toast.success("Section updated"); setModalOpen(false); refresh(); }
    else toast.error(result.error || "Failed to save");
  };

  return (
    <div>
      <AdminPageHeader title="Page Sections" description="Edit section headers and content for each page" />
      <AdminCard className="p-4 sm:p-6">
        <div className="mb-4"><SearchInput value={search} onChange={setSearch} placeholder="Search by page or title..." /></div>
        {loading ? <LoadingSpinner /> : data.length === 0 ? <EmptyState /> : (
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100 text-left text-gray-500">
              <th className="pb-3 pr-4">Page</th><th className="pb-3 pr-4">Section</th><th className="pb-3 pr-4">Title</th><th className="pb-3 text-right">Actions</th>
            </tr></thead>
            <tbody>{data.map((item) => (
              <tr key={item.id} className="border-b border-gray-50">
                <td className="py-3 pr-4"><span className="px-2 py-0.5 rounded-md bg-gray-100 text-xs font-medium">{item.page}</span></td>
                <td className="py-3 pr-4 text-gray-500">{item.section_key}</td>
                <td className="py-3 pr-4 font-medium">{item.title || item.badge || "—"}</td>
                <td className="py-3 text-right">
                  <button type="button" onClick={() => openEdit(item)} className="p-2 rounded-lg hover:bg-gray-100"><Pencil className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}</tbody>
          </table>
        )}
        <Pagination pagination={pagination} page={page} setPage={setPage} limit={limit} setLimit={setLimit} />
      </AdminCard>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={`Edit: ${form.page} / ${form.section_key}`} size="lg">
        <div className="space-y-4">
          <FormField label="Badge"><input className={inputClass} value={form.badge || ""} onChange={(e) => setForm({ ...form, badge: e.target.value })} /></FormField>
          <FormField label="Title"><input className={inputClass} value={form.title || ""} onChange={(e) => setForm({ ...form, title: e.target.value })} /></FormField>
          <FormField label="Subtitle"><textarea className={textareaClass} rows={3} value={form.subtitle || ""} onChange={(e) => setForm({ ...form, subtitle: e.target.value })} /></FormField>
          <FormField label="Body"><textarea className={textareaClass} rows={3} value={form.body || ""} onChange={(e) => setForm({ ...form, body: e.target.value })} /></FormField>
          <button type="button" onClick={handleSave} disabled={saving} className="w-full py-3 text-sm font-semibold text-white bg-brand-blue rounded-xl disabled:opacity-60 flex items-center justify-center gap-2">
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}Update Section
          </button>
        </div>
      </Modal>
    </div>
  );
}
