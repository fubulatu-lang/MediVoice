import { config } from './config';
import { getAuthToken } from './auth';

export interface FormatNoteRequest {
  transcript: string;
  template: string; // "SOAP", "Consultation", etc.
}

export interface Note {
  id: string;
  transcript: string;
  soap_note: any; // JSON object
  template: string;
  created_at: string;
  updated_at: string;
}

export const formatNote = async (transcript: string, template = 'SOAP') => {
  const token = getAuthToken();
  const res = await fetch(`${config.api.baseUrl}/formatting/note`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ transcript, template }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail || 'Formatting failed');
  }
  return res.json();
};

export const saveNote = async (note: Partial<Note>) => {
  const token = getAuthToken();
  const res = await fetch(`${config.api.baseUrl}/notes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(note),
  });
  if (!res.ok) throw new Error('Failed to save note');
  return res.json();
};

export const getNotes = async (page = 1, limit = 20) => {
  const token = getAuthToken();
  const res = await fetch(`${config.api.baseUrl}/notes?page=${page}&limit=${limit}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) throw new Error('Failed to fetch notes');
  return res.json();
};
