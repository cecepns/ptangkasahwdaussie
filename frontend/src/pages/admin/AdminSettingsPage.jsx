import { useEffect, useState } from "react";
import { Loader2, Save } from "lucide-react";
import toast from "react-hot-toast";
import { get, put, uploadFile } from "@/utils/request";
import { API_ENDPOINTS } from "@/utils/endpoints";
import { AdminPageHeader, AdminCard, FormField, inputClass, textareaClass } from "@/components/admin/FormField";
import LoadingSpinner from "@/components/admin/LoadingSpinner";
import { resolveMediaUrl } from "@/utils/api";

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    get(API_ENDPOINTS.ADMIN.SETTINGS).then((result) => {
      if (result.success && result.data?.success) {
        setSettings(result.data.data);
      }
      setLoading(false);
    });
  }, []);

  const update = (field, value) => setSettings((prev) => ({ ...prev, [field]: value }));

  const updateNested = (parent, field, value) => {
    setSettings((prev) => ({
      ...prev,
      [parent]: { ...prev[parent], [field]: value },
    }));
  };

  const handleOfficeImageUpload = async (index, file) => {
    const result = await uploadFile(file);
    if (!result.success) {
      toast.error(result.error);
      return;
    }
    const images = [...(settings.office_images || [])];
    images[index] = { ...images[index], src: result.data.data.url, alt: images[index]?.alt || file.name };
    update("office_images", images);
  };

  const addOfficeImage = () => {
    update("office_images", [...(settings.office_images || []), { src: "", alt: "" }]);
  };

  const removeOfficeImage = (index) => {
    update("office_images", settings.office_images.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    setSaving(true);
    const result = await put(API_ENDPOINTS.ADMIN.SETTINGS, settings);
    setSaving(false);
    if (result.success && result.data?.success) {
      toast.success("Settings saved successfully");
      setSettings(result.data.data);
    } else {
      toast.error(result.error || "Failed to save settings");
    }
  };

  if (loading) return <LoadingSpinner />;
  if (!settings) return <p className="text-gray-500">Settings not found</p>;

  return (
    <div>
      <AdminPageHeader
        title="Site Settings"
        description="Manage company information, contact details, and hero content"
        action={
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold text-white bg-brand-blue rounded-xl hover:bg-brand-blue/90 disabled:opacity-60"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            Save Changes
          </button>
        }
      />

      <div className="space-y-6">
        <AdminCard className="p-6 space-y-4">
          <h2 className="font-bold text-gray-900">Company Info</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <FormField label="Company Name">
              <input className={inputClass} value={settings.company_name || ""} onChange={(e) => update("company_name", e.target.value)} />
            </FormField>
            <FormField label="Short Name">
              <input className={inputClass} value={settings.short_name || ""} onChange={(e) => update("short_name", e.target.value)} />
            </FormField>
            <FormField label="Director">
              <input className={inputClass} value={settings.director || ""} onChange={(e) => update("director", e.target.value)} />
            </FormField>
            <FormField label="Director Title">
              <input className={inputClass} value={settings.director_title || ""} onChange={(e) => update("director_title", e.target.value)} />
            </FormField>
          </div>
          <FormField label="Tagline">
            <textarea className={textareaClass} rows={2} value={settings.tagline || ""} onChange={(e) => update("tagline", e.target.value)} />
          </FormField>
          <FormField label="About">
            <textarea className={textareaClass} rows={4} value={settings.about || ""} onChange={(e) => update("about", e.target.value)} />
          </FormField>
        </AdminCard>

        <AdminCard className="p-6 space-y-4">
          <h2 className="font-bold text-gray-900">Hero Section</h2>
          <FormField label="Badge">
            <input className={inputClass} value={settings.hero_badge || ""} onChange={(e) => update("hero_badge", e.target.value)} />
          </FormField>
          <FormField label="Title">
            <input className={inputClass} value={settings.hero_title || ""} onChange={(e) => update("hero_title", e.target.value)} />
          </FormField>
        </AdminCard>

        <AdminCard className="p-6 space-y-4">
          <h2 className="font-bold text-gray-900">Contact & WhatsApp</h2>
          <FormField label="Emails (one per line)">
            <textarea
              className={textareaClass}
              rows={3}
              value={(settings.emails || []).join("\n")}
              onChange={(e) => update("emails", e.target.value.split("\n").filter(Boolean))}
            />
          </FormField>
          <FormField label="WhatsApp Number">
            <input className={inputClass} value={settings.whatsapp?.number || ""} onChange={(e) => update("whatsapp", { ...settings.whatsapp, number: e.target.value, href: `https://wa.me/${e.target.value.replace(/\D/g, "")}` })} />
          </FormField>
          <FormField label="WhatsApp Default Message">
            <textarea className={textareaClass} rows={2} value={settings.whatsapp?.defaultMessage || ""} onChange={(e) => update("whatsapp", { ...settings.whatsapp, defaultMessage: e.target.value })} />
          </FormField>
          <div className="grid sm:grid-cols-2 gap-4">
            <FormField label="Phone Indonesia">
              <input className={inputClass} value={settings.phones?.[0]?.number || ""} onChange={(e) => {
                const phones = [...(settings.phones || [{}, {}])];
                phones[0] = { label: "Indonesia", number: e.target.value, href: `tel:${e.target.value.replace(/\s/g, "")}` };
                update("phones", phones);
              }} />
            </FormField>
            <FormField label="Phone Australia">
              <input className={inputClass} value={settings.phones?.[1]?.number || ""} onChange={(e) => {
                const phones = [...(settings.phones || [{}, {}])];
                phones[1] = { label: "Australia", number: e.target.value, href: `tel:${e.target.value.replace(/\s/g, "")}` };
                update("phones", phones);
              }} />
            </FormField>
          </div>
        </AdminCard>

        <AdminCard className="p-6 space-y-4">
          <h2 className="font-bold text-gray-900">Address</h2>
          {["title", "line1", "line2", "line3", "city", "mapsUrl", "buildingTitle"].map((field) => (
            <FormField key={field} label={field}>
              <input className={inputClass} value={settings.address?.[field] || ""} onChange={(e) => updateNested("address", field, e.target.value)} />
            </FormField>
          ))}
        </AdminCard>

        <AdminCard className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-gray-900">Office Hours</h2>
            <button type="button" onClick={() => update("office_hours", [...(settings.office_hours || []), { days: "", hours: "" }])} className="text-sm text-brand-blue font-medium">+ Add</button>
          </div>
          {(settings.office_hours || []).map((item, i) => (
            <div key={i} className="grid sm:grid-cols-2 gap-3">
              <input className={inputClass} placeholder="Days" value={item.days} onChange={(e) => {
                const hours = [...settings.office_hours];
                hours[i] = { ...hours[i], days: e.target.value };
                update("office_hours", hours);
              }} />
              <div className="flex gap-2">
                <input className={inputClass} placeholder="Hours" value={item.hours} onChange={(e) => {
                  const hours = [...settings.office_hours];
                  hours[i] = { ...hours[i], hours: e.target.value };
                  update("office_hours", hours);
                }} />
                <button type="button" onClick={() => update("office_hours", settings.office_hours.filter((_, idx) => idx !== i))} className="px-3 text-red-500 text-sm">×</button>
              </div>
            </div>
          ))}
        </AdminCard>

        <AdminCard className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-gray-900">Office Images</h2>
            <button type="button" onClick={addOfficeImage} className="text-sm text-brand-blue font-medium">+ Add Image</button>
          </div>
          {(settings.office_images || []).map((img, i) => (
            <div key={i} className="flex flex-col sm:flex-row gap-3 p-4 rounded-xl border border-gray-100">
              {img.src && <img src={resolveMediaUrl(img.src) || img.src} alt={img.alt} className="w-24 h-24 object-cover rounded-lg" />}
              <div className="flex-1 space-y-2">
                <input className={inputClass} placeholder="Alt text" value={img.alt || ""} onChange={(e) => {
                  const images = [...settings.office_images];
                  images[i] = { ...images[i], alt: e.target.value };
                  update("office_images", images);
                }} />
                <input type="file" accept="image/*" onChange={(e) => e.target.files[0] && handleOfficeImageUpload(i, e.target.files[0])} className="text-sm" />
              </div>
              <button type="button" onClick={() => removeOfficeImage(i)} className="text-red-500 text-sm self-start">Remove</button>
            </div>
          ))}
        </AdminCard>

        <AdminCard className="p-6 space-y-4">
          <h2 className="font-bold text-gray-900">SEO</h2>
          <FormField label="Page Title">
            <input className={inputClass} value={settings.seo_title || ""} onChange={(e) => update("seo_title", e.target.value)} />
          </FormField>
          <FormField label="Meta Description">
            <textarea className={textareaClass} rows={3} value={settings.seo_description || ""} onChange={(e) => update("seo_description", e.target.value)} />
          </FormField>
        </AdminCard>
      </div>
    </div>
  );
}
