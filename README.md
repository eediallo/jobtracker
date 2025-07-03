# JobsTracker

## Summary

JobsTracker is a modern, full-stack web application that empowers users to efficiently track, manage, and analyze their job search process. With a focus on usability, analytics, and responsive design, JobsTracker streamlines the job application journey for individuals seeking new opportunities.

## Overview

JobsTracker provides a seamless experience for job seekers to:
- Register and securely log in to their own dashboard.
- Add, edit, and delete job applications with key details (position, company, city, date, status, and a job description link).
- Visualize their job search progress with animated statistics and charts.
- Manage their personal profile, including avatar upload and privacy settings.
- Enjoy a fully responsive interface optimized for both desktop and mobile devices.

The application is built using Next.js (App Router), TypeScript, Tailwind CSS, and Supabase for authentication and data storage. Vercel is used for deployment, and the development process was enhanced by AI-powered tools and the Cursor IDE.

## Demo

Below are example screenshots of the JobsTracker application in action:

### Landing page

<img width="1649" alt="image" src="https://github.com/user-attachments/assets/a025f183-0807-4843-a5b1-4aec21fd1e4f" />
<img width="1620" alt="image" src="https://github.com/user-attachments/assets/e324e23a-a2a7-4734-8818-ca61fcbea083" />

### My Applications
<img width="1673" alt="image" src="https://github.com/user-attachments/assets/3591f80a-cfa2-4238-be94-5df6d1dcbf23" />

### Add Job Form

<img width="1669" alt="image" src="https://github.com/user-attachments/assets/ba36730c-db51-4404-8a63-4dbe5197f5c6" />
*Add Job: Quickly add new job applications with a modern, validated form.*

### Stats & Analytics

<img width="1672" alt="image" src="https://github.com/user-attachments/assets/783d959e-22d0-4a95-9a4f-0c15beee0c39" />

### Profile Management

<img width="1671" alt="image" src="https://github.com/user-attachments/assets/47216c53-e149-403f-82c4-d84db8ba658d" />



---

# Core features 

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

## Open Source & Self-Hosting

JobsTracker is now open source! Anyone can clone, self-host, and use the application to organize their job search. Contributions are welcome under the [MIT License](LICENSE).

### Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/eediallo/jobtracker.git
   cd jobtracker
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Set up environment variables:**
   - Copy `.env.example` to `.env.local` and fill in your Supabase credentials and other required variables (see [ENVIRONMENT_SETUP.md](ENVIRONMENT_SETUP.md)).
4. **Run the development server:**
   ```bash
   npm run dev
   ```
5. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

For deployment instructions, see [Vercel documentation](https://vercel.com/docs) or your preferred hosting provider.

## Contributing

We welcome contributions from the community! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines on how to get started, submit issues, and make pull requests.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

[![MIT License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
