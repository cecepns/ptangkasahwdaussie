import { useState } from "react";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { post, put, del } from "@/utils/request";
import { API_ENDPOINTS } from "@/utils/endpoints";
import { useAdminList } from "@/hooks/useAdminList";
import { AdminPageHeader, AdminCard, FormField, inputClass, textareaClass, selectClass } from "@/components/admin/FormField";
import SearchInput from "@/components/admin/SearchInput";
import Pagination from "@/components/admin/Pagination";
import Modal from "@/components/admin/Modal";
import LoadingSpinner, { EmptyState } from "@/components/admin/LoadingSpinner";

const ICON_OPTIONS = ["FileText", "Plane", "Stamp", "Languages", "Users", "ShieldCheck", "Heart", "Target", "Globe", "User", "Briefcase", "Shield"];

const EMPTY = { icon: "FileText", title: "", description: "", sort_order: 0, is_active: 1 };

export default function AdminServicesPage() {
  const { data, pagination, loading, search, setSearch, page, setPage, limit, setLimit, refresh } =
    useAdminList(API_ENDPOINTS.ADMIN.SERVICES);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const openCreate = () => { setForm(EMPTY); setEditId(null); setModalOpen(true); };
  const openEdit = (item) => { setForm({ ...item, is_active: item.is_active ? 1 : 0 }); setEditId(item.id); setModalOpen(true); };

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    setSaving(true);
    const result = editId
      ? await put(`${API_ENDPOINTS.ADMIN.SERVICES}/${editId}`, form)
      : await post(API_ENDPOINTS.ADMIN.SERVICES, form);
    setSaving(false);
    if (result.success && result.data?.success) {
      toast.success(editId ? "Service updated" : "Service created");
      setModalOpen(false);
      refresh();
    } else {
      toast.error(result.error || "Failed to save");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this service?")) return;
    const result = await del(`${API_ENDPOINTS.ADMIN.SERVICES}/${id}`);
    if (result.success) { toast.success("Deleted"); refresh(); }
    else toast.error(result.error);
  };

  return (
    <div>
      <AdminPageHeader
        title="Services"
        description="Manage service cards displayed on the Services page"
        action={
          <button type="button" onClick={openCreate} className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-brand-blue rounded-xl hover:bg-brand-blue/90">
            <Plus className="w-4 h-4" /> Add Service
          </button>
        }
      />

      <AdminCard className="p-4 sm:p-6">
        <div className="mb-4"><SearchInput value={search} onChange={setSearch} placeholder="Search services..." /></div>
        {loading ? <LoadingSpinner /> : data.length === 0 ? <EmptyState /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-gray-500">
                  <th className="pb-3 pr-4 font-medium">Icon</th>
                  <th className="pb-3 pr-4 font-medium">Title</th>
                  <th className="pb-3 pr-4 font-medium hidden md:table-cell">Description</th>
                  <th className="pb-3 pr-4 font-medium">Order</th>
                  <th className="pb-3 font-medium text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map((item) => (
                  <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                    <td className="py-3 pr-4">{item.icon}</td>
                    <td className="py-3 pr-4 font-medium text-gray-900">{item.title}</td>
                    <td className="py-3 pr-4 text-gray-600 hidden md:table-cell max-w-xs truncate">{item.description}</td>
                    <td className="py-3 pr-4">{item.sort_order}</td>
                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button type="button" onClick={() => openEdit(item)} className="p-2 rounded-lg hover:bg-gray-100 text-gray-600"><Pencil className="w-4 h-4" /></button>
                        <button type="button" onClick={() => handleDelete(item.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-500"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        <Pagination pagination={pagination} page={page} setPage={setPage} limit={limit} setLimit={setLimit} />
      </AdminCard>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? "Edit Service" : "Add Service"}>
        <div className="space-y-4">
          <FormField label="Icon">
            <select className={selectClass} value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })}>
              {ICON_OPTIONS.map((icon) => <option key={icon} value={icon}>{icon}</option>)}
            </select>
          </FormField>
          <FormField label="Title" required>
            <input className={inputClass} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </FormField>
          <FormField label="Description">
            <textarea className={textareaClass} rows={3} value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </FormField>
          <FormField label="Sort Order">
            <input type="number" className={inputClass} value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value, 10) || 0 })} />
          </FormField>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={!!form.is_active} onChange={(e) => setForm({ ...form, is_active: e.target.checked ? 1 : 0 })} />
            Active
          </label>
          <button type="button" onClick={handleSave} disabled={saving} className="w-full flex items-center justify-center gap-2 py-3 text-sm font-semibold text-white bg-brand-blue rounded-xl hover:bg-brand-blue/90 disabled:opacity-60">
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}
            {editId ? "Update" : "Create"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
