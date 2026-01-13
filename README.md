# 🌳 Geotree API

A Node.js REST API for user authentication, OTP verification, and PhonePe payment integration.

## 🚀 Features

- ✅ User Registration & Authentication
- ✅ OTP-based Mobile Verification
- ✅ JWT Token Authentication
- ✅ PhonePe Payment Integration
- ✅ Payment Status Tracking
- ✅ CORS Enabled
- ✅ PM2 Process Management
- ✅ Production Ready

## 📋 Prerequisites

- Node.js (v18+ recommended)
- MongoDB Atlas or MongoDB Server
- npm or yarn

## 🛠️ Installation

```bash
# Clone repository
git clone https://github.com/nousar7744/Geotreenode.git
cd Geotreenode

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Update .env with your credentials
nano .env
```

## ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
DB_NAME=users

# JWT Secret
JWT_SECRET=your_jwt_secret_key_here

# PhonePe Configuration
PHONEPE_MERCHANT_ID=your_merchant_id
PHONEPE_SALT_KEY=your_salt_key
PHONEPE_SALT_INDEX=1
PHONEPE_BASE_URL=https://api.phonepe.com/apis/hermes

# App Configuration
APP_BASE_URL=https://your-domain.com
PORT=3000
```

## 🏃 Running the Server

### Development
```bash
npm start
```

### Production (with PM2)
```bash
npm run pm2:start
```

### Production Mode
```bash
npm run prod
```

## 📡 API Endpoints

### Base URL
```
http://localhost:3000
```

### 1. Check User / Register
**POST** `/user/check-user`

Check if user exists or register new user.

**Request Body:**
```json
{
  "mobile": 1234567890,
  "device_token": "optional_device_token"
}
```

**Response:**
```json
{
  "status": true,
  "message": "OTP sent successfully",
  "data": {
    "mobile": 1234567890,
    "otp": 1234,
    "mobile_verified": false
  }
}
```

---

### 2. OTP Verification
**POST** `/user/verify`

Verify OTP and get JWT token.

**Request Body:**
```json
{
  "mobile": 1234567890,
  "otp": 1234,
  "device_token": "device_token"
}
```

**Response:**
```json
{
  "status": true,
  "msg": "OTP verified successfully",
  "data": {
    "mobile": 1234567890,
    "token": "jwt_token_here"
  }
}
```

---

### 3. User Login
**POST** `/user/login`

Login with email and password.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "status": "true",
  "massagge": "User login Successfully",
  "data": {
    "email": "user@example.com",
    "token": "jwt_token_here"
  }
}
```

---

### 4. Create Payment
**POST** `/phonepe/create-payment`

Create a PhonePe payment transaction.

**Request Body:**
```json
{
  "amount": 100,
  "mobile": 1234567890
}
```

**Response:**
```json
{
  "success": true,
  "transactionId": "TXN_1234567890",
  "paymentId": "payment_id",
  "redirectUrl": "https://phonepe.com/payment/...",
  "data": { ... }
}
```

---

### 5. Payment Redirect Handler
**POST** `/phonepe/redirect`

Handle payment redirect from PhonePe.

**Request Body:**
```json
{
  "response": "base64_encoded_response",
  "checksum": "checksum_hash"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Redirect processed successfully",
  "payment": {
    "transactionId": "TXN_1234567890",
    "status": "SUCCESS",
    "amount": 100
  }
}
```

---

### 6. Payment Callback Handler
**POST** `/phonepe/callback`

Handle payment callback from PhonePe.

**Request Body:**
```json
{
  "response": "base64_encoded_response",
  "checksum": "checksum_hash"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Callback processed"
}
```

---

### 7. Check Payment Status
**GET** `/phonepe/status/:transactionId`

Check payment transaction status.

**Example:**
```
GET /phonepe/status/TXN_1234567890
```

**Response:**
```json
{
  "success": true,
  "payment": {
    "transactionId": "TXN_1234567890",
    "phonepeTransactionId": "phonepe_txn_id",
    "amount": 100,
    "status": "SUCCESS",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## 🔒 Authentication

Some endpoints require JWT token in headers:

```
Authorization: Bearer <jwt_token>
```

## 📦 Project Structure

```
Geotreenode/
├── config/
│   └── db.js                 # Database configuration
├── Controller/
│   ├── payment.controller.js # Payment logic
│   └── signup.controller.js  # Auth logic
├── middleware/
│   └── authentication.js     # JWT middleware
├── Models/
│   ├── payment.model.js      # Payment schema
│   └── user.model.js         # User schema
├── Routers/
│   └── Auth.route.js         # API routes
├── .env.example              # Environment template
├── ecosystem.config.js       # PM2 configuration
├── server.js                 # Main server file
└── package.json
```

## 🚀 Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy
```bash
bash .deploy.sh
```

## 🛠️ Available Scripts

- `npm start` - Start server
- `npm run dev` - Development mode
- `npm run prod` - Production mode
- `npm run pm2:start` - Start with PM2
- `npm run pm2:stop` - Stop PM2 process
- `npm run pm2:restart` - Restart PM2 process
- `npm run pm2:logs` - View PM2 logs

## 📝 Payment Status Values

- `PENDING` - Payment initiated
- `SUCCESS` - Payment successful
- `FAILED` - Payment failed
- `CANCELLED` - Payment cancelled

## 🔐 Security Features

- JWT token authentication
- Password hashing with bcrypt
- Environment variables for sensitive data
- CORS enabled
- Input validation

## 🐛 Error Handling

All endpoints return consistent error responses:

```json
{
  "status": false,
  "message": "Error message",
  "data": {}
}
```

## 📞 Support

For issues or questions, check the logs:
```bash
pm2 logs geotree-api
```

## 📄 License

ISC

## 👨‍💻 Author

Geotree Development Team

---

**Made with ❤️ for Geotree**
