import { Loader2 } from "lucide-react";

export default function LoadingSpinner({ className = "" }) {
  return (
    <div className={`flex items-center justify-center py-12 ${className}`}>
      <Loader2 className="w-8 h-8 text-brand-blue animate-spin" />
    </div>
  );
}

export function EmptyState({ message = "No data found" }) {
  return (
    <div className="text-center py-12 text-gray-500">
      <p className="text-sm">{message}</p>
    </div>
  );
}
