"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-provider";
import { useSession } from "next-auth/react";
import type { Job } from "@/lib/types";
import { toast } from "sonner";
import { JobTable } from "@/components/JobTable";
import { JobCard } from "@/components/JobCard";
import { EmptyState } from "@/components/EmptyState";
import { Skeleton } from "@/components/Skeleton";

export default function MyJobsPage() {
  const { user } = useAuth();
  const { data: nextAuthSession } = useSession();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [confirmDelete, setConfirmDelete] = useState<number | null>(null);

  // Check if user is authenticated with either system
  const isAuthenticated = user || nextAuthSession;

  useEffect(() => {
    if (!isAuthenticated) return;

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

        // Create user record in Supabase if it doesn't exist (for my-jobs page)
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
      return null;
    }

    async function loadJobs() {
      setLoading(true);

      try {
        if (user) {
          // Direct Supabase user
          const { data } = await supabase
            .from("jobs")
            .select("*")
            .eq("user_id", user.id)
            .order("application_date", { ascending: false });
          setJobs(data || []);
        } else if (nextAuthSession?.user?.email) {
          // NextAuth user - find their Supabase user ID
          const userId = await getUserId();
          if (userId) {
            const { data } = await supabase
              .from("jobs")
              .select("*")
              .eq("user_id", userId)
              .order("application_date", { ascending: false });
            setJobs(data || []);
          } else {
            setJobs([]);
          }
        } else {
          setJobs([]);
        }
      } catch (error) {
        console.error("Error loading jobs:", error);
        setJobs([]);
      }

      setLoading(false);
    }

    loadJobs();
  }, [user, nextAuthSession, isAuthenticated]);

  function handleDelete(id: number) {
    setConfirmDelete(id);
  }

  function confirmDeleteJob() {
    if (!confirmDelete) return;
    supabase
      .from("jobs")
      .delete()
      .eq("id", confirmDelete)
      .then(({ error }) => {
        if (error) {
          toast.error("Failed to delete job");
        } else {
          setJobs((jobs) => jobs.filter((j) => j.id !== confirmDelete));
          toast.success("Job deleted");
        }
        setConfirmDelete(null);
      });
  }

  function handleEdit(id: number) {
    window.location.href = `/dashboard/my-jobs/edit/${id}`;
  }

  function filterJobs(jobs: Job[]) {
    return jobs.filter((job) => {
      const matchesSearch =
        !search ||
        job.position?.toLowerCase().includes(search.toLowerCase()) ||
        job.company?.toLowerCase().includes(search.toLowerCase()) ||
        job.city?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = !status || job.status === status;
      return matchesSearch && matchesStatus;
    });
  }

  const statusOptions = [
    "applied",
    "interview",
    "offer",
    "rejected",
    "accepted",
  ];
  const filteredJobs = filterJobs(jobs);

  if (!isAuthenticated) return <div>Please log in.</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4 text-center md:text-left w-full block">
        My Applications
      </h1>
      <div className="flex flex-col md:flex-row gap-2 mb-4 mt-8 md:mt-0 justify-center items-center">
        <input
          type="text"
          placeholder="Search by position, company, or city"
          className="input input-bordered w-full max-w-xs md:w-1/3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="input input-bordered w-full max-w-xs md:w-40"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="">All Statuses</option>
          {statusOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt.charAt(0).toUpperCase() + opt.slice(1)}
            </option>
          ))}
        </select>
        {(search || status) && (
          <button
            className="btn btn-secondary"
            onClick={() => {
              setSearch("");
              setStatus("");
            }}
            aria-label="Clear search and filters"
          >
            Clear
          </button>
        )}
      </div>
      {/* Table view for desktop */}
      <div className="hidden md:block">
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        ) : filteredJobs.length > 0 ? (
          <JobTable
            jobs={filteredJobs}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        ) : (
          <EmptyState
            message="No jobs found. Start tracking your applications!"
            ctaLabel="Add your first job"
            onCta={() => (window.location.href = "/dashboard/add-job")}
          />
        )}
      </div>
      {/* Card view for mobile */}
      <div className="md:hidden flex flex-col gap-4">
        {loading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))
        ) : filteredJobs.length > 0 ? (
          filteredJobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <EmptyState
            message="No jobs found. Start tracking your applications!"
            ctaLabel="Add your first job"
            onCta={() => (window.location.href = "/dashboard/add-job")}
          />
        )}
      </div>
      {/* Confirmation dialog for delete */}
      {confirmDelete !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
            <div className="font-semibold mb-2">Delete this job?</div>
            <div className="text-gray-600 mb-4">
              This action cannot be undone.
            </div>
            <div className="flex gap-2 justify-end">
              <button
                className="btn btn-secondary"
                onClick={() => setConfirmDelete(null)}
              >
                Cancel
              </button>
              <button className="btn btn-danger" onClick={confirmDeleteJob}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
