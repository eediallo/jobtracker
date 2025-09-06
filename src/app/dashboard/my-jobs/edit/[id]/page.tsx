"use client";
import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-provider";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

const statusOptions = ["applied", "interview", "offer", "rejected", "accepted"];

export default function EditJobPage() {
  const { user } = useAuth();
  const { data: nextAuthSession } = useSession();
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const [form, setForm] = useState({
    position: "",
    company: "",
    city: "",
    application_date: "",
    status: "applied",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Check if user is authenticated with either system
  const isAuthenticated = user || nextAuthSession;

  const getUserId = useCallback(async (): Promise<string | null> => {
    if (user) {
      return user.id;
    } else if (nextAuthSession?.user?.email) {
      const crypto = await import("crypto");
      const hash = crypto
        .createHash("sha256")
        .update(`google_${nextAuthSession.user.email}`)
        .digest("hex");
      const uuid = [
        hash.slice(0, 8),
        hash.slice(8, 12),
        hash.slice(12, 16),
        hash.slice(16, 20),
        hash.slice(20, 32),
      ].join("-");
      return uuid;
    }
    return null;
  }, [user, nextAuthSession]);

  useEffect(() => {
    if (!isAuthenticated || !id) return;

    async function loadJob() {
      try {
        const userId = await getUserId();
        if (!userId) {
          setError("Authentication required");
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from("jobs")
          .select("*")
          .eq("id", id)
          .eq("user_id", userId)
          .single();

        if (error || !data) {
          setError("Job not found");
        } else {
          setForm({
            position: data.position || "",
            company: data.company || "",
            city: data.city || "",
            application_date: data.application_date || "",
            status: data.status || "applied",
          });
        }
      } catch (error) {
        console.error("Error loading job:", error);
        setError("Failed to load job");
      }
      setLoading(false);
    }

    loadJob();
  }, [user, nextAuthSession, isAuthenticated, id, getUserId]);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isAuthenticated) {
      setError("You must be logged in to edit a job.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const userId = await getUserId();
      if (!userId) {
        setError("Authentication required");
        setLoading(false);
        return;
      }

      const { error } = await supabase
        .from("jobs")
        .update(form)
        .eq("id", id)
        .eq("user_id", userId);

      setLoading(false);
      if (error) {
        setError(error.message);
        toast.error("Failed to update job");
      } else {
        toast.success("Job updated!");
        router.push("/dashboard/my-jobs");
      }
    } catch (error) {
      console.error("Error updating job:", error);
      setError("Failed to update job");
      setLoading(false);
      toast.error("Failed to update job");
    }
  }

  if (!isAuthenticated) return <div>Please log in.</div>;
  if (loading)
    return (
      <main className="max-w-lg mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">Edit Job</h1>
        <div className="flex flex-col gap-4">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 rounded animate-pulse" />
          ))}
          <div className="w-full flex justify-center mt-4">
            <div className="w-8 h-8 border-4 border-blue-400 border-t-transparent rounded-full animate-spin" />
          </div>
        </div>
      </main>
    );
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <main className="max-w-lg mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Edit Job</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-xl"
      >
        {/* Position */}
        <div className="relative mb-2">
          <input
            name="position"
            value={form.position}
            onChange={handleChange}
            required
            disabled={loading}
            className={`peer block w-full px-4 pt-6 pb-2 text-base bg-transparent border rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-[#007bff] focus:border-[#007bff] focus:shadow-lg ${
              error && !form.position
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-700"
            } h-16`}
            placeholder=" "
            autoComplete="off"
            data-has-value={!!form.position}
          />
          <label
            className={
              `absolute left-4 top-2 text-gray-500 text-sm transition-all bg-white dark:bg-gray-900 px-1 pointer-events-none ` +
              `peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm ` +
              `[data-has-value='true']:top-2 [data-has-value='true']:text-sm`
            }
          >
            Position <span className="text-red-500">*</span>
          </label>
        </div>
        {/* Company */}
        <div className="relative mb-2">
          <input
            name="company"
            value={form.company}
            onChange={handleChange}
            required
            disabled={loading}
            className={`peer block w-full px-4 pt-6 pb-2 text-base bg-transparent border rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-[#007bff] focus:border-[#007bff] focus:shadow-lg ${
              error && !form.company
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-700"
            } h-16`}
            placeholder=" "
            autoComplete="off"
            data-has-value={!!form.company}
          />
          <label
            className={
              `absolute left-4 top-2 text-gray-500 text-sm transition-all bg-white dark:bg-gray-900 px-1 pointer-events-none ` +
              `peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm ` +
              `[data-has-value='true']:top-2 [data-has-value='true']:text-sm`
            }
          >
            Company <span className="text-red-500">*</span>
          </label>
        </div>
        {/* City */}
        <div className="relative mb-2">
          <input
            name="city"
            value={form.city}
            onChange={handleChange}
            required
            disabled={loading}
            className={`peer block w-full px-4 pt-6 pb-2 text-base bg-transparent border rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-[#007bff] focus:border-[#007bff] focus:shadow-lg ${
              error && !form.city
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-700"
            } h-16`}
            placeholder=" "
            autoComplete="off"
            data-has-value={!!form.city}
          />
          <label
            className={
              `absolute left-4 top-2 text-gray-500 text-sm transition-all bg-white dark:bg-gray-900 px-1 pointer-events-none ` +
              `peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm ` +
              `[data-has-value='true']:top-2 [data-has-value='true']:text-sm`
            }
          >
            City <span className="text-red-500">*</span>
          </label>
        </div>
        {/* Date Picker */}
        <div className="relative mb-2">
          <input
            name="application_date"
            value={form.application_date}
            onChange={handleChange}
            type="date"
            required
            disabled={loading}
            className={`peer block w-full px-4 pt-6 pb-2 text-base bg-transparent border rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-[#007bff] focus:border-[#007bff] focus:shadow-lg appearance-none ${
              error && !form.application_date
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-700"
            } h-16`}
            placeholder=" "
            data-has-value={!!form.application_date}
          />
          <label
            className={
              `absolute left-4 top-2 text-gray-500 text-sm transition-all bg-white dark:bg-gray-900 px-1 pointer-events-none ` +
              `peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm ` +
              `[data-has-value='true']:top-2 [data-has-value='true']:text-sm`
            }
          >
            <svg
              className="w-4 h-4 inline-block mr-1 text-[#007bff]"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <rect x="3" y="4" width="18" height="18" rx="2" />
              <path d="M16 2v4M8 2v4M3 10h18" />
            </svg>
            Application Date <span className="text-red-500">*</span>
          </label>
        </div>
        {/* Status Dropdown */}
        <div className="relative mb-2">
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            disabled={loading}
            className="block w-full px-4 pt-6 pb-2 text-base bg-transparent border rounded-lg appearance-none focus:outline-none focus:ring-2 focus:ring-[#007bff] focus:border-[#007bff] focus:shadow-lg border-gray-300 dark:border-gray-700 pr-10 h-16"
            data-has-value={!!form.status}
          >
            {statusOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt.charAt(0).toUpperCase() + opt.slice(1)}
              </option>
            ))}
          </select>
          <label
            className={
              `absolute left-4 top-2 text-gray-500 text-sm transition-all bg-white dark:bg-gray-900 px-1 pointer-events-none ` +
              `peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm ` +
              `[data-has-value='true']:top-2 [data-has-value='true']:text-sm`
            }
          >
            Status
          </label>
          <span className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path d="M19 9l-7 7-7-7" />
            </svg>
          </span>
        </div>
        {/* Error message */}
        {error && (
          <div className="flex items-center gap-2 text-red-500 text-sm mt-1">
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4m0 4h.01" />
            </svg>
            {error}
          </div>
        )}
        {/* Submit button */}
        <button
          type="submit"
          className="btn btn-primary w-full flex items-center justify-center text-base font-semibold py-3 rounded-lg transition-all bg-gradient-to-r from-[#007bff] to-[#28a745] hover:from-[#28a745] hover:to-[#007bff] focus:ring-2 focus:ring-[#007bff] focus:outline-none shadow-lg"
          disabled={loading}
          style={{ minHeight: 48 }}
        >
          {loading && (
            <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
          )}
          {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </main>
  );
}
