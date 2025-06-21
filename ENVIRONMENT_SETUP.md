# Environment Setup Guide

## Required Environment Variables

### 1. OpenAI API Key

**Purpose**: Powers the AI Job Agent functionality

**How to get it**:
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Sign in or create an account
3. Navigate to [API Keys](https://platform.openai.com/api-keys)
4. Click "Create new secret key"
5. Copy the generated key (starts with `sk-`)

**Local Development**:
```bash
# Edit .env.local and replace the placeholder
nano .env.local
# Replace: OPENAI_API_KEY=sk-your-actual-api-key-here
```

**Production Deployment**:
- **Vercel**: Go to Project Settings → Environment Variables
- **vibeOps**: Add in your deployment platform's environment settings

### 2. Supabase Configuration (if not already set)

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

After adding your API key, test the build:
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

## Troubleshooting

**Build fails with "OPENAI_API_KEY environment variable is missing"**:
- Ensure `.env.local` exists and contains your API key
- Check that the key starts with `sk-`
- Verify no extra spaces or quotes around the key

**AI Agent not working in production**:
- Ensure the environment variable is set in your deployment platform
- Check that the variable name is exactly `OPENAI_API_KEY`
- Redeploy after adding the environment variable 