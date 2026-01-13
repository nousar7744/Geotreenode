# 🚀 Deployment Guide - Geotree API

## Demo Server पर Deploy करने के Steps

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB Atlas account या MongoDB server
- PM2 (process manager) - optional but recommended
- Git

---

## Step 1: Server पर Code Upload करें

### Option A: Git के through (Recommended)
```bash
# Server पर
git clone https://github.com/your-username/Geotreenode.git
cd Geotreenode
```

### Option B: FTP/SFTP के through
- सभी files को server पर upload करें
- `.env` file को **नहीं** upload करें (security के लिए)

---

## Step 2: Environment Variables Setup

### `.env` file create करें:
```bash
# Server पर
cd Geotreenode
cp .env.example .env
nano .env  # या vi .env
```

### `.env` file में ये values add करें:
```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
DB_NAME=users

# JWT Secret (strong random string)
JWT_SECRET=your_very_strong_secret_key_here

# PhonePe Configuration
PHONEPE_MERCHANT_ID=your_merchant_id
PHONEPE_SALT_KEY=your_salt_key
PHONEPE_SALT_INDEX=1
PHONEPE_BASE_URL=https://api.phonepe.com/apis/hermes

# App Configuration
APP_BASE_URL=https://your-demo-domain.com
PORT=3000
```

---

## Step 3: Dependencies Install करें

```bash
npm install
```

---

## Step 4: Server Start करें

### Option A: PM2 के साथ (Recommended for Production)
```bash
# PM2 install करें (अगर नहीं है)
npm install -g pm2

# Server start करें
npm run pm2:start

# Status check करें
pm2 status

# Logs देखें
npm run pm2:logs
```

### Option B: Direct Node के साथ
```bash
npm start
```

### Option C: Production mode में
```bash
npm run prod
```

---

## Step 5: Server को Accessible बनाएं

### Nginx Reverse Proxy Setup (Optional but Recommended)

`/etc/nginx/sites-available/geotree-api` file create करें:
```nginx
server {
    listen 80;
    server_name your-demo-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Nginx restart करें:
```bash
sudo ln -s /etc/nginx/sites-available/geotree-api /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## Step 6: Firewall Setup

```bash
# Port 3000 को allow करें (अगर direct access चाहिए)
sudo ufw allow 3000/tcp

# या सिर्फ Nginx (port 80/443) allow करें
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
```

---

## Step 7: SSL Certificate (HTTPS) - Optional

```bash
# Let's Encrypt के साथ
sudo certbot --nginx -d your-demo-domain.com
```

---

## Useful Commands

### PM2 Commands:
```bash
npm run pm2:start      # Start server
npm run pm2:stop       # Stop server
npm run pm2:restart    # Restart server
npm run pm2:logs       # View logs
pm2 monit              # Monitor server
pm2 save               # Save PM2 process list
```

### Server Logs:
```bash
# PM2 logs
pm2 logs geotree-api

# या direct logs
tail -f logs/out.log
tail -f logs/err.log
```

---

## API Endpoints

Deploy होने के बाद ये endpoints available होंगे:

- `POST /user/check-user` - User check करें
- `POST /user/login` - Login करें
- `POST /user/verify` - OTP verify करें
- `POST /phonepe/create-payment` - Payment create करें
- `POST /phonepe/redirect` - Payment redirect handle करें
- `POST /phonepe/callback` - Payment callback handle करें
- `GET /phonepe/status/:transactionId` - Payment status check करें

Base URL: `https://your-demo-domain.com` या `http://your-server-ip:3000`

---

## Troubleshooting

### Server start नहीं हो रहा:
```bash
# Port check करें
lsof -i :3000

# Process kill करें (अगर port busy है)
kill -9 $(lsof -t -i:3000)
```

### MongoDB connection error:
- `.env` में `MONGODB_URI` check करें
- MongoDB Atlas में IP whitelist करें
- Internet connection verify करें

### PM2 issues:
```bash
# PM2 process list
pm2 list

# PM2 restart
pm2 restart all

# PM2 delete
pm2 delete geotree-api
```

---

## Security Checklist

- ✅ `.env` file को `.gitignore` में add किया है
- ✅ Strong JWT_SECRET use करें
- ✅ MongoDB credentials secure रखें
- ✅ HTTPS enable करें (production में)
- ✅ Firewall properly configure करें
- ✅ Regular backups लें

---

## Support

अगर कोई issue आए, तो logs check करें:
```bash
pm2 logs geotree-api --lines 100
```

