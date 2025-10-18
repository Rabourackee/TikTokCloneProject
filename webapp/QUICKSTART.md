# Quick Start Guide

## 🚀 Run in 3 Steps

1. **Install dependencies**
   ```bash
   cd webapp
   npm install
   ```

2. **Start the dev server**
   ```bash
   npm run dev
   ```

3. **Open in browser**
   ```
   http://localhost:5173
   ```

That's it! The app will run with mock video data.

## 🎥 What You'll See

- **5 sample videos** in a scrolling feed
- **Auto-play** when scrolled into view
- **Like, comment, share** buttons
- **Mute/unmute** toggle
- **TikTok-style** UI

## ⌨️ Controls

- **Scroll** or **swipe** to navigate
- **Arrow keys** (↑/↓) to switch videos
- **Click video** to pause/play
- **Click mute button** to toggle sound

## 🔥 Optional: Add Your Firebase Data

1. Create a Firebase project
2. Add your config to `src/firebase/config.ts`
3. Your videos collection should have:
   - `url` (string) - video URL
   - `caption` (string) - description
   - `username` (string) - creator name
   - `userAvatar` (string) - avatar URL
   - `likes`, `comments`, `shares` (numbers)
   - `createdAt` (timestamp)

## 📱 Mobile Testing

The app works on mobile! Open the local network URL on your phone (shown in terminal after `npm run dev`).

---

**Need help?** Check the full [README.md](README.md) for detailed documentation.

