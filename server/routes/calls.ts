import { Router, Request, Response } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { config } from '../config';
import { audioService } from '../services/audioService';
import { whisperService } from '../services/whisperService';
import { aiService } from '../services/aiService';
import {
  getCalls,
  getCallById,
  saveCallRecord,
  getLeadById,
  createLead,
  updateLead,
  addLeadActivity,
  CallRecord,
  Lead
} from '../storage';

const upload = multer({
  dest: config.paths.uploadDir,
  limits: { fileSize: 100 * 1024 * 1024 } // 100MB
});

export const callsRouter = Router();

/**
 * GET /api/calls
 * List all calls, optional filter by staffId or leadId
 */
callsRouter.get('/', (req: Request, res: Response) => {
  const staffId = req.query.staffId as string | undefined;
  const leadId = req.query.leadId as string | undefined;
  const calls = getCalls(staffId, leadId);
  res.json({ success: true, calls });
});

/**
 * GET /api/calls/:id
 * Retrieve single call record
 */
callsRouter.get('/:id', (req: Request, res: Response) => {
  const call = getCallById(req.params.id);
  if (!call) {
    return res.status(404).json({ success: false, error: 'Call record not found' });
  }
  res.json({ success: true, call });
});

/**
 * POST /api/calls/upload
 * The core merged workflow:
 * Upload -> Validate -> Chunk -> Whisper STT -> Combine Transcript -> AI Extraction -> Lead CRM Update -> Message Generation
 */
callsRouter.post('/upload', upload.single('audio'), async (req: Request, res: Response) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ success: false, error: 'No audio file provided in request (expected "audio" field).' });
  }

  const { leadId, staffId = 'staff-1', staffName = 'Sneha Kulkarni' } = req.body;
  const originalName = file.originalname || 'call_recording.mp3';

  try {
    // 1. Audio Validation
    const validation = await audioService.validateAudio(file.path, originalName, file.size);
    if (!validation.valid) {
      if (fs.existsSync(file.path)) fs.unlinkSync(file.path);
      return res.status(400).json({ success: false, error: validation.error });
    }

    const durationSec = validation.durationSec || 90;

    // 2. Audio Chunking (via ffmpeg)
    const chunks = await audioService.chunkAudio(file.path, durationSec, 120);

    // 3. Whisper Speech-to-Text on chunks & combine transcript
    const transcript = await whisperService.processChunksToTranscript(chunks, durationSec);

    // Clean up temporary chunk files
    audioService.cleanupChunks(chunks);
    if (fs.existsSync(file.path)) {
      // Retain the main audio in uploads for playback or archive
      const permanentPath = path.join(config.paths.uploadDir, `${Date.now()}_${path.basename(originalName)}`);
      fs.renameSync(file.path, permanentPath);
    }

    // 4. AI Analysis & Structured Lead Extraction
    const existingLead = leadId ? getLeadById(leadId) : null;
    const analysis = await aiService.analyzeTranscript(transcript, existingLead || undefined);

    // 5. Update or Create Lead
    let targetLead: Lead;
    if (existingLead) {
      const updated = updateLead(existingLead.id, {
        score: analysis.score,
        lastContact: 'Just now (Call Transcribed)',
        status: existingLead.status === 'New' ? 'Contacted' : existingLead.status,
        telegramUsername: transcript.detectedTelegramHandle || existingLead.telegramUsername || undefined,
        dealValue: analysis.dealValueNumber || existingLead.dealValue,
        requirements: analysis.requirements || existingLead.requirements,
        notes: `${existingLead.notes ? existingLead.notes + '\n\n' : ''}AI Call Summary: ${analysis.summary.overview}`,
        nextAction: `Follow-up: ${analysis.followUp}`
      });
      targetLead = updated || existingLead;
    } else {
      targetLead = createLead({
        name: analysis.customerName,
        company: analysis.company,
        email: analysis.email,
        phone: analysis.phone,
        country: analysis.location,
        industry: 'Enterprise Client',
        status: 'Contacted',
        score: analysis.score,
        dealValue: analysis.dealValueNumber,
        assignedStaffId: staffId,
        assignedStaffName: staffName,
        telegramUsername: transcript.detectedTelegramHandle || '',
        requirements: analysis.requirements,
        notes: `AI Extracted from Call: ${analysis.summary.overview}`,
        nextAction: analysis.followUp
      });
    }

    // 6. Generate synthetic audio waveform for UI player
    const waveformData = Array.from({ length: 32 }, () => Math.floor(Math.random() * 80) + 18);

    // 7. Assemble Call Record
    const callRecord: CallRecord = {
      id: `call-${Date.now()}`,
      leadId: targetLead.id,
      leadName: targetLead.name,
      staffId,
      staffName,
      startTime: new Date(Date.now() - durationSec * 1000).toISOString(),
      endTime: new Date().toISOString(),
      durationSeconds: durationSec,
      status: 'Completed',
      waveformData,
      transcript,
      summary: analysis.summary,
      recommendation: {
        type: 'EMAIL',
        title: 'GST Commercial Proposal',
        reason: 'AI detected high buying intent and explicit request for commercial terms.',
        priority: 'HIGH',
        generatedContent: {
          to: targetLead.email,
          subject: analysis.emailSubject,
          body: analysis.emailBody
        },
        isExecuted: false
      },
      resultingScore: analysis.score
    };

    saveCallRecord(callRecord);

    // 8. Log Call in Lead Activity Timeline
    const mins = Math.floor(durationSec / 60);
    const secs = durationSec % 60;
    addLeadActivity(targetLead.id, {
      id: `act-${Date.now()}`,
      leadId: targetLead.id,
      type: 'call',
      title: `Call Recording Analyzed (${mins}m ${secs}s)`,
      description: `Whisper audio transcribed into ${transcript.turns.length} dialogue turns. Sentiment: ${analysis.summary.sentimentScore}%. Predictive Lead Score: ${analysis.score.score}/100 (${analysis.score.category}).`,
      timestamp: new Date().toISOString(),
      performedBy: staffName,
      metadata: {
        callId: callRecord.id,
        durationSeconds: durationSec,
        keywords: analysis.keywords
      }
    });

    const finalLead = getLeadById(targetLead.id) || targetLead;

    return res.json({
      success: true,
      call: callRecord,
      lead: finalLead,
      analysis: {
        customerName: analysis.customerName,
        phone: analysis.phone,
        email: analysis.email,
        address: analysis.address,
        location: analysis.location,
        product: analysis.product,
        requirements: analysis.requirements,
        intent: analysis.intent,
        budget: analysis.budget,
        keywords: analysis.keywords,
        summary: analysis.summary,
        emailSubject: analysis.emailSubject,
        emailBody: analysis.emailBody,
        telegramMessage: analysis.telegramMessage,
        whatsappMessage: analysis.whatsappMessage
      }
    });
  } catch (err: any) {
    if (file && fs.existsSync(file.path)) fs.unlinkSync(file.path);
    console.error('Call upload pipeline error:', err);
    return res.status(500).json({ success: false, error: err.message || 'Internal audio processing failure.' });
  }
});

