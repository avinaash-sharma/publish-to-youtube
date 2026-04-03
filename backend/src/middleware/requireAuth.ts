import type { Request, Response, NextFunction } from 'express';
import { createOAuth2Client } from '../lib/google.js';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const tokens = (req.session as any).tokens;
  if (!tokens) {
    res.status(401).json({ error: 'Not authenticated. Connect your YouTube account first.' });
    return;
  }
  const oauth2Client = createOAuth2Client();
  oauth2Client.setCredentials(tokens);
  (req as any).oauth2Client = oauth2Client;
  next();
}
