import React, { useState, useRef, useEffect } from 'react';
import {
  UploadCloud,
  FileAudio,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Layers,
  Mic,
  ArrowRight,
  RefreshCw,
  X,
  FileText,
  User,
  Building,
  Phone,
  Mail,
  Zap,
  Tag
} from 'lucide-react';
import { Modal } from '../common/Modal';
import { Lead } from '../../types/lead';
import { CallRecord } from '../../types/call';
import { callService } from '../../services/callService';
import { leadService } from '../../services/leadService';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import { formatINR } from '../../utils/formatters';

interface AudioUploadModalProps {
  isOpen: boolean;
  preselectedLead?: Lead | null;
  onClose: () => void;
  onSuccess: (call: CallRecord, lead?: Lead) => void;
}

type PipelineStep =
  | 'idle'
  | 'uploading'
  | 'chunking'
  | 'transcribing'
  | 'extracting'
  | 'synthesizing'
  | 'completed';

export const AudioUploadModal: React.FC<AudioUploadModalProps> = ({
  isOpen,
  preselectedLead,
  onClose,
  onSuccess
}) => {
  const { user } = useAuth();
  const { showToast } = useToast();

  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState<string>(preselectedLead?.id || '');
  const [leadsList, setLeadsList] = useState<Lead[]>([]);
  const [currentStep, setCurrentStep] = useState<PipelineStep>('idle');
  const [resultCall, setResultCall] = useState<CallRecord | null>(null);
  const [resultLead, setResultLead] = useState<Lead | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setFile(null);
      setCurrentStep('idle');
      setResultCall(null);
      setResultLead(null);
      setErrorMessage(null);
      setSelectedLeadId(preselectedLead?.id || '');

      leadService.getLeads().then(data => {
        setLeadsList(data);
      }).catch(() => {});
    }
  }, [isOpen, preselectedLead]);

  if (!isOpen) return null;

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile: File) => {
    setErrorMessage(null);
    const validExtensions = [
      '.mp3', '.wav', '.m4a', '.webm', '.ogg', '.opus', '.oga',
      '.aac', '.mp4', '.amr', '.3gp', '.3gpp', '.flac', '.wma',
      '.caf', '.aiff', '.aif', '.m4b', '.m4r', '.mov', '.mkv'
    ];
    const name = selectedFile.name.toLowerCase();
    const isKnownExt = validExtensions.some(ext => name.endsWith(ext));
    const isAudioOrMedia =
      isKnownExt ||
      selectedFile.type.startsWith('audio/') ||
      selectedFile.type.startsWith('video/') ||
      selectedFile.type === 'application/ogg' ||
      selectedFile.type === 'application/octet-stream' ||
      selectedFile.type === '';

    if (!isAudioOrMedia) {
      setErrorMessage('Please select a valid audio recording (.mp3, .wav, .m4a, .ogg, .opus, .aac, .amr, .3gp, .webm, or .mp4)');
      return;
    }

    if (selectedFile.size > 100 * 1024 * 1024) {
      setErrorMessage('Audio file size exceeds 100MB limit.');
      return;
    }

    setFile(selectedFile);
  };

  const handleStartProcessing = async () => {
    if (!file) {
      setErrorMessage('Please select or drop an audio recording file first.');
      return;
    }

    setErrorMessage(null);
    setCurrentStep('uploading');

    // Progressive step simulation ticker while request is executing
    const stepTimer1 = setTimeout(() => setCurrentStep('chunking'), 1200);
    const stepTimer2 = setTimeout(() => setCurrentStep('transcribing'), 2800);
    const stepTimer3 = setTimeout(() => setCurrentStep('extracting'), 5800);
    const stepTimer4 = setTimeout(() => setCurrentStep('synthesizing'), 8400);

    try {
      const response = await callService.uploadCallRecording(
        file,
        selectedLeadId || undefined,
        user?.id,
        user?.name
      );

      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);
      clearTimeout(stepTimer4);

      setCurrentStep('completed');
      setResultCall(response.call);
      if (response.lead) {
        setResultLead(response.lead);
      }

      showToast(
        'Call Recording Analyzed',
        `Whisper transcription complete. Lead intelligence synthesized.`,
        'success'
      );
    } catch (err: any) {
      clearTimeout(stepTimer1);
      clearTimeout(stepTimer2);
      clearTimeout(stepTimer3);
      clearTimeout(stepTimer4);

      setCurrentStep('idle');
      setErrorMessage(err.message || 'Failed to process audio recording');
      showToast('Processing Error', err.message || 'Audio pipeline failed', 'error');
    }
  };

  const handleFinish = () => {
    if (resultCall) {
      onSuccess(resultCall, resultLead || undefined);
    }
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={currentStep !== 'idle' && currentStep !== 'completed' ? () => {} : onClose}
      title="Upload Call Recording & Whisper STT Pipeline"
      subtitle="Automated ffmpeg chunking, Whisper transcription, and Gemini lead extraction"
      maxWidth="680px"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* COMPLETED STATE */}
        {currentStep === 'completed' && resultCall ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div
              style={{
                padding: '1.25rem',
                borderRadius: 'var(--radius-lg)',
                backgroundColor: 'rgba(79, 242, 176, 0.08)',
                border: '1px solid rgba(79, 242, 176, 0.25)',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}
            >
              <div
                style={{
                  width: '44px',
                  height: '44px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(79, 242, 176, 0.2)',
                  color: 'var(--brand-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                <CheckCircle2 size={24} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                  Audio Pipeline Completed Successfully!
                </h3>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', margin: '0.2rem 0 0' }}>
                  {resultCall.durationSeconds}s audio analyzed • {resultCall.transcript.turns.length} dialogue turns transcribed • Score: {resultCall.resultingScore.score}/100
                </p>
              </div>
            </div>

            {/* Extracted Intelligence Card */}
            <div className="glass-card" style={{ padding: '1.25rem', borderRadius: 'var(--radius-md)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--brand-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                  Extracted Lead Profile
                </span>
                <span className="badge badge-success" style={{ fontSize: '0.72rem' }}>
                  {resultCall.resultingScore.category.toUpperCase()} LEAD
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '1rem' }}>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Lead / Prospect</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {resultLead?.name || resultCall.leadName}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Company</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {resultLead?.company || 'Enterprise Prospect'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Estimated Deal Value</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--brand-primary)' }}>
                    {resultLead ? formatINR(resultLead.dealValue) : '₹12,50,000'}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Sentiment Score</div>
                  <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#10b981' }}>
                    {resultCall.summary.sentimentScore}% Positive
                  </div>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.75rem' }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
                  Executive AI Summary
                </div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0 }}>
                  {resultCall.summary.overview}
                </p>
              </div>

              {resultCall.transcript.extractedKeyPoints && resultCall.transcript.extractedKeyPoints.length > 0 && (
                <div style={{ marginTop: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {resultCall.transcript.extractedKeyPoints.map((pt, i) => (
                    <span
                      key={i}
                      style={{
                        fontSize: '0.72rem',
                        padding: '0.2rem 0.6rem',
                        borderRadius: 'var(--radius-full)',
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid var(--border-subtle)',
                        color: 'var(--text-primary)'
                      }}
                    >
                      • {pt}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              {resultLead && (
                <a
                  href={`#/staff/leads/${resultLead.id}`}
                  onClick={onClose}
                  className="btn btn-secondary"
                  style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  <User size={14} />
                  <span>Open Lead Dossier</span>
                </a>
              )}
              <button onClick={handleFinish} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span>Done & View Recordings</span>
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ) : currentStep !== 'idle' ? (
          /* PROCESSING / STEPPED PIPELINE STATE */
          <div style={{ padding: '1.5rem 0', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, rgba(79, 242, 176, 0.2) 0%, rgba(32, 201, 151, 0.1) 100%)',
                  border: '2px solid rgba(79, 242, 176, 0.4)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                  color: 'var(--brand-primary)',
                  boxShadow: '0 0 24px rgba(79, 242, 176, 0.3)'
                }}
              >
                <RefreshCw size={28} className="animate-spin" />
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>
                Processing Audio Recording
              </h3>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
                Executing automated chunking & speech-to-text pipeline for <strong>{file?.name}</strong>
              </p>
            </div>

            {/* Stepped Progress Checklist */}
            <div
              className="glass-card"
              style={{
                padding: '1.25rem',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.875rem'
              }}
            >
              {[
                {
                  key: 'uploading',
                  label: 'Step 1: Uploading Audio & Format Validation',
                  desc: 'Uploading to secure sandbox, validating header & sampling rate'
                },
                {
                  key: 'chunking',
                  label: 'Step 2: ffmpeg Audio Segmentation (120s Chunks)',
                  desc: 'Dividing audio into standard chunks to preserve precision and prevent timeouts'
                },
                {
                  key: 'transcribing',
                  label: 'Step 3: Whisper Speech-to-Text Transcription',
                  desc: 'Transcribing speech chunks with speaker diarization & timecode alignment'
                },
                {
                  key: 'extracting',
                  label: 'Step 4: AI Lead & Entity Extraction',
                  desc: 'Extracting prospect name, phone, company, requirements, and telegram handles'
                },
                {
                  key: 'synthesizing',
                  label: 'Step 5: Multi-Channel Follow-up Synthesis',
                  desc: 'Generating tailored Email, Telegram, and WhatsApp business drafts'
                }
              ].map((step, idx) => {
                const stepOrder: PipelineStep[] = [
                  'uploading',
                  'chunking',
                  'transcribing',
                  'extracting',
                  'synthesizing'
                ];
                const currentIndex = stepOrder.indexOf(currentStep);
                const isDone = currentIndex > idx;
                const isCurrent = currentIndex === idx;

                return (
                  <div
                    key={step.key}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '0.875rem',
                      opacity: isDone || isCurrent ? 1 : 0.45,
                      transition: 'opacity 0.3s'
                    }}
                  >
                    <div
                      style={{
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%',
                        backgroundColor: isDone
                          ? 'rgba(79, 242, 176, 0.2)'
                          : isCurrent
                          ? 'rgba(79, 242, 176, 0.1)'
                          : 'rgba(255, 255, 255, 0.05)',
                        border: isDone || isCurrent
                          ? '1px solid var(--brand-primary)'
                          : '1px solid var(--border-subtle)',
                        color: isDone || isCurrent ? 'var(--brand-primary)' : 'var(--text-muted)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        flexShrink: 0
                      }}
                    >
                      {isDone ? (
                        <CheckCircle2 size={14} />
                      ) : isCurrent ? (
                        <RefreshCw size={12} className="animate-spin" />
                      ) : (
                        idx + 1
                      )}
                    </div>
                    <div>
                      <div
                        style={{
                          fontSize: '0.84rem',
                          fontWeight: 700,
                          color: isCurrent ? 'var(--brand-primary)' : 'var(--text-primary)'
                        }}
                      >
                        {step.label}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                        {step.desc}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* IDLE / UPLOAD SELECTION STATE */
          <>
            {errorMessage && (
              <div
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(239, 68, 68, 0.12)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  color: '#f87171',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontSize: '0.8125rem'
                }}
              >
                <AlertCircle size={16} />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Target Lead Assignment Selector */}
            <div>
              <label style={{ display: 'block', fontSize: '0.8125rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem' }}>
                Associate with Lead / Prospect:
              </label>
              <select
                value={selectedLeadId}
                onChange={e => setSelectedLeadId(e.target.value)}
                style={{
                  width: '100%',
                  padding: '0.625rem 0.875rem',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid var(--border-subtle)',
                  color: 'var(--text-primary)',
                  fontSize: '0.84rem'
                }}
              >
                <option value="" style={{ background: '#0e1713', color: '#fff' }}>
                  ✨ Auto-Extract & Create New Lead from Audio Conversation
                </option>
                {leadsList.map(l => (
                  <option key={l.id} value={l.id} style={{ background: '#0e1713', color: '#fff' }}>
                    {l.name} — {l.company} ({l.country})
                  </option>
                ))}
              </select>
            </div>

            {/* Drag & Drop Audio Box */}
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{
                border: dragActive
                  ? '2px dashed var(--brand-primary)'
                  : file
                  ? '1px solid rgba(79, 242, 176, 0.4)'
                  : '2px dashed var(--border-subtle)',
                borderRadius: 'var(--radius-lg)',
                padding: '2.5rem 1.5rem',
                textAlign: 'center',
                backgroundColor: dragActive
                  ? 'rgba(79, 242, 176, 0.08)'
                  : file
                  ? 'rgba(79, 242, 176, 0.04)'
                  : 'rgba(255, 255, 255, 0.02)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.85rem'
              }}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="audio/*,video/*,.mp3,.wav,.m4a,.webm,.ogg,.opus,.oga,.aac,.mp4,.amr,.3gp,.flac,.wma"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />

              <div
                style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: file
                    ? 'rgba(79, 242, 176, 0.15)'
                    : 'rgba(255, 255, 255, 0.05)',
                  color: file ? 'var(--brand-primary)' : 'var(--text-muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {file ? <FileAudio size={28} /> : <UploadCloud size={28} />}
              </div>

              {file ? (
                <div>
                  <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {file.name}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--brand-primary)', marginTop: '0.2rem' }}>
                    {(file.size / (1024 * 1024)).toFixed(2)} MB • Audio Ready for Chunking & Transcription
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setFile(null);
                    }}
                    className="btn btn-secondary btn-sm"
                    style={{ marginTop: '0.75rem', fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}
                  >
                    Change File
                  </button>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    Drop customer call recording here, or click to browse
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.35rem' }}>
                    Supported: MP3, WAV, M4A, WEBM, OGG, OPUS, AMR, AAC, MP4 (Up to 100MB)
                  </div>
                </div>
              )}
            </div>

            {/* Pipeline Notice */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.625rem',
                fontSize: '0.78rem',
                color: 'var(--text-secondary)',
                backgroundColor: 'rgba(255, 255, 255, 0.02)',
                padding: '0.75rem 1rem',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-subtle)'
              }}
            >
              <Sparkles size={16} style={{ color: 'var(--brand-primary)', flexShrink: 0 }} />
              <span>
                Files longer than 2 minutes are automatically split into seamless 120s segments with ffmpeg and processed through Whisper STT & Gemini 3.6 Flash.
              </span>
            </div>

            {/* Footer Buttons */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
              <button onClick={onClose} className="btn btn-secondary">
                Cancel
              </button>
              <button
                onClick={handleStartProcessing}
                disabled={!file}
                className="btn btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 700 }}
              >
                <Mic size={15} />
                <span>Start Whisper Intelligence</span>
              </button>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};
