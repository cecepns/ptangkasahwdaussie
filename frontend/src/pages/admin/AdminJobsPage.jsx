import { useState } from "react";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { post, put, del, uploadFile } from "@/utils/request";
import { API_ENDPOINTS } from "@/utils/endpoints";
import { resolveMediaUrl } from "@/utils/api";
import { useAdminList } from "@/hooks/useAdminList";
import { AdminPageHeader, AdminCard, FormField, inputClass, textareaClass, selectClass } from "@/components/admin/FormField";
import SearchInput from "@/components/admin/SearchInput";
import Pagination from "@/components/admin/Pagination";
import Modal from "@/components/admin/Modal";
import LoadingSpinner, { EmptyState } from "@/components/admin/LoadingSpinner";

const EMPTY = { title: "", location: "Australia", description: "", image_url: "", alt_text: "", status: "active", sort_order: 0 };

export default function AdminJobsPage() {
  const { data, pagination, loading, search, setSearch, page, setPage, limit, setLimit, refresh } =
    useAdminList(API_ENDPOINTS.ADMIN.JOB_LISTINGS);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const openCreate = () => { setForm(EMPTY); setEditId(null); setModalOpen(true); };
  const openEdit = (item) => { setForm({ ...item }); setEditId(item.id); setModalOpen(true); };

  const handleImageUpload = async (file) => {
    setUploading(true);
    const result = await uploadFile(file);
    setUploading(false);
    if (result.success) {
      setForm((prev) => ({ ...prev, image_url: result.data.data.url, alt_text: prev.alt_text || file.name }));
      toast.success("Image uploaded");
    } else toast.error(result.error);
  };

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    setSaving(true);
    const result = editId ? await put(`${API_ENDPOINTS.ADMIN.JOB_LISTINGS}/${editId}`, form) : await post(API_ENDPOINTS.ADMIN.JOB_LISTINGS, form);
    setSaving(false);
    if (result.success && result.data?.success) { toast.success("Saved"); setModalOpen(false); refresh(); }
    else toast.error(result.error || "Failed to save");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this job listing?")) return;
    const result = await del(`${API_ENDPOINTS.ADMIN.JOB_LISTINGS}/${id}`);
    if (result.success) { toast.success("Deleted"); refresh(); }
  };

  return (
    <div>
      <AdminPageHeader title="Job Listings" description="Upload and manage job opportunity listings"
        action={<button type="button" onClick={openCreate} className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-brand-blue rounded-xl hover:bg-brand-blue/90"><Plus className="w-4 h-4" /> Add Job</button>}
      />
      <AdminCard className="p-4 sm:p-6">
        <div className="mb-4"><SearchInput value={search} onChange={setSearch} placeholder="Search jobs..." /></div>
        {loading ? <LoadingSpinner /> : data.length === 0 ? <EmptyState message="No job listings yet. Add your first job!" /> : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data.map((item) => (
              <div key={item.id} className="rounded-xl border border-gray-100 overflow-hidden bg-white">
                {item.image_url ? (
                  <img src={resolveMediaUrl(item.image_url)} alt={item.alt_text} className="w-full h-40 object-cover" />
                ) : (
                  <div className="w-full h-40 bg-gray-100 flex items-center justify-center text-gray-400 text-sm">No image</div>
                )}
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-medium text-gray-900 text-sm">{item.title}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{item.location}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-md text-xs font-medium ${item.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>{item.status}</span>
                  </div>
                  <div className="flex gap-1 mt-3">
                    <button type="button" onClick={() => openEdit(item)} className="flex-1 py-1.5 text-xs font-medium rounded-lg border border-gray-200 hover:bg-gray-50">Edit</button>
                    <button type="button" onClick={() => handleDelete(item.id)} className="py-1.5 px-3 text-xs font-medium rounded-lg border border-red-200 text-red-500 hover:bg-red-50"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
        <Pagination pagination={pagination} page={page} setPage={setPage} limit={limit} setLimit={setLimit} />
      </AdminCard>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? "Edit Job" : "Add Job"} size="lg">
        <div className="space-y-4">
          <FormField label="Title" required><input className={inputClass} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></FormField>
          <FormField label="Location"><input className={inputClass} value={form.location || ""} onChange={(e) => setForm({ ...form, location: e.target.value })} /></FormField>
          <FormField label="Description"><textarea className={textareaClass} rows={2} value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} /></FormField>
          <FormField label="Alt Text"><input className={inputClass} value={form.alt_text || ""} onChange={(e) => setForm({ ...form, alt_text: e.target.value })} /></FormField>
          <FormField label="Status">
            <select className={selectClass} value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="active">Active</option><option value="closed">Closed</option>
            </select>
          </FormField>
          <FormField label="Job Image">
            <input type="file" accept="image/*" onChange={(e) => e.target.files[0] && handleImageUpload(e.target.files[0])} className="text-sm" />
            {uploading && <p className="text-xs text-gray-500 mt-1">Uploading...</p>}
            {form.image_url && <img src={resolveMediaUrl(form.image_url)} alt="Preview" className="mt-2 h-32 rounded-lg object-contain border" />}
          </FormField>
          <FormField label="Sort Order"><input type="number" className={inputClass} value={form.sort_order} onChange={(e) => setForm({ ...form, sort_order: parseInt(e.target.value, 10) || 0 })} /></FormField>
          <button type="button" onClick={handleSave} disabled={saving} className="w-full py-3 text-sm font-semibold text-white bg-brand-blue rounded-xl disabled:opacity-60 flex items-center justify-center gap-2">
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}{editId ? "Update" : "Create"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
