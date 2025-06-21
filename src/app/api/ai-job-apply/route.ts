import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { job } = await req.json();
  if (!job) {
    return NextResponse.json({ error: 'No job provided' }, { status: 400 });
  }

  // Insert the job into the jobs table
  const { error } = await supabase.from('jobs').insert({
    user_id: user.id,
    title: job.title,
    company: job.company,
    location: job.location,
    job_link: job.link,
    description: job.description,
    status: 'applied',
    created_at: new Date().toISOString(),
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
} 