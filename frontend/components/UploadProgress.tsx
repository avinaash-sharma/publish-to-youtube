'use client';

export type UploadStatus = 'idle' | 'uploading' | 'done' | 'error';

interface Props {
  status: UploadStatus;
  videoId?: string;
  error?: string;
}

export default function UploadProgress({ status, videoId, error }: Props) {
  if (status === 'idle') return null;

  if (status === 'uploading') {
    return (
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <div className="flex items-center gap-3">
          <div className="h-5 w-5 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
          <div>
            <p className="text-sm font-medium text-blue-900">Uploading to YouTube...</p>
            <p className="text-xs text-blue-600 mt-0.5">This may take a few minutes for large files</p>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'done' && videoId) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
            <svg className="h-5 w-5 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-green-900">Video published successfully!</p>
            <a
              href={`https://youtu.be/${videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-green-700 hover:text-green-800 underline"
            >
              View on YouTube →
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
            <svg className="h-5 w-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-red-900">Upload failed</p>
            {error && <p className="text-xs text-red-600 mt-0.5">{error}</p>}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
