import { Router } from 'express';
import { google } from 'googleapis';
import { createOAuth2Client, SCOPES } from '../lib/google.js';

const router = Router();

// Redirect user to Google OAuth consent screen
router.get('/google', (_req, res) => {
  const oauth2Client = createOAuth2Client();
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent',
  });
  res.redirect(url);
});

// Handle OAuth callback — exchange code for tokens
router.get('/google/callback', async (req, res) => {
  const code = req.query.code as string;
  if (!code) {
    res.status(400).json({ error: 'Missing authorization code' });
    return;
  }

  try {
    const oauth2Client = createOAuth2Client();
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Fetch channel name for display
    const youtube = google.youtube({ version: 'v3', auth: oauth2Client });
    const channelRes = await youtube.channels.list({ part: ['snippet'], mine: true });
    const channelName = channelRes.data.items?.[0]?.snippet?.title ?? 'Unknown Channel';

    (req.session as any).tokens = tokens;
    (req.session as any).channelName = channelName;

    const frontendUrl = process.env.FRONTEND_URL ?? 'http://localhost:3000';
    res.redirect(frontendUrl);
  } catch (err) {
    console.error('OAuth callback error:', err);
    res.status(500).json({ error: 'Failed to exchange authorization code' });
  }
});

// Return connection status
router.get('/status', (req, res) => {
  const tokens = (req.session as any).tokens;
  const channelName = (req.session as any).channelName;
  if (tokens) {
    res.json({ connected: true, channelName });
  } else {
    res.json({ connected: false });
  }
});

// Disconnect — clear session tokens
router.post('/disconnect', (req, res) => {
  (req.session as any).tokens = undefined;
  (req.session as any).channelName = undefined;
  res.json({ success: true });
});

export default router;
