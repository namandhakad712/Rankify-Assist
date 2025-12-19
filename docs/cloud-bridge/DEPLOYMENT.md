# ☁️ Cloud Bridge - Supabase Deployment Guide

## What You're Deploying

A cloud service powered by **Supabase** + **Vercel** that bridges Tuya AI MCP and your Chrome extension.

**Why Supabase?**
- ✅ **500 MB database** (vs 8KB with Vercel KV!)
- ✅ **Unlimited API calls** (free tier)
- ✅ **Built-in authentication**
- ✅ **Real-time capabilities**
- ✅ **PostgreSQL** (proper database!)
- ✅ **FREE FOREVER**

---

## Step 1: Create Supabase Project

### **1.1 Sign Up:**

1. Go to: https://supabase.com/
2. Click: **Start your project**
3. Sign in with GitHub

### **1.2 Create Project:**

1. Click: **New Project**
2. **Organization:** Select or create
3. **Name:** `tuya-cloud-bridge`
4. **Database Password:** Generate strong password (SAVE IT!)
5. **Region:** Choose closest to you
6. Click: **Create new project**

⏳ Wait 2-3 minutes for database to spin up...

---

## Step 2: Setup Database Schema

### **2.1 Open SQL Editor:**

1. In Supabase dashboard → **SQL Editor**
2. Click: **New query**

### **2.2 Run Schema:**

Copy the entire contents of `supabase-schema.sql` and paste into the SQL editor.

Click: **Run** (or Ctrl+Enter)

You should see:
```
Success. No rows returned
```

### **2.3 Verify Tables:**

Go to **Table Editor** tab. You should see:
- ✅ `users`
- ✅ `commands`
- ✅ `results`

---

## Step 3: Get Supabase Credentials

### **3.1 Project URL:**

1. Go to: **Settings** → **API**
2. Copy: **Project URL**
   ```
   Example: https://abcdefghijklmnop.supabase.co
   ```

### **3.2 Anon Key:**

Still in **Settings** → **API**:

Copy: **anon / public** key
```
Example: eyJhbGci...very_long_key
```

⚠️ **Important:** Use the `anon` key (not service role) for frontend. But for our API we can use service role since it's server-side.

Actually, **use SERVICE ROLE key** since our Vercel API needs full database access:

Copy: **service_role** key (click to reveal)

---

## Step 4: Deploy to Vercel

### **4.1 Prepare Code:**

```bash
cd c:\TUYA\RankifyAssist\cloud-bridge

# Install dependencies
npm install
```

### **4.2 Deploy:**

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy
vercel

# Deploy to production
vercel --prod
```

Your URL: `https://your-project.vercel.app`

---

## Step 5: Configure Environment Variables

### **5.1 In Vercel Dashboard:**

1. Go to: Project → **Settings** → **Environment Variables**

2. Add these variables:

```
SUPABASE_URL = https://abcdefghijklmnop.supabase.co
SUPABASE_ANON_KEY = eyJhbGci...your_service_role_key
MCP_API_KEY = generate_random_key_here
```

**Generate MCP_API_KEY:**
```bash
# Windows PowerShell
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})

# Or use online generator
# https://www.random.org/strings/
```

Example: `mcp_8a7f9b2c1d3e4f5g6h7i8j9k0l1m2n3o`

3. Click: **Save**

4. **Redeploy:**
   - Go to: **Deployments**
   - Latest deployment → **...** → **Redeploy**

---

## Step 6: Test Deployment

### **6.1 Test Health:**

```bash
curl https://your-project.vercel.app/api/ping
```

Should return:
```json
{
  "status": "ok",
  "service": "Tuya Cloud Bridge",
  "version": "1.0.0"
}
```

### **6.2 Test Registration:**

```bash
curl -X POST https://your-project.vercel.app/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "testpassword123",
    "email": "test@example.com"
  }'
```

Should return:
```json
{
  "success": true,
  "userId": "user_1234567890_xyz",
  "username": "testuser",
  "message": "Registration successful..."
}
```

**SAVE THE `userId`!**

### **6.3 Verify in Supabase:**

1. Go to Supabase → **Table Editor** → **users**
2. You should see your test user!

---

## Step 7: Update Extension Settings

In Rankify Assist settings (Tuya tab):

1. **Bridge URL:** `https://your-project.vercel.app`
2. **Username:** `testuser`
3. **Password:** `testpassword123`
4. Click: **Save**
5. Click: **Test Connection**

Should show: ✅ Connected!

---

## Step 8: Update MCP Server

In `mcp-servers/browser-automation/.env`:

