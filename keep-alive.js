// Keep-alive script to prevent Render free tier from sleeping
// Run this on a separate service or use a cron job

import axios from 'axios';

const API_URL = process.env.API_URL || 'https://geotree-api.onrender.com';

async function pingServer() {
  try {
    const response = await axios.get(`${API_URL}/health`, {
      timeout: 10000
    });
    console.log(`✅ Server pinged successfully at ${new Date().toISOString()}`);
    console.log(`Response:`, response.data);
  } catch (error) {
    console.error(`❌ Failed to ping server:`, error.message);
  }
}

// Ping every 10 minutes (600000 ms)
// Render free tier sleeps after 15 minutes of inactivity
setInterval(pingServer, 10 * 60 * 1000);

// Ping immediately
pingServer();

console.log('🔄 Keep-alive service started. Pinging every 10 minutes...');

