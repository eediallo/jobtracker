import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import OpenAI from 'openai';

// Replace with your OpenAI API key
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function POST(req: NextRequest) {
  // 1. Authenticate user
  const { data } = await supabase.auth.getUser();
  const user = data.user;
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // 2. Get user's CV from Supabase Storage
  const { data: cvList } = await supabase.storage.from('documents').list(`${user.id}/`, { search: 'cv' });
  if (!cvList || cvList.length === 0) {
    return NextResponse.json({ error: 'No CV found' }, { status: 404 });
  }
  const cvFile = cvList[0].name;
  const { data: cvData } = await supabase.storage.from('documents').download(`${user.id}/${cvFile}`);
  if (!cvData) {
    return NextResponse.json({ error: 'Could not download CV' }, { status: 500 });
  }
  const cvText = await cvData.text();

  // 3. Use OpenAI to extract skills/experience
  const prompt = `Extract the main skills, experience, and job preferences from this CV:\n${cvText}`;
  const aiResponse = await openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [{ role: 'user', content: prompt }],
  });
  const extracted = aiResponse.choices[0].message.content;

  // 4. Search for jobs (mocked for now)
  // In production, call a real job search API here
  const jobMatch = {
    title: 'Frontend Developer',
    company: 'Tech Innovators',
    location: 'Remote',
    link: 'https://example.com/job/frontend-developer',
    description: 'Work with React, Next.js, and TypeScript to build modern web apps.',
    match_reason: extracted,
  };

  return NextResponse.json({ job: jobMatch });
} 