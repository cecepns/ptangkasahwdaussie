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

const EMPTY = { doc_type: "NIB", title: "", description: "", file_url: "", file_type: "pdf", sort_order: 0, is_published: 1 };

export default function AdminLegalDocumentsPage() {
  const { data, pagination, loading, search, setSearch, page, setPage, limit, setLimit, refresh } =
    useAdminList(API_ENDPOINTS.ADMIN.LEGAL_DOCUMENTS);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState(EMPTY);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const openCreate = () => { setForm(EMPTY); setEditId(null); setModalOpen(true); };
  const openEdit = (item) => { setForm({ ...item, is_published: item.is_published ? 1 : 0 }); setEditId(item.id); setModalOpen(true); };

  const handleFileUpload = async (file) => {
    setUploading(true);
    const result = await uploadFile(file);
    setUploading(false);
    if (result.success) {
      const isPdf = file.type === "application/pdf";
      setForm((prev) => ({ ...prev, file_url: result.data.data.url, file_type: isPdf ? "pdf" : "image" }));
      toast.success("File uploaded");
    } else toast.error(result.error);
  };

  const handleSave = async () => {
    if (!form.title.trim()) { toast.error("Title is required"); return; }
    setSaving(true);
    const result = editId ? await put(`${API_ENDPOINTS.ADMIN.LEGAL_DOCUMENTS}/${editId}`, form) : await post(API_ENDPOINTS.ADMIN.LEGAL_DOCUMENTS, form);
    setSaving(false);
    if (result.success && result.data?.success) { toast.success("Saved"); setModalOpen(false); refresh(); }
    else toast.error(result.error || "Failed to save");
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this document?")) return;
    const result = await del(`${API_ENDPOINTS.ADMIN.LEGAL_DOCUMENTS}/${id}`);
    if (result.success) { toast.success("Deleted"); refresh(); }
  };

  return (
    <div>
      <AdminPageHeader title="Legal Documents" description="Manage NIB, SK, NPWP and other legal files"
        action={<button type="button" onClick={openCreate} className="inline-flex items-center gap-2 px-4 py-2.5 text-sm font-semibold text-white bg-brand-blue rounded-xl hover:bg-brand-blue/90"><Plus className="w-4 h-4" /> Add Document</button>}
      />
      <AdminCard className="p-4 sm:p-6">
        <div className="mb-4"><SearchInput value={search} onChange={setSearch} /></div>
        {loading ? <LoadingSpinner /> : data.length === 0 ? <EmptyState /> : (
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100 text-left text-gray-500">
              <th className="pb-3 pr-4">Type</th><th className="pb-3 pr-4">Title</th><th className="pb-3 pr-4">File</th><th className="pb-3 text-right">Actions</th>
            </tr></thead>
            <tbody>{data.map((item) => (
              <tr key={item.id} className="border-b border-gray-50">
                <td className="py-3 pr-4"><span className="px-2 py-0.5 rounded-md bg-brand-blue/10 text-brand-blue text-xs font-bold">{item.doc_type}</span></td>
                <td className="py-3 pr-4 font-medium">{item.title}</td>
                <td className="py-3 pr-4">{item.file_url ? "✓ Uploaded" : "—"}</td>
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editId ? "Edit Document" : "Add Document"} size="lg">
        <div className="space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <FormField label="Document Type"><input className={inputClass} value={form.doc_type} onChange={(e) => setForm({ ...form, doc_type: e.target.value })} /></FormField>
            <FormField label="File Type">
              <select className={selectClass} value={form.file_type} onChange={(e) => setForm({ ...form, file_type: e.target.value })}>
                <option value="pdf">PDF</option><option value="image">Image</option>
              </select>
            </FormField>
          </div>
          <FormField label="Title" required><input className={inputClass} value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></FormField>
          <FormField label="Description"><textarea className={textareaClass} rows={2} value={form.description || ""} onChange={(e) => setForm({ ...form, description: e.target.value })} /></FormField>
          <FormField label="Upload File">
            <input type="file" accept="image/*,.pdf" onChange={(e) => e.target.files[0] && handleFileUpload(e.target.files[0])} className="text-sm" />
            {uploading && <p className="text-xs text-gray-500 mt-1">Uploading...</p>}
            {form.file_url && (
              <div className="mt-2">
                {form.file_type === "image" ? (
                  <img src={resolveMediaUrl(form.file_url)} alt="Preview" className="h-24 rounded-lg object-contain border" />
                ) : (
                  <a href={resolveMediaUrl(form.file_url)} target="_blank" rel="noopener noreferrer" className="text-sm text-brand-blue hover:underline">View uploaded PDF</a>
                )}
              </div>
            )}
          </FormField>
          <button type="button" onClick={handleSave} disabled={saving} className="w-full py-3 text-sm font-semibold text-white bg-brand-blue rounded-xl disabled:opacity-60 flex items-center justify-center gap-2">
            {saving && <Loader2 className="w-4 h-4 animate-spin" />}{editId ? "Update" : "Create"}
          </button>
        </div>
      </Modal>
    </div>
  );
}
