# Publish to YouTube

A full-stack demo app for publishing videos to YouTube using the **YouTube Data API v3** OAuth2 flow.

- **Backend** — Node.js / Express 5 / TypeScript (port 3001)
- **Frontend** — Next.js 14 App Router / TypeScript / Tailwind CSS (port 3000)

---

## Prerequisites

- Node.js 18+
- A Google Cloud account

---

## Google Cloud Console Setup

1. Go to [console.cloud.google.com](https://console.cloud.google.com) and create a new project (or use an existing one).

2. Enable the **YouTube Data API v3**:
   - Navigate to **APIs & Services → Library**
   - Search for "YouTube Data API v3" and click **Enable**

3. Create OAuth 2.0 credentials:
   - Go to **APIs & Services → Credentials → Create Credentials → OAuth client ID**
   - Application type: **Web application**
   - Add **Authorized redirect URI**: `http://localhost:3001/auth/google/callback`
   - Add **Authorized JavaScript origin**: `http://localhost:3000`
   - Save — copy the **Client ID** and **Client Secret**

4. Configure the OAuth consent screen:
   - Go to **APIs & Services → OAuth consent screen**
   - User type: **External** (for testing)
   - Fill in required fields (App name, support email, developer email)
   - Add scope: `https://www.googleapis.com/auth/youtube.upload`
   - Under **Test users**, add your Google account email

> **Note:** While the app is in "Testing" mode, only added test users can authorize it.

---

## Backend Setup

```bash
cd backend
cp .env.example .env
```

Fill in `backend/.env`:

```
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
REDIRECT_URI=http://localhost:3001/auth/google/callback
SESSION_SECRET=some_random_secret_string
PORT=3001
```

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

The backend runs at `http://localhost:3001`.

---

## Frontend Setup

```bash
cd frontend
cp .env.local.example .env.local
```

`frontend/.env.local` should contain:

```
NEXT_PUBLIC_API_URL=http://localhost:3001
```

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

The frontend runs at `http://localhost:3000`.

---

## Usage

1. Open `http://localhost:3000`
2. Click **Connect YouTube** — you'll be redirected to Google's consent screen
3. Grant permissions and you'll be redirected back — your channel name will appear in the header
4. Select a video file (MP4, MOV, AVI, MKV — up to 2 GB)
5. Fill in the title (required), description (optional), and choose a privacy setting
   - **Recommended for testing:** use **Unlisted** to avoid accidental public posts
6. Click **Publish to YouTube**
7. Wait for the upload to complete — a link to your video will appear when done

---

## API Routes

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/auth/google` | Redirect to Google OAuth consent screen |
| `GET` | `/auth/google/callback` | Exchange code for tokens, redirect to frontend |
| `GET` | `/auth/status` | `{ connected: boolean, channelName?: string }` |
| `POST` | `/auth/disconnect` | Clear session tokens |
| `POST` | `/upload/video` | Upload video (`multipart/form-data`) |
| `GET` | `/health` | Health check |

---

## Project Structure

```
publish-to-youtube/
  backend/
    src/
      server.ts                 Express app entry point
      lib/google.ts             OAuth2Client factory
      routes/auth.ts            Auth routes
      routes/upload.ts          Video upload route
      middleware/requireAuth.ts Auth guard middleware
    .env.example
    package.json
    tsconfig.json
  frontend/
    app/
      page.tsx                  Main page
      layout.tsx                Root layout
      globals.css               Global styles
    components/
      AuthStatus.tsx            Connect/disconnect UI
      VideoUploadForm.tsx       Upload form
      UploadProgress.tsx        Upload status display
    lib/api.ts                  Backend fetch wrappers
    .env.local.example
    package.json
  README.md
```

---

## Important Notes

- **YouTube API quota**: The default quota is 10,000 units/day. A single video upload costs ~1,600 units — enough for ~6 uploads per day on a fresh project.
- **Upload limit**: YouTube accepts videos up to 256 GB / 12 hours. This app limits file selection to 2 GB for demo purposes.
- **Session tokens**: OAuth tokens are stored server-side in an in-memory session. Restarting the backend will require re-authentication.
- **Privacy default**: The app defaults to `unlisted` — change to `public` or `private` as needed.
