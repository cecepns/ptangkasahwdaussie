import { useState } from "react";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { post, put, del } from "@/utils/request";
import { API_ENDPOINTS } from "@/utils/endpoints";
import { useAdminList } from "@/hooks/useAdminList";
import { AdminPageHeader, AdminCard, FormField, inputClass, selectClass } from "@/components/admin/FormField";
import SearchInput from "@/components/admin/SearchInput";
import Pagination from "@/components/admin/Pagination";
import Modal from "@/components/admin/Modal";
import LoadingSpinner, { EmptyState } from "@/components/admin/LoadingSpinner";

const EMPTY = { value: "", label: "", sort_order: 0, is_active: 1 };

export default function AdminStatsPage() {
  const { data, pagination, loading, search, setSearch, page, setPage, limit, setLimit, refresh } =
    useAdminList(API_ENDPOINTS.ADMIN.STATS);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const openCreate = () => { setForm(EMPTY); setEditId(null); setModalOpen(true); };
  const openEdit = (item) => { setForm({ ...item, is_active: item.is_active ? 1 : 0 }); setEditId(item.id); setModalOpen(true); };

  const handleSave = async () => {
    if (!form.value.trim() || !form.label.trim()) { toast.error("Value and label are required"); return; }
    setSaving(true);
    const result = editId ? await put(`${API_ENDPOINTS.ADMIN.STATS}/${editId}`, form) : await post(API_ENDPOINTS.ADMIN.STATS, form);
    setSaving(false);
    if (result.success && result.data?.success) {
      toast.success(editId ? "Stat updated" : "Stat created");
      setModalOpen(false);
      refresh();
    } else toast.error(result.error || "Failed to save");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this stat?")) return;
    const result = await del(`${API_ENDPOINTS.ADMIN.STATS}/${id}`);
    if (result.success) { toast.success("Deleted"); refresh(); }
    else toast.error(result.error);
  };

  return (
    <div>
      <AdminPageHeader title="Hero Stats" description="Manage stat cards on the homepage hero section"
        action={<button type="button" onClick={openCreate} className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-brand-blue rounded-xl hover:bg-brand-blue/90"><Plus className="w-4 h-4" /> Add Stat</button>}
      />
      <AdminCard className="p-4 sm:p-6">
        <div className="mb-4"><SearchInput value={search} onChange={setSearch} /></div>
        {loading ? <LoadingSpinner /> : data.length === 0 ? <EmptyState /> : (
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100 text-left text-gray-500">
              <th className="pb-3 pr-4">Value</th><th className="pb-3 pr-4">Label</th><th className="pb-3 pr-4">Order</th><th className="pb-3 text-right">Actions</th>
            </tr></thead>
            <tbody>{data.map((item) => (
              <tr key={item.id} className="border-b border-gray-50">
                <td className="py-3 pr-4 font-bold gradient-text">{item.value}</td>
                <td className="py-3 pr-4">{item.label}</td>
                <td className="py-3 pr-4">{item.sort_order}</td>
                <td className="py-3 text-right">
                  <button type="button" onClick={() => openEdit(item)} className="p-2 rounded-lg hover:bg-gray-100"><Pencil className="w-4 h-4" /></button>
                  <button type="button" onClick={() => handleDelete(item.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-500"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}</tbody>
          </table>
        )}
        <Pagination pagination={pagination} page={page} setPage={setPage} limit={limit} setLimit={setLimit} />
      </AdminCard>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? "Edit Stat" : "Add Stat"}>
        <div className="space-y-4">
          <FormField label="Value" required><input className={inputClass} value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} /></FormField>
          <FormField label="Label" required><input className={inputClass} value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })} /></FormField>
          <FormField label="Sort Order"><input type="number" className={inputClass} value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value, 10) || 0 })} /></FormField>
          <button type="button" onClick={handleSave} disabled={saving} className="w-full py-3 text-sm font-semibold text-white bg-brand-blue rounded-xl disabled:opacity-60 flex items-center justify-center gap-2">
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}{editId ? "Update" : "Create"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
