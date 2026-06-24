import { useState } from "react";
import { MessageCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import Button from "./Button";
import { useContent } from "@/context/ContentContext";
import { post } from "@/utils/request";
import { API_ENDPOINTS } from "@/utils/endpoints";

const initialForm = { name: "", email: "", phone: "", message: "" };

function validate(form) {
  const errors = {};
  if (!form.name.trim()) errors.name = "Name is required";
  if (!form.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = "Invalid email format";
  }
  if (!form.message.trim()) errors.message = "Message is required";
  return errors;
}

function buildWhatsAppMessage(form, companyName) {
  return [
    `*New Inquiry — ${companyName}*`,
    "",
    `Name: ${form.name}`,
    `Email: ${form.email}`,
    `Phone: ${form.phone || "—"}`,
    "",
    "Message:",
    form.message,
  ].join("\n");
}

export default function ContactForm() {
  const { content } = useContent();
  const settings = content.settings;
  const [form, setForm] = useState(initialForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error("Please fill in all required fields correctly.");
      return;
    }

    setLoading(true);

    const apiResult = await post(API_ENDPOINTS.CONTACT.SUBMIT, form);

    if (apiResult.success && apiResult.data?.success) {
      toast.success("Message sent successfully!");
    } else {
      toast.error(apiResult.error || "Failed to send message. Trying WhatsApp...");
    }

    const whatsappUrl = `${settings.whatsapp?.href}?text=${encodeURIComponent(
      buildWhatsAppMessage(form, settings.company_name)
    )}`;
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");

    setForm(initialForm);
    setLoading(false);
  };

  const inputClass = (field) =>
    `w-full px-4 py-3 rounded-xl border bg-white transition-colors duration-200 outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue ${
      errors[field] ? "border-brand-red" : "border-gray-200"
    }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-5" noValidate>
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
            Full Name <span className="text-brand-red">*</span>
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            placeholder="Your full name"
            className={inputClass("name")}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-brand-red">{errors.name}</p>
          )}
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
            Email <span className="text-brand-red">*</span>
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="your@email.com"
            className={inputClass("email")}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-brand-red">{errors.email}</p>
          )}
        </div>
      </div>

      <div>
        <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">
          Phone Number
        </label>
        <input
          id="phone"
          name="phone"
          type="tel"
          value={form.phone}
          onChange={handleChange}
          placeholder="+62 xxx xxxx xxxx"
          className={inputClass("phone")}
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1.5">
          Message <span className="text-brand-red">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          value={form.message}
          onChange={handleChange}
          placeholder="Tell us about your document needs..."
          className={`${inputClass("message")} resize-none`}
        />
        {errors.message && (
          <p className="mt-1 text-sm text-brand-red">{errors.message}</p>
        )}
      </div>

      <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Sending...
          </>
        ) : (
          <>
            <MessageCircle className="w-5 h-5" />
            Send Message
          </>
        )}
      </Button>
    </form>
  );
}
