const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001';

export interface AuthStatus {
  connected: boolean;
  channelName?: string;
}

export interface UploadResult {
  success: boolean;
  videoId: string;
  url: string;
}

export async function getAuthStatus(): Promise<AuthStatus> {
  const res = await fetch(`${API_URL}/auth/status`, { credentials: 'include' });
  return res.json();
}

export async function disconnectAuth(): Promise<void> {
  await fetch(`${API_URL}/auth/disconnect`, {
    method: 'POST',
    credentials: 'include',
  });
}

export async function uploadVideo(formData: FormData): Promise<UploadResult> {
  const res = await fetch(`${API_URL}/upload/video`, {
    method: 'POST',
    credentials: 'include',
    body: formData,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: 'Upload failed' }));
    throw new Error(err.error ?? 'Upload failed');
  }
  return res.json();
}

export function getGoogleAuthUrl(): string {
  return `${API_URL}/auth/google`;
}
