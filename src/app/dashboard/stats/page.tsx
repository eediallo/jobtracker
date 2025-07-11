"use client";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-provider";
import { useSession } from "next-auth/react";
import type { Job } from "@/lib/types";
import * as XLSX from "xlsx";

const statusLabels = [
  {
    key: "applied",
    label: "Applied",
    color: "bg-gray-200",
    accent: "border-gray-400",
    text: "text-gray-700",
  },
  {
    key: "interview",
    label: "Interview",
    color: "bg-yellow-100",
    accent: "border-yellow-400",
    text: "text-yellow-700",
  },
  {
    key: "offer",
    label: "Offer",
    color: "bg-purple-100",
    accent: "border-purple-400",
    text: "text-purple-700",
  },
  {
    key: "rejected",
    label: "Rejected",
    color: "bg-red-100",
    accent: "border-red-400",
    text: "text-red-700",
  },
  {
    key: "accepted",
    label: "Accepted",
    color: "bg-green-100",
    accent: "border-green-400",
    text: "text-green-700",
  },
];

function useCountUp(n: number, duration = 800) {
  // For number animation: returns a stateful value that animates from 0 to n
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start = 0;
    let raf: number;
    const step = () => {
      start += Math.ceil(n / (duration / 16));
      if (start >= n) {
        setVal(n);
        return;
      }
      setVal(start);
      raf = requestAnimationFrame(step);
    };
    setVal(0);
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [n, duration]);
  return val;
}

function BarChart({
  data,
  labels,
  colors,
}: {
  data: number[];
  labels: string[];
  colors: string[];
}) {
  // Simple SVG bar chart
  const max = Math.max(...data, 1);
  return (
    <svg
      viewBox={`0 0 ${data.length * 40} 120`}
      width="100%"
      height="120"
      className="overflow-visible"
    >
      {data.map((v, i) => (
        <g key={i}>
          <rect
            x={i * 40 + 10}
            y={120 - (v / max) * 90 - 20}
            width={20}
            height={(v / max) * 90}
            rx={6}
            className={colors[i]}
          />
          <text
            x={i * 40 + 20}
            y={115}
            textAnchor="end"
            className="text-xs fill-gray-500"
            transform={`rotate(-45 ${i * 40 + 20},115)`}
          >
            {labels[i]}
          </text>
          <text
            x={i * 40 + 20}
            y={120 - (v / max) * 90 - 25}
            textAnchor="middle"
            className="text-xs font-bold fill-gray-700"
          >
            {v}
          </text>
        </g>
      ))}
    </svg>
  );
}

