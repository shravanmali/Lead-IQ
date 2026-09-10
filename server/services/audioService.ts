import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';
import { config } from '../config';

const execAsync = promisify(exec);

export interface AudioChunk {
  index: number;
  startTimeSec: number;
  durationSec: number;
  filePath: string;
}

export interface AudioValidationResult {
  valid: boolean;
  error?: string;
  durationSec?: number;
  format?: string;
  sizeBytes?: number;
}

const SUPPORTED_EXTENSIONS = new Set([
  '.mp3', '.wav', '.m4a', '.webm', '.ogg', '.flac', '.mp4', '.aac'
]);

export const audioService = {
  /**
   * Validates uploaded audio file
   */
  async validateAudio(filePath: string, originalName: string, sizeBytes: number): Promise<AudioValidationResult> {
    if (!fs.existsSync(filePath)) {
      return { valid: false, error: 'Uploaded file not found on server.' };
    }

    const ext = path.extname(originalName).toLowerCase();
    if (!SUPPORTED_EXTENSIONS.has(ext)) {
      return {
        valid: false,
        error: `Unsupported audio format: ${ext}. Supported formats: MP3, WAV, M4A, WEBM, OGG, FLAC, MP4.`
      };
    }

    if (sizeBytes > 100 * 1024 * 1024) {
      return { valid: false, error: 'File size exceeds maximum limit (100MB).' };
    }

    try {
      // Get audio duration using ffprobe/ffmpeg
      const { stdout } = await execAsync(
        `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${filePath}"`
      );
      const durationSec = parseFloat(stdout.trim()) || 60;
      return {
        valid: true,
        durationSec: Math.round(durationSec),
        format: ext.replace('.', '').toUpperCase(),
        sizeBytes
      };
    } catch {
      // Fallback: estimate from file size if ffprobe fails
      return {
        valid: true,
        durationSec: Math.max(30, Math.min(1800, Math.round(sizeBytes / (32 * 1024)))),
        format: ext.replace('.', '').toUpperCase(),
        sizeBytes
      };
    }
  },

  /**
   * Splits audio into chunks of target chunkDurationSec (default 120 seconds)
   */
  async chunkAudio(filePath: string, totalDurationSec: number, chunkDurationSec: number = 120): Promise<AudioChunk[]> {
    const chunksDir = path.join(config.paths.uploadDir, `chunks_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`);
    fs.mkdirSync(chunksDir, { recursive: true });

    // If duration is short, return a single chunk converted to standard MP3
    if (totalDurationSec <= chunkDurationSec) {
      const singleChunkPath = path.join(chunksDir, 'chunk_0.mp3');
      try {
        await execAsync(`ffmpeg -y -i "${filePath}" -vn -ar 16000 -ac 1 -b:a 64k "${singleChunkPath}"`);
        return [{
          index: 0,
          startTimeSec: 0,
          durationSec: totalDurationSec,
          filePath: singleChunkPath
        }];
      } catch {
        return [{
          index: 0,
          startTimeSec: 0,
          durationSec: totalDurationSec,
          filePath
        }];
      }
    }

    const chunks: AudioChunk[] = [];
    let currentStart = 0;
    let index = 0;

    while (currentStart < totalDurationSec) {
      const currentDuration = Math.min(chunkDurationSec, totalDurationSec - currentStart);
      const chunkPath = path.join(chunksDir, `chunk_${index}.mp3`);

      try {
        await execAsync(
          `ffmpeg -y -ss ${currentStart} -t ${currentDuration} -i "${filePath}" -vn -ar 16000 -ac 1 -b:a 64k "${chunkPath}"`
        );
        chunks.push({
          index,
          startTimeSec: currentStart,
          durationSec: currentDuration,
          filePath: chunkPath
        });
      } catch (err) {
        console.warn(`Failed to split chunk ${index} with ffmpeg:`, err);
        // If ffmpeg chunking errors, break and use remaining
        break;
      }

      currentStart += chunkDurationSec;
      index++;
    }

    if (chunks.length === 0) {
      // Fallback: single chunk
      chunks.push({
        index: 0,
        startTimeSec: 0,
        durationSec: totalDurationSec,
        filePath
      });
    }

    return chunks;
  },

  /**
   * Cleans up temporary chunk directory
   */
  cleanupChunks(chunks: AudioChunk[]) {
    try {
      for (const chunk of chunks) {
        if (fs.existsSync(chunk.filePath)) {
          fs.unlinkSync(chunk.filePath);
        }
      }
      if (chunks.length > 0) {
        const dir = path.dirname(chunks[0].filePath);
        if (fs.existsSync(dir) && dir.includes('chunks_')) {
          fs.rmSync(dir, { recursive: true, force: true });
        }
      }
    } catch (err) {
      console.warn('Failed to clean up chunk files:', err);
    }
  }
};
