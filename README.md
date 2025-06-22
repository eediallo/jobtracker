# Jobtracker

## Summary

Jobtracker is a modern, full-stack web application that empowers users to efficiently track, manage, and analyze their job search process. With a focus on usability, analytics, and responsive design, Jobtracker streamlines the job application journey for individuals seeking new opportunities.

## Overview

Jobtracker provides a seamless experience for job seekers to:
- Register and securely log in to their own dashboard.
- Add, edit, and delete job applications with key details (position, company, city, date, status, and a job description link).
- Visualize their job search progress with animated statistics and charts.
- Manage their personal profile, including avatar upload and privacy settings.
- Enjoy a fully responsive interface optimized for both desktop and mobile devices.

The application is built using Next.js (App Router), TypeScript, Tailwind CSS, and Supabase for authentication and data storage. Vercel is used for deployment, and the development process was enhanced by AI-powered tools and the Cursor IDE.

## Demo

Below are example screenshots of the Jobtracker application in action:

### Landing page

<img width="1649" alt="image" src="https://github.com/user-attachments/assets/a025f183-0807-4843-a5b1-4aec21fd1e4f" />
<img width="1620" alt="image" src="https://github.com/user-attachments/assets/2a6cd543-9ca9-498c-9a36-d0cb033325e2" />

### My Applications
<img width="1673" alt="image" src="https://github.com/user-attachments/assets/f32e5a39-0dfc-400d-b21d-a7599b74e085" />

### Add Job Form

<img width="1669" alt="image" src="https://github.com/user-attachments/assets/dae3187a-cdf5-42d6-a8ff-9dab8c4e51a7" />
*Add Job: Quickly add new job applications with a modern, validated form.*

### Stats & Analytics

<img width="1672" alt="image" src="https://github.com/user-attachments/assets/dbbb0fbc-b34a-45a3-bb88-1f43026d9cf9" />

### Profile Management

<img width="1671" alt="image" src="https://github.com/user-attachments/assets/10d7399f-7301-4148-8460-b628f1e218d4" />



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

## VibeOps Coding Tools Used

This project was developed with the help of VibeOps, an AI-powered coding and deployment assistant. VibeOps tools used include:

- **Deployment Monitoring:** Checked Vercel deployment status and logs to debug build errors.
- **Environment Management:** Managed environment variables and Supabase credentials securely.
- **Code Push Automation:** Assisted with pushing code to both GitHub and GitLab, ensuring CI/CD integration.
- **Prompt-driven Development:** Used natural language prompts to refactor UI, implement features, and debug issues.


## AI Assistants

This project was built with the collaborative help of several AI assistants and tools:

- **VibeOps (AI Coding Assistant):** Main pair-programmer for code, refactoring, debugging, and deployment automation.
- **Claude (Anthropic):** Assisted in drafting and refining natural language prompts and requirements.
- **ChatGPT (OpenAI):** Used for final submission formatting and review.
- **Cursor (IDE):** All development and AI-assisted coding was performed in the [Cursor](https://www.cursor.so/) IDE, which integrates AI tools for seamless coding and collaboration.
