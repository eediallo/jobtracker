# Jobtracker

Jobtracker is a modern, full-stack web application for tracking and analyzing your job search. It helps you organize job applications, monitor your progress, and gain insights with a beautiful, responsive dashboard.

- **Authentication:** Secure registration and login with Supabase.
- **Dashboard:** Central hub for all job search activities.
  - **My Jobs:** Responsive table (desktop) and card (mobile) views, color-coded status badges, hover effects, and accessible design.
  - **Add & Edit Jobs:** Modern forms with floating labels, validation, and a single "Job Description Link" field.
  - **Stats:** Animated metric cards, custom SVG bar chart, and filter controls for analytics.
  - **Profile:** Avatar upload, edit mode toggle, settings switches, and a "Danger Zone" for account deletion.
- **Responsive Design:** Mobile-first, accessible, and visually consistent across devices.

## Tech Stack

- [Next.js](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.io/) (Auth & Database)
- [Vercel](https://vercel.com/) (Deployment)

## VibeOps Coding Tools Used

This project was developed with the help of VibeOps, an AI-powered coding and deployment assistant. VibeOps tools used include:

- **Deployment Monitoring:** Checked Vercel deployment status and logs to debug build errors.
- **Environment Management:** Managed environment variables and Supabase credentials securely.
- **Code Push Automation:** Assisted with pushing code to both GitHub and GitLab, ensuring CI/CD integration.
- **Prompt-driven Development:** Used natural language prompts to refactor UI, implement features, and debug issues.

## Main Prompts Used During Development

A selection of the main prompts and requests that guided the development process:

- "Create a job application tracking app with the following features:\nAuthentication:\nUser registration and login\nRedirect to dashboard after login\nDashboard with 4 main sections:\nMy Jobs - Display user's job applications\nFields: position name, company, city, application date, status\nActions: edit, delete buttons per job\nLayout: table view (desktop), card view (mobile)\nAdd Job - Form to add new job applications\nStats - Analytics dashboard showing application statistics\nProfile - User's personal information management\nResponsive Design: Optimize for both desktop and mobile interfaces."
- "Restyle the My Jobs tab for desktop and mobile with brand colors, status badges, and improved accessibility."
- "Refactor Add Job and Edit Job forms to use floating labels, a single Job Description Link field, and consistent validation."
- "Overhaul the Profile tab: add avatar upload, edit mode, toggle switches, and a Danger Zone for account deletion."
- "Redesign the Stats tab with animated metric cards, a custom SVG bar chart, and filter controls."
- "Investigate and fix Vercel deployment errors using build logs."
- "Update the README to reflect the current application and development process."
- "Commit and push changes to both GitHub and GitLab using VibeOps."

## AI Assistants & Credits

This project was built with the collaborative help of several AI assistants and tools:

- **VibeOps (AI Coding Assistant):** Main pair-programmer for code, refactoring, debugging, and deployment automation.
- **Claude (Anthropic):** Assisted in drafting and refining natural language prompts and requirements.
- **ChatGPT (OpenAI):** Used for final submission formatting and review.
- **Cursor (IDE):** All development and AI-assisted coding was performed in the [Cursor](https://www.cursor.so/) IDE, which integrates AI tools for seamless coding and collaboration.
