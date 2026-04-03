import { Router } from 'express';
import multer from 'multer';
import { google } from 'googleapis';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { requireAuth } from '../middleware/requireAuth.js';

const router = Router();

const storage = multer.diskStorage({
  destination: os.tmpdir(),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `yt-upload-${Date.now()}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 * 1024 }, // 2 GB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('video/')) {
      cb(null, true);
    } else {
      cb(new Error('Only video files are allowed'));
    }
  },
});

router.post('/video', requireAuth, upload.single('video'), async (req, res) => {
  if (!req.file) {
    res.status(400).json({ error: 'No video file provided' });
    return;
  }

  const { title, description = '', privacyStatus = 'unlisted' } = req.body as {
    title?: string;
    description?: string;
    privacyStatus?: string;
  };

  if (!title) {
    fs.unlinkSync(req.file.path);
    res.status(400).json({ error: 'Title is required' });
    return;
  }

  const oauth2Client = (req as any).oauth2Client;
  const filePath = req.file.path;

  try {
    const youtube = google.youtube({ version: 'v3', auth: oauth2Client });

    const response = await youtube.videos.insert({
      part: ['snippet', 'status'],
      requestBody: {
        snippet: {
          title,
          description,
          categoryId: '22', // People & Blogs
        },
        status: {
          privacyStatus,
        },
      },
      media: {
        body: fs.createReadStream(filePath),
      },
    });

    const videoId = response.data.id;
    res.json({ success: true, videoId, url: `https://youtu.be/${videoId}` });
  } catch (err: any) {
    console.error('Upload error:', err);
    res.status(500).json({ error: err.message ?? 'Upload failed' });
  } finally {
    fs.unlink(filePath, () => {});
  }
});

export default router;
