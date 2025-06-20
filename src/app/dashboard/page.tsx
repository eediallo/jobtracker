import { redirect } from 'next/navigation';

export default function DashboardIndex() {
  redirect('/dashboard/my-jobs');
  return null;
} 