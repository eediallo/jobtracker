# vibeOps Deployment Guide

## Adding Environment Variables to vibeOps

Since vibeOps manages your Vercel deployment, you need to add the environment variables through the vibeOps platform.

### Required Environment Variable

**OPENAI_API_KEY** - Your OpenAI API key for the AI Job Agent functionality

### Steps to Add Environment Variable in vibeOps:

1. **Log into your vibeOps dashboard**
2. **Navigate to your project** (jobtracker)
3. **Go to Project Settings** or **Environment Variables** section
4. **Add a new environment variable:**
   - **Variable Name:** `OPENAI_API_KEY`
   - **Variable Value:** `sk-your-actual-openai-api-key-here`
   - **Environment:** Production (and Preview if available)
   - **Mark as Secret:** Yes (recommended)

### Alternative: Contact vibeOps Support

If you can't find the environment variables section in vibeOps:

1. **Contact vibeOps support** through their dashboard
2. **Request to add environment variable** to your project
3. **Provide the details:**
   - Project: jobtracker
   - Variable: `OPENAI_API_KEY`
   - Value: Your OpenAI API key
   - Environment: Production

### Verification

After adding the environment variable:

1. **Trigger a new deployment** (or wait for auto-deploy)
2. **Check the deployment logs** for any build errors
3. **Test the AI functionality** on your live site

### Local Testing

You can test locally with your `.env.local` file:

```bash
# Test the build
npm run build

# Start development server
npm run dev
```

### Troubleshooting

**If deployment fails:**
- Ensure the environment variable is exactly named `OPENAI_API_KEY`
- Check that the API key starts with `sk-`
- Verify no extra spaces or quotes in the value

**If AI Agent doesn't work in production:**
- Confirm the environment variable is set in vibeOps
- Check that the deployment completed successfully
- Verify the API key is valid and has sufficient credits 