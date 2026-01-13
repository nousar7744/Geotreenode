# 🚀 Free Demo Server Deployment Guide

## Best Free Hosting Options for Node.js

### 1. **Render.com** (Recommended - Free Tier Available)
- ✅ Free tier available
- ✅ Auto-deploy from GitHub
- ✅ HTTPS included
- ✅ Easy setup

### 2. **Railway.app**
- ✅ Free tier with $5 credit
- ✅ Simple deployment
- ✅ Auto HTTPS

### 3. **Fly.io**
- ✅ Free tier available
- ✅ Global deployment
- ✅ Good performance

---

## 🎯 Option 1: Render.com Deployment (Easiest)

### Step 1: Create Render Account
1. Go to https://render.com
2. Sign up with GitHub
3. Click "New +" → "Web Service"

### Step 2: Connect Repository
1. Connect your GitHub repository: `nousar7744/Geotreenode`
2. Select the repository

### Step 3: Configure Service
- **Name**: `geotree-api`
- **Environment**: `Node`
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Plan**: Free

### Step 4: Add Environment Variables
Click "Environment" tab and add:

```
NODE_ENV=production
PORT=10000
MONGODB_URI=your_mongodb_connection_string
DB_NAME=users
JWT_SECRET=your_strong_jwt_secret
PHONEPE_MERCHANT_ID=your_merchant_id
PHONEPE_SALT_KEY=your_salt_key
PHONEPE_SALT_INDEX=1
PHONEPE_BASE_URL=https://api.phonepe.com/apis/hermes
APP_BASE_URL=https://geotree-api.onrender.com
```

### Step 5: Deploy
Click "Create Web Service" - Deployment will start automatically!

### Your URL will be:
```
https://geotree-api.onrender.com
```

---

## 🎯 Option 2: Railway.app Deployment

### Step 1: Create Railway Account
1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project"

### Step 2: Deploy from GitHub
1. Select "Deploy from GitHub repo"
2. Choose `nousar7744/Geotreenode`
3. Railway will auto-detect Node.js

### Step 3: Add Environment Variables
Go to "Variables" tab and add all `.env` variables

### Step 4: Get URL
Railway will provide a URL like:
```
https://geotree-api-production.up.railway.app
```

---

## 🎯 Option 3: Fly.io Deployment

### Step 1: Install Fly CLI
```bash
curl -L https://fly.io/install.sh | sh
```

### Step 2: Login
```bash
fly auth login
```

### Step 3: Launch App
```bash
fly launch
```

### Step 4: Set Secrets
```bash
fly secrets set MONGODB_URI="your_uri"
fly secrets set JWT_SECRET="your_secret"
# ... add all other secrets
```

---

## 📝 Quick Deploy Commands

### For Render:
1. Push code to GitHub (already done ✅)
2. Go to render.com
3. Connect repo
4. Add environment variables
5. Deploy!

### For Railway:
1. Push code to GitHub (already done ✅)
2. Go to railway.app
3. New Project → GitHub
4. Add environment variables
5. Deploy!

---

## 🔗 After Deployment

Your API will be available at:

**Render**: `https://geotree-api.onrender.com`  
**Railway**: `https://your-app-name.up.railway.app`  
**Fly.io**: `https://your-app-name.fly.dev`

### Test Endpoints:
```
GET  https://your-url.com/health
POST https://your-url.com/user/check-user
POST https://your-url.com/phonepe/create-payment
```

---

## ⚙️ Environment Variables Checklist

Make sure to add these in your hosting platform:

- [ ] MONGODB_URI
- [ ] DB_NAME
- [ ] JWT_SECRET
- [ ] PHONEPE_MERCHANT_ID
- [ ] PHONEPE_SALT_KEY
- [ ] PHONEPE_SALT_INDEX
- [ ] PHONEPE_BASE_URL
- [ ] APP_BASE_URL (your deployed URL)
- [ ] PORT (usually auto-set by platform)

---

## 🎉 Recommended: Render.com

**Why Render?**
- ✅ Free tier available
- ✅ Easiest setup
- ✅ Auto HTTPS
- ✅ GitHub integration
- ✅ Good documentation

**Steps:**
1. Sign up at render.com
2. Connect GitHub repo
3. Add environment variables
4. Deploy!
5. Get your URL: `https://geotree-api.onrender.com`

---

## 📞 Need Help?

If you face any issues:
1. Check deployment logs
2. Verify environment variables
3. Check MongoDB connection
4. Verify PORT is set correctly

