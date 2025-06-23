# Environment Setup Guide

## Required Environment Variables

### 1. Supabase Configuration

**Purpose**: Database and authentication

**How to get it**:
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Go to Settings → API
4. Copy the URL and anon key

**Add to .env.local**:
```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## File Structure

```
jobtracker/
├── .env.local          # Your local environment variables (gitignored)
├── .env.example        # Template for environment variables
├── vercel.json         # Vercel deployment configuration
└── ENVIRONMENT_SETUP.md # This file
```

## Quick Setup Commands

```bash
# 1. Copy the example file
cp .env.example .env.local

# 2. Edit with your actual values
nano .env.local

# 3. Test the build
npm run build

# 4. Start development server
npm run dev
```

## Verification

After adding your Supabase keys, test the build:
```bash
npm run build
```

You should see:
```
✓ Compiled successfully
✓ Linting and checking validity of types
✓ Collecting page data
✓ Generating static pages
``` 