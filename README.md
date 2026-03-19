# 🎬 Viral Shorts Factory: How I Automated My Editing Workflow

Being an editor is tough. Spending hours searching for the *perfect* clip, syncing voiceovers, and manually cropping everything to 9:16 just to see if a niche works... it was draining. I needed a way to test viral ideas fast, without the manual grind.

So, I built **Viral Shorts Factory**.

This isn't just a script; it's a full-stack pipeline that takes a niche, writes a viral script using AI (Groq/Llama 3), scrapes matching TikTok clips (no watermarks, different channels), and assembles a high-retention video ready for final touches in CapCut.

---

## ⚡ Live Demo
[Link to your Vercel deployment will go here]

---

## 🔥 Features
- **Niche Selection**: Fast-track for War Facts, NFL, Sports, Celebrities, and Rappers.
- **Smart Scripting**: Powered by Groq for high-converting hooks and fast-paced scripts.
- **Automatic Scraper**: Finds "exact match" TikTok clips based on your script keywords.
- **Dynamic Assembly**: MoviePy handles the timing, cropping (9:16), and voiceover sync.
- **Custom Voice**: Use AI (edge-tts) or upload your own voice for that personal touch.

---

## 🛠️ Tech Stack
- **Frontend**: Next.js (Vercel) + Tailwind CSS
- **Database**: Turso (Edge SQLite)
- **Processing**: Python + MoviePy + yt-dlp
- **Orchestration**: GitHub Actions
- **AI**: Groq API (Llama 3 70B)

---

## 🚀 Setup Guide

### 1. Database (Turso)
1. Install [Turso CLI](https://docs.turso.tech/cli).
2. Create a db: `turso db create video-auto`.
3. Get your URL: `turso db show video-auto --url`.
4. Get your Token: `turso db tokens create video-auto`.

### 2. AI (Groq)
1. Go to [Groq Console](https://console.groq.com/).
2. Create an API Key.

### 3. GitHub (For Automation)
1. Create a [Personal Access Token (classic)](https://github.com/settings/tokens) with `repo` and `workflow` scopes.
2. In your repo Settings > Secrets and Variables > Actions:
   - Add `TURSO_DATABASE_URL`
   - Add `TURSO_AUTH_TOKEN`

### 4. Vercel (Deployment)
1. Push your code to GitHub.
2. Connect the repo to Vercel.
3. Add all environment variables from `web/.env.example` to the Vercel project settings.

---

## 🏗️ Development
1. **Web**: `cd web && npm install && npm run dev`
2. **Automation**: `cd automation && pip install -r requirements.txt`

---

## 🤝 Let's Make Some Money
Once the video is generated, download it from the dashboard, throw it into CapCut for those final memes and sound effects, and hit upload! 🚀

Created with ⚡ by [Your Name]
