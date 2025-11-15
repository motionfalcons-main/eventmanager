# 🚀 Deployment Guide - Render.com

## ✅ Rebranding Complete

All references to the original project have been removed:
- ✅ Project name changed from "Eventify" to "EventManager"
- ✅ Author name removed
- ✅ Hardcoded domains replaced with environment variables
- ✅ All UI text updated

**Note:** You can change "EventManager" to your preferred name by doing a find-replace across the codebase.

---

## 📋 Pre-Deployment Checklist

- [x] Project rebranded
- [x] PORT environment variable configured
- [x] CORS configured for environment variable
- [x] Database connection uses DATABASE_URL
- [x] Health check endpoint added (`/health`)
- [x] Redis configuration updated for environment variables
- [x] render.yaml created

---

## 🔧 Required Environment Variables

### Backend Service

Add these in Render Dashboard → Your Backend Service → Environment:

```bash
NODE_ENV=production
PORT=8080

# Database (Render provides this automatically)
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require

# Frontend URL (your frontend service URL)
FRONTEND_URL=https://your-frontend-service.onrender.com

# Session Secret (generate a random string)
DB_SESSION_SECRET=your_random_secret_string_here

# Redis (if using Render Redis)
REDIS_URL=redis://default:password@host:port
```

### Frontend Service

Add these in Render Dashboard → Your Frontend Service → Environment:

```bash
NODE_ENV=production

# Backend API URL
NEXT_PUBLIC_API_URL=https://your-backend-service.onrender.com
```

---

## 🚀 Deployment Steps

### Option 1: Using Render Blueprint (Recommended)

1. **Push your code to GitHub**
   ```bash
   git add .
   git commit -m "Rebranded and prepared for deployment"
   git push origin main
   ```

2. **Deploy via Render Blueprint**
   - Go to [render.com](https://render.com)
   - Click "New" → "Blueprint"
   - Connect your GitHub repository
   - Render will automatically detect `render.yaml`
   - Review and deploy

3. **Configure Environment Variables**
   - After services are created, add environment variables in each service's dashboard
   - Use the list above as reference

### Option 2: Manual Deployment

#### Step 1: Create PostgreSQL Database

1. Go to Render Dashboard → "New" → "PostgreSQL"
2. Name: `eventmanager-db`
3. Copy the **Internal Database URL** (you'll need this)

#### Step 2: Create Redis (Optional but Recommended)

1. Go to Render Dashboard → "New" → "Redis"
2. Name: `eventmanager-redis`
3. Copy the **Internal Redis URL**

#### Step 3: Deploy Backend

1. Go to Render Dashboard → "New" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name:** `eventmanager-backend`
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
   - **Environment:** `Node`
4. Add environment variables (see list above)
5. Click "Create Web Service"

#### Step 4: Deploy Frontend

1. Go to Render Dashboard → "New" → "Web Service"
2. Connect your GitHub repository
3. Configure:
   - **Name:** `eventmanager-frontend`
   - **Root Directory:** `client`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Environment:** `Node`
4. Add environment variables:
   - `NEXT_PUBLIC_API_URL` = Your backend service URL
5. Click "Create Web Service"

---

## 🔗 Service URLs Configuration

After deployment, update these environment variables:

1. **Backend Service:**
   - `FRONTEND_URL` = Your frontend service URL (e.g., `https://eventmanager-frontend.onrender.com`)

2. **Frontend Service:**
   - `NEXT_PUBLIC_API_URL` = Your backend service URL (e.g., `https://eventmanager-backend.onrender.com`)

---

## 🧪 Testing Deployment

1. **Check Health Endpoint:**
   - Visit: `https://your-backend-service.onrender.com/health`
   - Should return: `{"status":"ok","message":"Server is running"}`

2. **Test Frontend:**
   - Visit your frontend service URL
   - Check browser console for errors
   - Verify API calls are working

---

## 🐛 Common Issues & Fixes

### Build Fails

**Issue:** Build command fails
**Fix:**
- Check build logs in Render dashboard
- Ensure `package.json` has all dependencies
- Verify Node version matches (check `package.json` engines if specified)

### Database Connection Fails

**Issue:** Cannot connect to database
**Fix:**
- Verify `DATABASE_URL` is set correctly
- Check database is not paused
- Ensure SSL mode is correct (Render requires SSL)

### CORS Errors

**Issue:** Frontend can't connect to backend
**Fix:**
- Verify `FRONTEND_URL` in backend matches your frontend service URL exactly
- Check `NEXT_PUBLIC_API_URL` in frontend matches backend URL
- Ensure URLs include `https://` protocol

### Redis Connection Fails

**Issue:** Redis connection errors
**Fix:**
- Verify `REDIS_URL` is set correctly
- Check Redis service is running (not paused)
- For local development, ensure Redis is installed and running

### Static Files Not Loading

**Issue:** Images or assets not loading
**Fix:**
- Verify file paths are correct
- Check that static file serving is configured in `server.js`
- Ensure images are committed to repository

---

## 📝 Post-Deployment

1. **Set up Auto-Deploy:**
   - Enable auto-deploy from main branch in Render dashboard

2. **Configure Custom Domain (Optional):**
   - Go to service settings
   - Add your custom domain
   - Update DNS records as instructed

3. **Monitor Logs:**
   - Check Render dashboard logs regularly
   - Set up alerts for errors

4. **Database Backups:**
   - Render automatically backs up PostgreSQL databases
   - Configure backup schedule in database settings

---

## 🔐 Security Notes

1. **Session Cookies:**
   - Update `secure: true` in `server.js` for production (line 94)
   - This requires HTTPS (which Render provides)

2. **Environment Variables:**
   - Never commit `.env` files
   - Use Render's environment variable management

3. **Database:**
   - Use strong passwords
   - Enable SSL connections (already configured)

---

## 💰 Estimated Costs

- **Starter Plan (Free Tier):**
  - Web Services: Free (with limitations)
  - PostgreSQL: Free (limited to 90 days)
  - Redis: Free (limited)

- **Paid Plans:**
  - Web Service: $7/month per service
  - PostgreSQL: $7/month
  - Redis: $10/month
  - **Total:** ~$24-31/month

---

## 📞 Support

If you encounter issues:
1. Check Render dashboard logs
2. Verify all environment variables are set
3. Test endpoints individually
4. Check Render status page for service outages

---

## ✨ Next Steps

After successful deployment:
1. Test all features end-to-end
2. Set up monitoring and alerts
3. Configure custom domain
4. Set up CI/CD pipeline
5. Add error tracking (e.g., Sentry)

