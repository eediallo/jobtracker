"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-provider";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const statusOptions = ["applied", "interview", "offer", "rejected", "accepted"];

export default function AddJobPage() {
  const { user } = useAuth();
  const { data: nextAuthSession } = useSession();
  const router = useRouter();
  const [form, setForm] = useState({
    position: "",
    company: "",
    city: "",
    application_date: "",
    status: "applied",
    job_link: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  }

  // Check if user is authenticated with either system
  const isAuthenticated = user || nextAuthSession;

  // Function to get user ID for database operations
  async function getUserId() {
    if (user) {
      return user.id; // Supabase user ID
    } else if (nextAuthSession?.user?.email) {
      // For NextAuth users, generate a deterministic UUID from their email
      // This creates a consistent UUID that will always be the same for the same email
      const crypto = await import("crypto");
      const hash = crypto
        .createHash("sha256")
        .update(`google_${nextAuthSession.user.email}`)
        .digest("hex");

      // Convert hash to UUID format (8-4-4-4-12)
      const uuid = [
        hash.slice(0, 8),
        hash.slice(8, 12),
        hash.slice(12, 16),
        hash.slice(16, 20),
        hash.slice(20, 32),
      ].join("-");

      // Create user record in Supabase if it doesn't exist
      try {
        const { error } = await supabase.from("users").upsert(
          {
            id: uuid,
            email: nextAuthSession.user.email,
            name: nextAuthSession.user.name,
            created_at: new Date().toISOString(),
          },
          {
            onConflict: "id",
          }
        );

        if (
          error &&
          error.message &&
          !error.message.includes("duplicate key")
        ) {
          console.error("Error creating user record:", error);
        }
      } catch (error) {
        console.error("Error upserting user:", error);
        // Continue anyway - the user might already exist
      }

      return uuid;
    }
    throw new Error("No authenticated user found");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isAuthenticated) {
      setError("You must be logged in to add a job.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const userId = await getUserId();

      const { error } = await supabase.from("jobs").insert({
        position: form.position,
        company: form.company,
        city: form.city,
        application_date: form.application_date,
        status: form.status,
        user_id: userId,
        title: form.position,
        location: form.city,
        job_link: form.job_link,
      });

      if (error) {
        setError(error.message);
        toast.error("Failed to add job");
      } else {
        toast.success("Job added!");
        router.push("/dashboard/my-jobs");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Failed to add job";
      setError(errorMessage);
      toast.error("Failed to add job");
    }

    setLoading(false);
  }

  if (!isAuthenticated) return <div>Please log in.</div>;

  return (
    <main className="max-w-lg mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center md:text-left w-full block">
        Add Job
      </h1>
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
            className={`peer block w-full px-4 pt-6 pb-2 text-base bg-transparent border rounded-lg focus:outline-none transition-all focus:ring-2 focus:ring-[#007bff] focus:border-[#007bff] focus:shadow-lg ${
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
          {error && !form.position && (
            <span className="absolute right-4 top-3 text-red-500">
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
            </span>
          )}
        </div>
        {/* Company */}
        <div className="relative mb-2">
          <input
            name="company"
            value={form.company}
            onChange={handleChange}
            required
            disabled={loading}
            className={`peer block w-full px-4 pt-6 pb-2 text-base bg-transparent border rounded-lg focus:outline-none transition-all focus:ring-2 focus:ring-[#007bff] focus:border-[#007bff] focus:shadow-lg ${
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
          {error && !form.company && (
            <span className="absolute right-4 top-3 text-red-500">
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
            </span>
          )}
        </div>
        {/* City */}
        <div className="relative mb-2">
          <input
            name="city"
            value={form.city}
            onChange={handleChange}
            required
            disabled={loading}
            className={`peer block w-full px-4 pt-6 pb-2 text-base bg-transparent border rounded-lg focus:outline-none transition-all focus:ring-2 focus:ring-[#007bff] focus:border-[#007bff] focus:shadow-lg ${
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
          {error && !form.city && (
            <span className="absolute right-4 top-3 text-red-500">
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
            </span>
          )}
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
            className={`peer block w-full px-4 pt-6 pb-2 text-base bg-transparent border rounded-lg focus:outline-none transition-all focus:ring-2 focus:ring-[#007bff] focus:border-[#007bff] focus:shadow-lg appearance-none ${
              error && !form.application_date
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-700"
            } h-16`}
            placeholder=" "
            data-has-value={!!form.application_date}
          />
          <label
            className={
              `absolute left-4 top-2 text-gray-500 text-sm transition-all bg-white dark:bg-gray-900 px-1 pointer-events-none flex items-center gap-1 ` +
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
          {error && !form.application_date && (
            <span className="absolute right-4 top-3 text-red-500">
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
            </span>
          )}
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
              `peer-focus:top-2 peer-focus:text-sm`
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
        {/* Job Description Link */}
        <div className="relative mb-2">
          <input
            name="job_link"
            value={form.job_link || ""}
            onChange={handleChange}
            required
            disabled={loading}
            type="url"
            className={`peer block w-full px-4 pt-6 pb-2 text-base bg-transparent border rounded-lg focus:outline-none transition-all focus:ring-2 focus:ring-[#007bff] focus:border-[#007bff] focus:shadow-lg ${
              error && !form.job_link
                ? "border-red-500"
                : "border-gray-300 dark:border-gray-700"
            } h-16`}
            placeholder=" "
            autoComplete="off"
            data-has-value={!!form.job_link}
          />
          <label
            className={
              `absolute left-4 top-2 text-gray-500 text-sm transition-all bg-white dark:bg-gray-900 px-1 pointer-events-none ` +
              `peer-placeholder-shown:top-4 peer-placeholder-shown:text-base peer-focus:top-2 peer-focus:text-sm ` +
              `[data-has-value='true']:top-2 [data-has-value='true']:text-sm`
            }
          >
            Job Description Link <span className="text-red-500">*</span>
          </label>
          {error && !form.job_link && (
            <span className="absolute right-4 top-3 text-red-500">
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
            </span>
          )}
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
          {loading ? "Adding..." : "Add Job"}
        </button>
      </form>
    </main>
  );
}
