# Project Gemini

This file contains important information about the project that is useful for the Gemini AI assistant.

## Project Overview

JobsTracker is a Next.js application designed to help users manage and track their job applications. It provides features for adding, editing, and deleting job entries, visualizing application statistics, and managing user profiles and documents. The application uses Supabase for authentication, database, and file storage.

## Getting Started

To get the project set up and running locally:

1.  **Clone the repository:**
    `git clone <repository-url>`
    `cd JobsTracker`
2.  **Install dependencies:**
    `npm install`
3.  **Set up Supabase:**
    *   Create a new project on Supabase.
    *   Configure your database tables (e.g., `jobs` table with columns like `position`, `company`, `city`, `application_date`, `status`, `user_id`, `job_link`).
    *   Enable Storage for file uploads (avatars, CVs, cover letters).
    *   Get your Supabase URL and Anon Key.
    *   Create a `.env.local` file in the root directory and add your Supabase credentials:
        ```
        NEXT_PUBLIC_SUPABASE_URL=YOUR_SUPABASE_URL
        NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_SUPABASE_ANON_KEY
        ```
4.  **Run the development server:**
    `npm run dev`
    The application should now be accessible at `http://localhost:3000`.

## Core Functionalities:

*   **Authentication:** User registration, login, and session management via Supabase Auth.
*   **Job Management:**
    *   **Add Job:** Form to input new job application details (position, company, city, application date, status, job link).
    *   **My Applications:** Displays a list of all tracked job applications with search and filter options.
    *   **Edit Job:** Allows users to modify existing job application details.
    *   **Delete Job:** Functionality to remove job applications.
*   **Profile Management:**
    *   Update password.
    *   Upload and manage user avatars.
    *   Upload and manage CVs and Cover Letters using Supabase Storage.
    *   Toggle email notifications and profile privacy (demo features).
*   **Analytics & Statistics:**
    *   Dashboard showing total applications and breakdown by status.
    *   Recent applications table.
    *   Data export to Excel (.xlsx) and CSV (.csv) formats.

## Technologies Used:

*   **Frontend:** Next.js, React, Tailwind CSS, shadcn-ui, lucide-react.
*   **Backend/Database/Auth/Storage:** Supabase.
*   **State Management:** React Hooks (`useState`, `useEffect`), custom `useAuth` hook.
*   **Routing:** Next.js App Router.
*   **Notifications:** `sonner` for toast messages.
*   **Data Export:** `xlsx` library.

## Testing

This project uses Playwright for end-to-end testing.

To run the tests:

1.  Ensure the development server is running:
    `npm run dev`
2.  Run Playwright tests:
    `npm test`

This will execute the tests defined in the `tests` directory.
