'use client';

import { useState } from 'react';
import AuthStatus from '@/components/AuthStatus';
import VideoUploadForm from '@/components/VideoUploadForm';
import UploadProgress, { type UploadStatus } from '@/components/UploadProgress';

export default function Home() {
  const [isConnected, setIsConnected] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<UploadStatus>('idle');
  const [videoId, setVideoId] = useState<string | undefined>();
  const [uploadError, setUploadError] = useState<string | undefined>();

  function handleUploadStart() {
    setUploadStatus('uploading');
    setVideoId(undefined);
    setUploadError(undefined);
  }

  function handleUploadDone(id: string) {
    setVideoId(id);
    setUploadStatus('done');
  }

  function handleUploadError(err: string) {
    setUploadError(err);
    setUploadStatus('error');
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="h-7 w-7 text-red-600" viewBox="0 0 24 24" fill="currentColor">
              <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
            </svg>
            <h1 className="text-lg font-semibold text-gray-900">YouTube Publisher</h1>
          </div>
          <AuthStatus onStatusChange={setIsConnected} />
        </div>
      </header>

      {/* Main content */}
      <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-1">Upload a Video</h2>
          <p className="text-sm text-gray-500 mb-6">
            Select a video file, add metadata, and publish directly to your YouTube channel.
          </p>

          <VideoUploadForm
            isConnected={isConnected}
            onUploadStart={handleUploadStart}
            onUploadDone={handleUploadDone}
            onUploadError={handleUploadError}
          />
        </div>

        <UploadProgress
          status={uploadStatus}
          videoId={videoId}
          error={uploadError}
        />
      </div>
    </main>
  );
}
