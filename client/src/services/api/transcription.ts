// client/src/services/api/transcription.ts

import { apiClient } from './client';

export const uploadAudio = async (audioFile: File, onProgress?: (progress: number) => void): Promise<string> => {
  try {
    const response = await apiClient.uploadFile<{ transcript: string }>('/transcribe', audioFile, onProgress);
    return response.transcript;
  } catch (error) {
    console.error('Upload failed:', error);
    throw error;
  }
};