/**
 * POST /api/calls/process
 * Live Call Studio / Simulated call transcription & intelligence
 */
callsRouter.post('/process', async (req: Request, res: Response) => {
  const { leadId, durationSeconds = 60, staffId = 'staff-1', staffName = 'Sneha Kulkarni' } = req.body;
  if (!leadId) {
    return res.status(400).json({ success: false, error: 'leadId is required' });
  }

  const lead = getLeadById(leadId);
  if (!lead) {
    return res.status(404).json({ success: false, error: 'Lead not found' });
  }

  try {
    // Generate transcript via whisper chunk simulator
    const transcript = await whisperService.processChunksToTranscript(
      [{ index: 0, startTimeSec: 0, durationSec: durationSeconds, filePath: '' }],
      durationSeconds
    );

    const analysis = await aiService.analyzeTranscript(transcript, lead);

    // Update lead
    const updatedLead = updateLead(lead.id, {
      score: analysis.score,
      lastContact: 'Just now (Live Call Studio)',
      status: lead.status === 'New' ? 'Contacted' : lead.status,
      telegramUsername: transcript.detectedTelegramHandle || lead.telegramUsername,
      nextAction: `Follow-up: ${analysis.followUp}`
    });

    const waveformData = Array.from({ length: 32 }, () => Math.floor(Math.random() * 85) + 15);

    const callRecord: CallRecord = {
      id: `call-${Date.now()}`,
      leadId: lead.id,
      leadName: lead.name,
      staffId,
      staffName,
      startTime: new Date(Date.now() - durationSeconds * 1000).toISOString(),
      endTime: new Date().toISOString(),
      durationSeconds,
      status: 'Completed',
      waveformData,
      transcript,
      summary: analysis.summary,
      recommendation: {
        type: 'EMAIL',
        title: 'Automated GST Proposal Email',
        reason: 'AI detected high buying intent and explicit request for commercial terms.',
        priority: 'HIGH',
        generatedContent: {
          to: lead.email,
          subject: analysis.emailSubject,
          body: analysis.emailBody
        },
        isExecuted: false
      },
      resultingScore: analysis.score
    };

    saveCallRecord(callRecord);

    const mins = Math.floor(durationSeconds / 60);
    const secs = durationSeconds % 60;
    addLeadActivity(lead.id, {
      id: `act-${Date.now()}`,
      leadId: lead.id,
      type: 'call',
      title: `Call Completed (${mins}m ${secs}s)`,
      description: `Whisper audio analyzed. Sentiment Score: ${analysis.summary.sentimentScore}%. Predictive Lead Score: ${analysis.score.score}/100.`,
      timestamp: new Date().toISOString(),
      performedBy: staffName,
      metadata: { callId: callRecord.id, score: analysis.score.score }
    });

    res.json({
      success: true,
      call: callRecord,
      lead: updatedLead || lead,
      analysis
    });
  } catch (err: any) {
    console.error('Call process error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});
