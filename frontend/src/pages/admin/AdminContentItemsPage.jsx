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

const GROUPS = [
  { value: "values", label: "About Values" },
  { value: "quick_links", label: "Home Quick Links" },
  { value: "service_bullets", label: "Service Bullets" },
];

const EMPTY = { group_key: "values", icon: "Heart", title: "", description: "", href: "", sort_order: 0, is_active: 1 };

export default function AdminContentItemsPage() {
  const [groupFilter, setGroupFilter] = useState("values");
  const { data, pagination, loading, search, setSearch, page, setPage, limit, setLimit, refresh } =
    useAdminList(API_ENDPOINTS.ADMIN.CONTENT_ITEMS, { extraParams: { group_key: groupFilter } });
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);

  const openCreate = () => { setForm({ ...EMPTY, group_key: groupFilter }); setEditId(null); setModalOpen(true); };
  const openEdit = (item) => { setForm({ ...item, is_active: item.is_active ? 1 : 0 }); setEditId(item.id); setModalOpen(true); };

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    setSaving(true);
    const result = editId ? await put(`${API_ENDPOINTS.ADMIN.CONTENT_ITEMS}/${editId}`, form) : await post(API_ENDPOINTS.ADMIN.CONTENT_ITEMS, form);
    setSaving(false);
    if (result.success && result.data?.success) { toast.success("Saved"); setModalOpen(false); refresh(); }
    else toast.error(result.error || "Failed to save");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    const result = await del(`${API_ENDPOINTS.ADMIN.CONTENT_ITEMS}/${id}`);
    if (result.success) { toast.success("Deleted"); refresh(); }
  };

  return (
    <div>
      <AdminPageHeader title="Content Items" description="Manage values, quick links, and service bullet points"
        action={<button type="button" onClick={openCreate} className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-brand-blue rounded-xl hover:bg-brand-blue/90"><Plus className="w-4 h-4" /> Add Item</button>}
      />
      <div className="flex flex-wrap gap-2 mb-4">
        {GROUPS.map((g) => (
          <button key={g.value} type="button" onClick={() => { setGroupFilter(g.value); setPage(1); }}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${groupFilter === g.value ? "bg-brand-blue text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"}`}>
            {g.label}
          </button>
        ))}
      </div>
      <AdminCard className="p-4 sm:p-6">
        <div className="mb-4"><SearchInput value={search} onChange={setSearch} /></div>
        {loading ? <LoadingSpinner /> : data.length === 0 ? <EmptyState /> : (
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100 text-left text-gray-500">
              <th className="pb-3 pr-4">Title</th><th className="pb-3 pr-4 hidden md:table-cell">Description</th><th className="pb-3 pr-4">Order</th><th className="pb-3 text-right">Actions</th>
            </tr></thead>
            <tbody>{data.map((item) => (
              <tr key={item.id} className="border-b border-gray-50">
                <td className="py-3 pr-4 font-medium">{item.title}</td>
                <td className="py-3 pr-4 text-gray-600 hidden md:table-cell truncate max-w-xs">{item.description}</td>
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? "Edit Item" : "Add Item"}>
        <div className="space-y-4">
          <FormField label="Group">
            <select className={selectClass} value={form.group_key} onChange={(e) => setForm({ ...form, group_key: e.target.value })}>
              {GROUPS.map((g) => <option key={g.value} value={g.value}>{g.label}</option>)}
            </select>
          </FormField>
          {form.group_key !== "service_bullets" && (
            <FormField label="Icon"><input className={inputClass} value={form.icon || ""} onChange={(e) => setForm({ ...form, icon: e.target.value })} placeholder="Heart, Users, etc." /></FormField>
          )}
          <FormField label="Title" required><input className={inputClass} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></FormField>
          {form.group_key !== "service_bullets" && (
            <FormField label="Description"><textarea className={textareaClass} rows={3} value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} /></FormField>
          )}
          {form.group_key === "quick_links" && (
            <FormField label="Link URL"><input className={inputClass} value={form.href || ""} onChange={(e) => setForm({ ...form, href: e.target.value })} placeholder="/about" /></FormField>
          )}
          <FormField label="Sort Order"><input type="number" className={inputClass} value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value, 10) || 0 })} /></FormField>
          <button type="button" onClick={handleSave} disabled={saving} className="w-full py-3 text-sm font-semibold text-white bg-brand-blue rounded-xl disabled:opacity-60 flex items-center justify-center gap-2">
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}{editId ? "Update" : "Create"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
