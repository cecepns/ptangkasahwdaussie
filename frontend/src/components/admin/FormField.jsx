export function FormField({ label, required, error, children, className = "" }) {
  return (
    <div className={className}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          {label} {required && <span className="text-brand-red">*</span>}
        </label>
      )}
      {children}
      {error && <p className="mt-1 text-sm text-brand-red">{error}</p>}
    </div>
  );
}

export const inputClass =
  "w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-colors";

export const selectClass =
  "w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-colors";

export const textareaClass =
  "w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white text-sm outline-none focus:ring-2 focus:ring-brand-blue/30 focus:border-brand-blue transition-colors resize-none";

export function AdminPageHeader({ title, description, action }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
      </div>
      {action}
    </div>
  );
}

export function AdminCard({ children, className = "" }) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-100 shadow-sm ${className}`}>
      {children}
    </div>
  );
}
