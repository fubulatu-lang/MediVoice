import { toast } from "sonner";

class ApiClient {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

  private async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const res = await fetch(`${this.baseUrl}${endpoint}`, {
      credentials: "include",
      headers: { "Content-Type": "application/json", ...options.headers },
      ...options,
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: "Request failed" }));
      throw new Error(error.detail || `HTTP ${res.status}`);
    }
    if (res.status === 204) return {} as T;
    return res.json();
  }

  async uploadAudio(blob: Blob): Promise<string> {
    const formData = new FormData();
    formData.append("file", blob, "recording.webm");
    const res = await fetch(`${this.baseUrl}/transcriptions`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });
    if (!res.ok) {
      const error = await res.json().catch(() => ({ detail: "Upload failed" }));
      throw new Error(error.detail);
    }
    const data = await res.json();
    return data.task_id;
  }

  async listNotes(page = 1, limit = 10) {
    return this.fetch<{ tasks: any[]; total: number }>(`/transcriptions?page=${page}&limit=${limit}`);
  }

  async getNote(id: string) {
    return this.fetch<any>(`/transcriptions/${id}`);
  }

  async deleteNote(id: string) {
    return this.fetch(`/transcriptions/${id}`, { method: "DELETE" });
  }

  async login(email: string, password: string) {
    return this.fetch("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });
  }

  async register(email: string, password: string, fullName: string) {
    return this.fetch("/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password, full_name: fullName }),
    });
  }

  async logout() {
    return this.fetch("/auth/logout", { method: "POST" });
  }

  async getMe() {
    return this.fetch("/auth/me");
  }
}

export const apiClient = new ApiClient();
