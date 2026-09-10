import express from 'express';
import cors from 'cors';
import path from 'path';
import { config } from './config';
import { callsRouter } from './routes/calls';
import { leadsRouter } from './routes/leads';
import { emailRouter } from './routes/email';
import { telegramRouter } from './routes/telegram';
import { whatsappRouter } from './routes/whatsapp';
import { aiRouter } from './routes/ai';

export const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Serve uploaded audio files
app.use('/uploads', express.static(config.paths.uploadDir));

// Mount API routes
app.use('/api/calls', callsRouter);
app.use('/api/leads', leadsRouter);
app.use('/api/email', emailRouter);
app.use('/api/telegram', telegramRouter);
app.use('/api/whatsapp', whatsappRouter);
app.use('/api/ai', aiRouter);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Lead-IQ Unified Backend',
    telegramConfigured: Boolean(config.telegram.botToken),
    geminiConfigured: Boolean(config.gemini.apiKey),
    smtpConfigured: Boolean(config.smtp.user && config.smtp.pass)
  });
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal Server Error'
  });
});

// Start standalone server when executed directly
const isDirectRun = process.argv[1] && process.argv[1].includes('server');
if (isDirectRun || process.env.RUN_STANDALONE === 'true') {
  const PORT = config.port;
  app.listen(PORT, () => {
    console.log(`🚀 Lead-IQ Backend Server running on http://localhost:${PORT}`);
    console.log(`📡 Health Check: http://localhost:${PORT}/api/health`);
    console.log(`🎙️ Whisper STT Pipeline: Active`);
    console.log(`💬 Telegram Bot Gateway: ${config.telegram.botToken ? 'Active (@' + config.telegram.botUsername + ')' : 'Demo Mode'}`);
    console.log(`✉️ Email Gateway (SMTP): ${config.smtp.user ? 'Active (' + config.smtp.user + ')' : 'Demo Sandbox'}`);
  });
}
