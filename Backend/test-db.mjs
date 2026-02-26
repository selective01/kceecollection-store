import dotenv from 'dotenv';
import mongoose from 'mongoose';
import dns from 'node:dns/promises';

dotenv.config();

// Force Node's DNS resolver to use public DNS servers for SRV lookups
// This can help when the system DNS blocks SRV (ECONNREFUSED).
try {
  dns.setServers(['8.8.8.8', '8.8.4.4']);
  console.log('DNS servers set to Google (8.8.8.8, 8.8.4.4)');
} catch (e) {
  console.warn('Could not set DNS servers:', e.message || e);
}

(async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });
    console.log('Connected to', conn.connection.host);
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Connection error:', err);
    process.exit(1);
  }
})();
