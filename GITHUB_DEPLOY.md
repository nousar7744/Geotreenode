# 🚀 GitHub से Deploy करने का Guide

## ⚠️ Important: GitHub Server नहीं है!

GitHub **code hosting** platform है, **server hosting** नहीं। आपको code को **GitHub से** किसी hosting platform पर deploy करना होगा।

---

## 🎯 Best Options: GitHub से Auto-Deploy

### Option 1: Render.com (Recommended - Free)

Render GitHub repo से **automatically deploy** करता है!

#### Steps:

1. **GitHub पर Code Push करें** (Already done ✅)
   ```bash
   git push origin main
   ```

2. **Render.com पर जाएं**
   - https://render.com
   - Sign up with GitHub

3. **New Web Service**
   - "New +" → "Web Service"
   - **Connect GitHub** button click करें
   - Repository select करें: `nousar7744/Geotreenode`

4. **Configure**
   - Name: `geotree-api`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Plan: **Free**

5. **Environment Variables Add करें**
   ```
   NODE_ENV=production
   PORT=10000
   MONGODB_URI=your_mongodb_uri
   JWT_SECRET=your_secret
   PHONEPE_MERCHANT_ID=your_merchant_id
   PHONEPE_SALT_KEY=your_salt_key
   PHONEPE_SALT_INDEX=1
   PHONEPE_BASE_URL=https://api.phonepe.com/apis/hermes
   APP_BASE_URL=https://geotree-api.onrender.com
   ```

6. **Deploy!**
   - "Create Web Service" click करें
   - Render automatically GitHub से code pull करेगा
   - **Auto-deploy** हो जाएगा!

**Result**: हर बार जब आप `git push` करेंगे, Render automatically deploy कर देगा! 🎉

---

### Option 2: Railway.app (Better Free Tier)

Railway भी GitHub से directly deploy करता है!

#### Steps:

1. **Railway.app पर जाएं**
   - https://railway.app
   - Sign up with GitHub

2. **New Project**
   - "New Project" click करें
   - "Deploy from GitHub repo" select करें
   - Repository: `nousar7744/Geotreenode` select करें

3. **Auto-Deploy Setup**
   - Railway automatically detect करेगा Node.js
   - Environment variables add करें

4. **Done!**
   - Railway automatically deploy कर देगा
   - हर `git push` पर auto-update होगा!

**URL**: `https://your-app-name.up.railway.app`

---

### Option 3: Fly.io (Free Tier)

#### Steps:

1. **Install Fly CLI**
   ```bash
   curl -L https://fly.io/install.sh | sh
   ```

2. **Login**
   ```bash
   fly auth login
   ```

3. **Launch App**
   ```bash
   fly launch
   ```

4. **Set Secrets**
   ```bash
   fly secrets set MONGODB_URI="your_uri"
   fly secrets set JWT_SECRET="your_secret"
   ```

---

## 🔄 GitHub Actions Workflow (Already Added)

मैंने `.github/workflows/deploy.yml` file add कर दी है जो:
- Code push पर automatically run होगी
- Dependencies install करेगी
- Tests run करेगी (अगर हों)
- Deployment ready check करेगी

---

## 📋 Complete Deployment Flow

```
1. Code लिखें (local)
   ↓
2. git add .
   ↓
3. git commit -m "message"
   ↓
4. git push origin main
   ↓
5. GitHub पर code update होगा
   ↓
6. Render/Railway automatically detect करेगा
   ↓
7. Auto-deploy हो जाएगा! 🚀
```

---

## 🎯 Recommended: Render.com

**क्यों?**
- ✅ Free tier available
- ✅ GitHub integration (auto-deploy)
- ✅ Easy setup
- ✅ HTTPS included
- ✅ Automatic deployments on push

**Steps Summary:**
1. Render.com → Sign up with GitHub
2. New Web Service → Connect GitHub repo
3. Add environment variables
4. Deploy!
5. हर `git push` पर auto-deploy होगा!

---

## 🔗 Your Current Setup

- ✅ Code GitHub पर है: `github.com/nousar7744/Geotreenode`
- ✅ GitHub Actions workflow ready
- ✅ Deployment configs ready (`render.yaml`, `railway.json`)

**Next Step**: Render या Railway पर account बनाएं और GitHub repo connect करें!

---

## 💡 Pro Tip

**Render.com** use करें:
1. GitHub से directly connect
2. Auto-deploy on every push
3. Free tier available
4. Easy environment variables setup

**URL मिलेगा**: `https://geotree-api.onrender.com`

---

## ❓ FAQ

**Q: GitHub server कहाँ है?**  
A: GitHub code hosting है, server hosting नहीं। आपको Render/Railway जैसे platform use करना होगा।

**Q: Free में deploy कैसे करूं?**  
A: Render.com free tier use करें - GitHub से connect करें और deploy!

**Q: Auto-deploy कैसे होगा?**  
A: Render/Railway GitHub repo connect करने के बाद, हर `git push` पर automatically deploy होगा!

---

**Ready to Deploy?** → Render.com पर जाएं और GitHub repo connect करें! 🚀