```env
# MCP Configuration
MCP_ENDPOINT=wss://...
MCP_ACCESS_ID=xxxxxxxxxxxx
MCP_ACCESS_SECRET=yyyyyyyyyyyy

# Cloud Bridge with Supabase
CLOUD_BRIDGE_URL=https://your-project.vercel.app
MCP_API_KEY=mcp_8a7f9b2c1d3e4f5g6h7i8j9k0l1m2n3o
DEFAULT_USER_ID=user_1234567890_xyz
```

---

## Step 9: Create More Users

For each user you want to add:

```bash
curl -X POST https://your-project.vercel.app/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "john_doe",
    "password": "SecurePass123!",
    "email": "john@example.com"
  }'
```

Response will give you the `userId` - use it in MCP configuration for that user.

---

## Monitoring & Maintenance

### **View Database in Supabase:**

**All Users:**
```sql
SELECT user_id, username, email, created_at 
FROM users 
ORDER BY created_at DESC;
```

**Pending Commands:**
```sql
SELECT * FROM commands 
WHERE status = 'pending' 
ORDER BY created_at;
```

**Recent Results:**
```sql
SELECT 
  r.command_id,
  c.command,
  r.result,
  r.execution_time,
  r.completed_at
FROM results r
JOIN commands c ON r.command_id = c.command_id
ORDER BY r.completed_at DESC
LIMIT 10;
```

**Command Statistics:**
```sql
SELECT 
  status,
  COUNT(*) as count
FROM commands
GROUP BY status;
```

### **Cleanup Old Data:**

Run periodically:
```sql
SELECT cleanup_old_commands();
```

Or enable auto-cleanup (pg_cron):
```sql
-- Enable pg_cron extension first in Database → Extensions
SELECT cron.schedule(
  'cleanup-old-commands', 
  '0 2 * * *',  -- Every day at 2 AM
  'SELECT cleanup_old_commands();'
);
```

---

## Troubleshooting

### **"Invalid API key" error:**

- Check `MCP_API_KEY` in Vercel environment variables
- Ensure it matches the key in MCP `.env`
- Redeploy after changing env vars

### **"Unauthorized" error (extension):**

- Verify username/password in extension settings
- Test login with curl (see Step 6.2)
- Check user exists in Supabase users table

### **"Command timeout" error:**

- Extension not running or not polling
- Check extension console for errors
- Verify extension has correct bridge URL
- Ensure user credentials are correct

### **Database connection errors:**

- Check `SUPABASE_URL` and `SUPABASE_ANON_KEY` in Vercel
- Verify Supabase project is active
- Check network/firewall settings

---

## Cost & Limits (Free Tier)

### **Supabase Free Tier:**

- ✅ **500 MB database** (plenty!)
- ✅ **2 GB bandwidth/month**
- ✅ **50,000 monthly active users**
- ✅ **500 MB file storage**
- ✅ **Unlimited API requests**
- ✅ **Unlimited Edge Functions**

### **Vercel Free Tier:**

- ✅ **100 GB bandwidth**
- ✅ **100,000 function invocations/month**
- ✅ **100 projects**

**For this use case:** FREE tier is MORE than enough! 🎉

---

## Production Optimizations

### **1. Add Indexes:**

Already included in schema! ✅

### **2. Enable Connection Pooling:**

Supabase automatically pools connections ✅

### **3. Monitor Performance:**

Use Supabase **Database** → **Reports** to see:
- Query performance
- Connection count
- Table sizes

### **4. Set up Backups:**

Supabase auto-backups daily (free tier: 7 days retention) ✅

### **5. Rate Limiting (Optional):**

Add to API endpoints:
```javascript
const rateLimit = new Map();

function checkRateLimit(userId) {
  const now = Date.now();
  const userLimit = rateLimit.get(userId) || { count: 0, resetAt: now + 60000 };
  
  if (now > userLimit.resetAt) {
    rateLimit.set(userId, { count: 1, resetAt: now + 60000 });
    return true;
  }
  
  if (userLimit.count >= 60) {  // 60 requests per minute
    return false;
  }
  
  userLimit.count++;
  return true;
}
```

---

## Migration from Old Setup

If you were using local bridge:

1. ✅ Deploy Supabase setup (done!)
2. ✅ Register users
3. ✅ Update extension settings
4. ✅ Update MCP `.env`
5. ❌ **DELETE** `bridge-server/` folder (not needed!)
6. ❌ Stop ngrok (not needed!)

**Your setup is now:**
- Always on ✅
- No laptop needed ✅
- Multi-user ✅
- Scalable ✅
- FREE ✅

---

## Next Steps

1. ✅ Create test user
2. ✅ Configure extension
3. ✅ Update MCP configuration
4. ✅ Test end-to-end with Tuya AI
5. ✅ Create real users
6. ✅ Monitor performance

**Your cloud-based, always-on, multi-user system is LIVE!** 🚀
