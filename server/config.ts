import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import dns from 'dns';

// Optimize DNS lookup on Windows to prefer IPv4 and prevent EAI_AGAIN errors
try {
  dns.setDefaultResultOrder('ipv4first');
} catch {}

// Load .env.local first, fallback to .env
const envLocalPath = path.resolve(process.cwd(), '.env.local');
if (fs.existsSync(envLocalPath)) {
  dotenv.config({ path: envLocalPath });
} else {
  dotenv.config();
}

export const config = {
  port: Number(process.env.PORT) || 5001,
  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN?.trim() || '',
    botUsername: process.env.TELEGRAM_BOT_USERNAME?.trim() || 'Lead_IQ_bot',
  },
  gemini: {
    apiKey: process.env.GEMINI_API_KEY?.trim() || '',
    model: process.env.GEMINI_MODEL?.trim() || 'gemini-3.6-flash',
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY?.trim() || '',
  },
  smtp: {
    host: process.env.SMTP_HOST?.trim() || 'smtp.gmail.com',
    port: Number(process.env.SMTP_PORT) || 465,
    user: process.env.SMTP_USER?.trim() || '',
    pass: (process.env.SMTP_PASS?.trim() || '').replace(/\s+/g, ''),
    from: process.env.EMAIL_FROM?.trim() || 'Shravan Mali (Lead-IQ) <shravan18loco9@gmail.com>',
  },
  paths: {
    dataDir: path.resolve(process.cwd(), 'data'),
    uploadDir: path.resolve(process.cwd(), 'uploads'),
  }
};
