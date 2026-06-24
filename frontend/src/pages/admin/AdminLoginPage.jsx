import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Lock, User, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import { useAuth } from "@/context/AuthContext";
import { FormField, inputClass } from "@/components/admin/FormField";

export default function AdminLoginPage() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    navigate("/admin", { replace: true });
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.username || !form.password) {
      toast.error("Please enter username and password");
      return;
    }
    setLoading(true);
    const result = await login(form.username, form.password);
    setLoading(false);
    if (result.success) {
      toast.success("Welcome back!");
      navigate("/admin");
    } else {
      toast.error(result.error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-blue-50/50 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
          <p className="text-sm text-gray-500 mt-2">PT Angkasa HWD Aussie CMS</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6 sm:p-8 space-y-5"
        >
          <FormField label="Username or Email" required>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                className={`${inputClass} pl-10`}
                placeholder="admin"
                autoComplete="username"
              />
            </div>
          </FormField>

          <FormField label="Password" required>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className={`${inputClass} pl-10`}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>
          </FormField>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-5 py-3 text-sm font-semibold text-white bg-brand-blue rounded-xl hover:bg-brand-blue/90 disabled:opacity-60 transition-colors"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
