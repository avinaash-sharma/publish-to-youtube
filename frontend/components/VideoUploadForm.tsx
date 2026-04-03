'use client';

import { useRef, useState } from 'react';
import { uploadVideo } from '@/lib/api';
import { type UploadStatus } from './UploadProgress';

interface Props {
  isConnected: boolean;
  onUploadStart: () => void;
  onUploadDone: (videoId: string) => void;
  onUploadError: (error: string) => void;
}

export default function VideoUploadForm({ isConnected, onUploadStart, onUploadDone, onUploadError }: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [privacyStatus, setPrivacyStatus] = useState<'unlisted' | 'private' | 'public'>('unlisted');
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const canSubmit = isConnected && !!file && title.trim().length > 0 && !uploading;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!file || !canSubmit) return;

    const formData = new FormData();
    formData.append('video', file);
    formData.append('title', title.trim());
    formData.append('description', description);
    formData.append('privacyStatus', privacyStatus);

    setUploading(true);
    onUploadStart();

    try {
      const result = await uploadVideo(formData);
      onUploadDone(result.videoId);
      // Reset form
      setFile(null);
      setTitle('');
      setDescription('');
      setPrivacyStatus('unlisted');
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err: any) {
      onUploadError(err.message ?? 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* File picker */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Video file <span className="text-red-500">*</span>
        </label>
        <div
          className="relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-8 text-center hover:border-gray-400 transition-colors cursor-pointer"
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            className="hidden"
            onChange={(e) => setFile(e.target.files?.[0] ?? null)}
          />
          {file ? (
            <div className="space-y-1">
              <div className="flex items-center gap-2 justify-center">
                <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.36a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <p className="text-sm font-medium text-gray-800">{file.name}</p>
              </div>
              <p className="text-xs text-gray-500">{(file.size / (1024 * 1024)).toFixed(1)} MB — click to change</p>
            </div>
          ) : (
            <>
              <svg className="h-10 w-10 text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-sm text-gray-600">Click to select a video file</p>
              <p className="text-xs text-gray-400 mt-1">MP4, MOV, AVI, MKV — up to 2 GB</p>
            </>
          )}
        </div>
      </div>

      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1.5">
          Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter video title"
          maxLength={100}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder-gray-400 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
        />
        <p className="text-xs text-gray-400 mt-1 text-right">{title.length}/100</p>
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1.5">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter video description (optional)"
          rows={3}
          maxLength={5000}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm placeholder-gray-400 focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 resize-none"
        />
      </div>

      {/* Privacy */}
      <div>
        <label htmlFor="privacy" className="block text-sm font-medium text-gray-700 mb-1.5">
          Privacy
        </label>
        <select
          id="privacy"
          value={privacyStatus}
          onChange={(e) => setPrivacyStatus(e.target.value as typeof privacyStatus)}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500"
        >
          <option value="unlisted">Unlisted (recommended for testing)</option>
          <option value="private">Private</option>
          <option value="public">Public</option>
        </select>
      </div>

      {/* Submit */}
      {!isConnected && (
        <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 rounded-md px-3 py-2">
          Connect your YouTube account above before publishing.
        </p>
      )}

      <button
        type="submit"
        disabled={!canSubmit}
        className="w-full rounded-md bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        {uploading ? 'Publishing...' : 'Publish to YouTube'}
      </button>
    </form>
  );
}