export default function StatsPage() {
  const { user } = useAuth();
  const { data: nextAuthSession } = useSession();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<"30d" | "90d" | "all">("30d");
  const [exporting, setExporting] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);

  // Check if user is authenticated with either system
  const isAuthenticated = user || nextAuthSession;

  // Function to get user ID for database operations
  async function getUserId() {
    if (user) {
      return user.id; // Supabase user ID
    } else if (nextAuthSession?.user?.email) {
      // For NextAuth users, generate a deterministic UUID from their email
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

      return uuid;
    }
    return null;
  }

  // Always call hooks before any return
  // Compute filtered jobs and metrics with fallback for loading/user
  const now = new Date();
  let filteredJobs: Job[] = [];
  if (isAuthenticated && jobs.length > 0) {
    filteredJobs = jobs;
    if (dateRange !== "all") {
      const days = dateRange === "30d" ? 30 : 90;
      const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
      filteredJobs = jobs.filter(
        (j) => j.application_date && new Date(j.application_date) >= cutoff
      );
    }
  }
  const total = filteredJobs.length;
  const byStatus = Object.fromEntries(statusLabels.map((s) => [s.key, 0]));
  filteredJobs.forEach((job) => {
    if (job.status && byStatus[job.status] !== undefined)
      byStatus[job.status]++;
  });
  const recent = filteredJobs
    .slice()
    .sort((a, b) =>
      (b.application_date || "").localeCompare(a.application_date || "")
    )
    .slice(0, 5);

  // For number animation (always call hooks)
  const totalAnim = useCountUp(isAuthenticated ? total : 0);
  const appliedAnim = useCountUp(isAuthenticated ? byStatus["applied"] : 0);
  const interviewAnim = useCountUp(isAuthenticated ? byStatus["interview"] : 0);
  const offerAnim = useCountUp(isAuthenticated ? byStatus["offer"] : 0);
  const rejectedAnim = useCountUp(isAuthenticated ? byStatus["rejected"] : 0);
  const acceptedAnim = useCountUp(isAuthenticated ? byStatus["accepted"] : 0);

  // Color classes for bar chart
  const barColors = statusLabels.map((s) =>
    s.accent.replace("border-", "fill-")
  );

  useEffect(() => {
    if (!isAuthenticated) return;

    async function loadJobs() {
      setLoading(true);

      try {
        if (user) {
          // Direct Supabase user
          const { data } = await supabase
            .from("jobs")
            .select("*")
            .eq("user_id", user.id);
          setJobs(data || []);
        } else if (nextAuthSession?.user?.email) {
          // NextAuth user - get their jobs using deterministic UUID
          const userId = await getUserId();
          if (userId) {
            const { data } = await supabase
              .from("jobs")
              .select("*")
              .eq("user_id", userId);
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

  function handleExport(format: "csv" | "xlsx") {
    setExporting(true);
    setShowExportModal(false);

    const summaryData = [
      ["Metric", "Value"],
      ["Total Applications", total],
      ...statusLabels.map((s) => [s.label, byStatus[s.key]]),
    ];

    const jobsData = filteredJobs.map((job) => ({
      Position: job.position,
      Company: job.company,
      City: job.city,
      "Application Date": job.application_date,
      Status: job.status,
      "Job Link": job.job_link,
    }));

    if (format === "xlsx") {
      const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
      const jobsSheet = XLSX.utils.json_to_sheet(jobsData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, summarySheet, "Summary");
      XLSX.utils.book_append_sheet(workbook, jobsSheet, "Jobs");
      XLSX.writeFile(
        workbook,
        `JobsTracker_Export_${new Date().toISOString().split("T")[0]}.xlsx`
      );
    } else {
      // CSV
      let csvContent = "data:text/csv;charset=utf-8,";
      csvContent += "Summary\n";
      summaryData.forEach((row) => {
        csvContent += row.join(",") + "\n";
      });
      csvContent += "\nJobs\n";
      const jobsHeader = Object.keys(jobsData[0] || {}).join(",");
      csvContent += jobsHeader + "\n";
      jobsData.forEach((job) => {
        const row = Object.values(job).join(",");
        csvContent += row + "\n";
      });
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute(
        "download",
        `JobsTracker_Export_${new Date().toISOString().split("T")[0]}.csv`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }

    setTimeout(() => {
      setExporting(false);
    }, 1200);
  }

  if (!isAuthenticated) return <div>Please log in.</div>;
  if (loading)
    return (
      <div>
        <h1 className="text-3xl font-bold mb-6">Analytics</h1>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="p-6 bg-gray-100 rounded-2xl shadow animate-pulse h-24"
            />
          ))}
        </div>
        <div className="h-40 bg-gray-100 rounded-xl animate-pulse mb-8" />
        <div className="flex gap-2 mb-4">
          <div className="w-32 h-10 bg-gray-100 rounded animate-pulse" />
          <div className="w-32 h-10 bg-gray-100 rounded animate-pulse" />
          <div className="w-10 h-10 bg-gray-100 rounded animate-pulse" />
        </div>
        <div className="h-8 w-40 bg-gray-100 rounded animate-pulse mb-2" />
        <div className="h-32 bg-gray-100 rounded-xl animate-pulse" />
      </div>
    );

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-center md:text-left w-full block">
        Analytics
      </h1>
      {/* Filter Controls */}
      <div className="flex flex-wrap gap-3 mb-6 items-center">
        <div className="flex gap-2">
          <button
            onClick={() => setDateRange("30d")}
            className={`px-4 py-2 rounded-lg font-semibold border transition-all ${
              dateRange === "30d"
                ? "bg-blue-600 text-white border-blue-600 shadow"
                : "bg-white border-gray-300 text-gray-700 hover:bg-blue-50"
            }`}
          >
            30 Days
          </button>
          <button
            onClick={() => setDateRange("90d")}
            className={`px-4 py-2 rounded-lg font-semibold border transition-all ${
              dateRange === "90d"
                ? "bg-blue-600 text-white border-blue-600 shadow"
                : "bg-white border-gray-300 text-gray-700 hover:bg-blue-50"
            }`}
          >
            90 Days
          </button>
          <button
            onClick={() => setDateRange("all")}
            className={`px-4 py-2 rounded-lg font-semibold border transition-all ${
              dateRange === "all"
                ? "bg-blue-600 text-white border-blue-600 shadow"
                : "bg-white border-gray-300 text-gray-700 hover:bg-blue-50"
            }`}
          >
            All Time
          </button>
        </div>
        <button
          onClick={() => setShowExportModal(true)}
          className="ml-auto flex items-center gap-2 px-4 py-2 rounded-lg font-semibold border border-gray-300 bg-white hover:bg-blue-50 transition-all shadow-sm"
          disabled={exporting}
        >
          <svg
            className="w-5 h-5 text-blue-600"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path d="M12 4v12m0 0l-4-4m4 4l4-4" />
            <path d="M4 20h16" />
          </svg>
          {exporting ? "Exporting..." : "Export"}
        </button>
      </div>
      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
        <div className="p-6 bg-white rounded-2xl shadow flex flex-col items-center border-t-4 border-blue-500">
          <div className="text-3xl font-bold text-blue-700 mb-1">
            {totalAnim}
          </div>
          <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
            Total
          </div>
        </div>
        <div className="p-6 rounded-2xl shadow flex flex-col items-center border-t-4 border-gray-400 bg-white">
          <div className="text-3xl font-bold mb-1 text-gray-700">
            {appliedAnim}
          </div>
          <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
            Applied
          </div>
        </div>
        <div className="p-6 rounded-2xl shadow flex flex-col items-center border-t-4 border-yellow-400 bg-white">
          <div className="text-3xl font-bold mb-1 text-yellow-700">
            {interviewAnim}
          </div>
          <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
            Interview
          </div>
        </div>
        <div className="p-6 rounded-2xl shadow flex flex-col items-center border-t-4 border-purple-400 bg-white">
          <div className="text-3xl font-bold mb-1 text-purple-700">
            {offerAnim}
          </div>
          <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
            Offer
          </div>
        </div>
        <div className="p-6 rounded-2xl shadow flex flex-col items-center border-t-4 border-red-400 bg-white">
          <div className="text-3xl font-bold mb-1 text-red-700">
            {rejectedAnim}
          </div>
          <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
            Rejected
          </div>
        </div>
        <div className="p-6 rounded-2xl shadow flex flex-col items-center border-t-4 border-green-400 bg-white">
          <div className="text-3xl font-bold mb-1 text-green-700">
            {acceptedAnim}
          </div>
          <div className="text-xs text-gray-500 font-semibold uppercase tracking-wide">
            Accepted
          </div>
        </div>
      </div>
      {/* Chart */}
      <div className="bg-white rounded-2xl shadow p-6 mb-8">
        <div className="font-semibold text-gray-700 mb-2">
          Applications by Status
        </div>
        <BarChart
          data={statusLabels.map((s) => byStatus[s.key])}
          labels={statusLabels.map((s) => s.label)}
          colors={barColors}
        />
      </div>
      {/* Recent Applications Table */}
      <h2 className="text-lg font-semibold mb-2">Recent Applications</h2>
      <div className="overflow-x-auto">
        <table className="w-full border rounded-xl overflow-hidden text-sm">
          <thead>
            <tr className="bg-[#f8f9fa] text-gray-700">
              <th className="p-3 font-semibold text-left">Position</th>
              <th className="p-3 font-semibold text-left">Company</th>
              <th className="p-3 font-semibold text-left">City</th>
              <th className="p-3 font-semibold text-left">Date</th>
              <th className="p-3 font-semibold text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {recent.map((job) => (
              <tr
                key={job.id}
                className="transition-colors hover:bg-blue-50 border-b"
              >
                <td
                  className="p-3 font-medium text-gray-900"
                  style={{ fontSize: "1rem" }}
                >
                  {job.position}
                </td>
                <td className="p-3 text-gray-700">{job.company}</td>
                <td className="p-3 text-gray-700">{job.city}</td>
                <td className="p-3 text-gray-700">{job.application_date}</td>
                <td className="p-3">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
                      statusLabels.find((s) => s.key === job.status)?.color ||
                      "bg-gray-200"
                    } ${
                      statusLabels.find((s) => s.key === job.status)?.text ||
                      "text-gray-700"
                    }`}
                  >
                    {job.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Export Modal */}
      {showExportModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setShowExportModal(false)}
        >
          <div
            className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl p-8 max-w-sm w-full flex flex-col items-center gap-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">
              Export Data
            </h3>
            <p className="text-gray-600 dark:text-gray-300 text-center text-sm">
              Select a format to download your statistics and job application
              data.
            </p>
            <div className="flex flex-col gap-4 w-full">
              <button
                onClick={() => handleExport("xlsx")}
                className="flex items-center justify-center gap-3 w-full py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition-all focus:outline-none focus:ring-2 focus:ring-green-400"
              >
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M22,16V4C22,2.89 21.1,2 20,2H4A2,2 0 0,0 2,4V20A2,2 0 0,0 4,22H16L22,16M11,18L13.5,13L15,15.5L16.5,12.5L19,18H11M4,4H20V12H15C13.89,12 13,12.89 13,14V15H11.5L9,11.5L6,16.5L4,13.5V4Z" />
                </svg>
                Export as Excel (.xlsx)
              </button>
              <button
                onClick={() => handleExport("csv")}
                className="flex items-center justify-center gap-3 w-full py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <svg
                  className="w-6 h-6"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M11.5,16.5H8.5V13.5H11.5V16.5M11.5,12H8.5V9H11.5V12M16.5,16.5H13.5V9H16.5V16.5Z" />
                </svg>
                Export as CSV (.csv)
              </button>
            </div>
            <p className="text-xs text-gray-500 text-center mt-2">
              To use in Google Sheets, export as Excel or CSV and import it from
              your Google Drive.
            </p>
            <button
              onClick={() => setShowExportModal(false)}
              className="mt-2 text-sm text-gray-500 hover:text-gray-800 dark:hover:text-gray-200"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
