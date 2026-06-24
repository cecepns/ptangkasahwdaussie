import { useState } from "react";
import { Eye, Trash2, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { put, del } from "@/utils/request";
import { API_ENDPOINTS } from "@/utils/endpoints";
import { useAdminList } from "@/hooks/useAdminList";
import { AdminPageHeader, AdminCard, FormField, selectClass } from "@/components/admin/FormField";
import SearchInput from "@/components/admin/SearchInput";
import Pagination from "@/components/admin/Pagination";
import Modal from "@/components/admin/Modal";
import LoadingSpinner, { EmptyState } from "@/components/admin/LoadingSpinner";

const STATUS_COLORS = {
  new: "bg-blue-100 text-blue-700",
  read: "bg-gray-100 text-gray-600",
  replied: "bg-green-100 text-green-700",
  archived: "bg-amber-100 text-amber-700",
};

export default function AdminContactsPage() {
  const { data, pagination, loading, search, setSearch, page, setPage, limit, setLimit, refresh } =
    useAdminList(API_ENDPOINTS.ADMIN.CONTACT_SUBMISSIONS);
  const [viewItem, setViewItem] = useState(null);
  const [updating, setUpdating] = useState(false);

  const handleStatusChange = async (id, status) => {
    setUpdating(true);
    const result = await put(`${API_ENDPOINTS.ADMIN.CONTACT_SUBMISSIONS}/${id}`, { status });
    setUpdating(false);
    if (result.success) {
      toast.success("Status updated");
      refresh();
      if (viewItem?.id === id) setViewItem({ ...viewItem, status });
    } else toast.error(result.error);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    const result = await del(`${API_ENDPOINTS.ADMIN.CONTACT_SUBMISSIONS}/${id}`);
    if (result.success) { toast.success("Deleted"); setViewItem(null); refresh(); }
  };

  return (
    <div>
      <AdminPageHeader title="Contact Inbox" description="Messages submitted from the contact form" />
      <AdminCard className="p-4 sm:p-6">
        <div className="mb-4"><SearchInput value={search} onChange={setSearch} placeholder="Search messages..." /></div>
        {loading ? <LoadingSpinner /> : data.length === 0 ? <EmptyState message="No messages yet" /> : (
          <table className="w-full text-sm">
            <thead><tr className="border-b border-gray-100 text-left text-gray-500">
              <th className="pb-3 pr-4">Name</th><th className="pb-3 pr-4 hidden sm:table-cell">Email</th><th className="pb-3 pr-4">Status</th><th className="pb-3 pr-4 hidden md:table-cell">Date</th><th className="pb-3 text-right">Actions</th>
            </tr></thead>
            <tbody>{data.map((item) => (
              <tr key={item.id} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="py-3 pr-4 font-medium">{item.name}</td>
                <td className="py-3 pr-4 hidden sm:table-cell text-gray-600">{item.email}</td>
                <td className="py-3 pr-4"><span className={`px-2 py-0.5 rounded-md text-xs font-medium ${STATUS_COLORS[item.status]}`}>{item.status}</span></td>
                <td className="py-3 pr-4 hidden md:table-cell text-gray-500">{new Date(item.created_at).toLocaleDateString()}</td>
                <td className="py-3 text-right">
                  <button type="button" onClick={() => setViewItem(item)} className="p-2 rounded-lg hover:bg-gray-100"><Eye className="w-4 h-4" /></button>
                  <button type="button" onClick={() => handleDelete(item.id)} className="p-2 rounded-lg hover:bg-red-50 text-red-500"><Trash2 className="w-4 h-4" /></button>
                </td>
              </tr>
            ))}</tbody>
          </table>
        )}
        <Pagination pagination={pagination} page={page} setPage={setPage} limit={limit} setLimit={setLimit} />
      </AdminCard>

      <Modal open={!!viewItem} onClose={() => setViewItem(null)} title="Message Detail" size="lg">
        {viewItem && (
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 gap-4 text-sm">
              <div><p className="text-gray-500">Name</p><p className="font-medium">{viewItem.name}</p></div>
              <div><p className="text-gray-500">Email</p><p className="font-medium break-all">{viewItem.email}</p></div>
              <div><p className="text-gray-500">Phone</p><p className="font-medium">{viewItem.phone || "—"}</p></div>
              <div><p className="text-gray-500">Date</p><p className="font-medium">{new Date(viewItem.created_at).toLocaleString()}</p></div>
            </div>
            <div><p className="text-gray-500 text-sm mb-1">Message</p><p className="text-sm text-gray-800 whitespace-pre-wrap bg-gray-50 p-4 rounded-xl">{viewItem.message}</p></div>
            <FormField label="Status">
              <select className={selectClass} value={viewItem.status} disabled={updating} onChange={(e) => handleStatusChange(viewItem.id, e.target.value)}>
                <option value="new">New</option><option value="read">Read</option><option value="replied">Replied</option><option value="archived">Archived</option>
              </select>
            </FormField>
          </div>
        )}
      </Modal>
    </div>
  );
}
