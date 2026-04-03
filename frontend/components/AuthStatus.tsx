'use client';

import { useEffect, useState } from 'react';
import { getAuthStatus, disconnectAuth, getGoogleAuthUrl, type AuthStatus } from '@/lib/api';

interface Props {
  onStatusChange: (connected: boolean) => void;
}

export default function AuthStatus({ onStatusChange }: Props) {
  const [status, setStatus] = useState<AuthStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [disconnecting, setDisconnecting] = useState(false);

  async function fetchStatus() {
    try {
      const s = await getAuthStatus();
      setStatus(s);
      onStatusChange(s.connected);
    } catch {
      setStatus({ connected: false });
      onStatusChange(false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchStatus();
  }, []);

  async function handleDisconnect() {
    setDisconnecting(true);
    await disconnectAuth();
    setStatus({ connected: false });
    onStatusChange(false);
    setDisconnecting(false);
  }

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <div className="h-2 w-2 rounded-full bg-gray-300 animate-pulse" />
        Checking connection...
      </div>
    );
  }

  if (status?.connected) {
    return (
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500" />
          <span className="text-sm text-gray-700">
            Connected as <span className="font-medium">{status.channelName}</span>
          </span>
        </div>
        <button
          onClick={handleDisconnect}
          disabled={disconnecting}
          className="text-sm text-red-600 hover:text-red-700 underline disabled:opacity-50"
        >
          {disconnecting ? 'Disconnecting...' : 'Disconnect'}
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center gap-2">
        <div className="h-2 w-2 rounded-full bg-gray-400" />
        <span className="text-sm text-gray-500">Not connected</span>
      </div>
      <a
        href={getGoogleAuthUrl()}
        className="inline-flex items-center gap-2 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
      >
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.17 8.17 0 004.77 1.52V6.76a4.85 4.85 0 01-1-.07z" />
        </svg>
        Connect YouTube
      </a>
    </div>
  );
}
