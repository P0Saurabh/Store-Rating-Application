# Vercel Environment Variables Setup Guide

## Required Environment Variables

You **MUST** add these environment variables in your Vercel Dashboard for the deployment to work:

### Backend Variables (Critical)

1. **DATABASE_URL**
   ```
   postgresql://postgres.mrkqtibeivwyguroxzhd:%23Krish9%40@aws-1-ap-south-1.pooler.supabase.com:6543/postgres
   ```
   ⚠️ **IMPORTANT**: Use the **Transaction Pooler** URL (port 6543), NOT the Direct URL

2. **JWT_SECRET**
   ```
   576eadb7340367062b7f871b18f54d969f685d1fdac3c5b46e03617b30f77e0e
   ```

### Frontend Variables (Required for API calls)

3. **VITE_API_URL**
   ```
   /api
   ```
   This tells the frontend to use relative paths for API calls

4. **NEXT_PUBLIC_SUPABASE_URL** (if using Supabase client-side)
   ```
   https://mrkqtibeivwyguroxzhd.supabase.co
   ```

5. **NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY**
   ```
   sb_publishable_y-vvJYL4arVkquHja0UJgw_ayPKxbei
   ```

## How to Add Variables in Vercel

1. Go to your Vercel Dashboard
2. Select your project
3. Go to **Settings** → **Environment Variables**
4. Add each variable:
   - **Key**: Variable name (e.g., `DATABASE_URL`)
   - **Value**: The value from above
   - **Environment**: Select all (Production, Preview, Development)
5. Click **Save**

## After Adding Variables

**You MUST redeploy** for the variables to take effect:
1. Go to **Deployments** tab
2. Click the three dots (...) on the latest deployment
3. Click **Redeploy**

## Testing

After redeployment, visit:
```
https://your-app.vercel.app/api/health
```

You should see:
```json
{
  "status": "ok",
  "env": {
    "DATABASE_URL": true,
    "JWT_SECRET": true,
    "NODE_ENV": "production"
  }
}
```

If any value shows `false`, that variable is missing!
