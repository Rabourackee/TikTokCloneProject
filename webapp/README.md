# TopTop Video Feed - Web App

A TikTok-style scrolling video feed web application built with React, TypeScript, and Firebase.

## ✨ Features

- **Vertical Scrolling Feed**: Smooth scroll-snap navigation between videos
- **Auto-play**: Videos automatically play when scrolled into view
- **Touch & Keyboard Controls**: Swipe or use arrow keys to navigate
- **Responsive Design**: Works on desktop and mobile devices
- **Interactive UI**: Like, comment, share, and mute buttons
- **Firebase Integration**: Fetch videos from Firebase Firestore
- **Mock Data**: Includes sample videos for testing without Firebase setup

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Firebase Project** (optional for demo - mock data is included)

### Installation

1. **Navigate to the webapp directory:**
   ```bash
   cd webapp
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Firebase (Optional):**
   
   If you want to use your own Firebase data:
   
   - Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
   - Enable Firestore and Storage
   - Copy your Firebase configuration
   - Update `src/firebase/config.ts` with your credentials:
   
   ```typescript
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_AUTH_DOMAIN",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_STORAGE_BUCKET",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID"
   };
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open your browser:**
   
   Navigate to `http://localhost:5173` (or the URL shown in terminal)

## 📱 Usage

### Navigation

- **Scroll/Swipe**: Navigate between videos vertically
- **Arrow Keys**: Use ↑/↓ to move between videos
- **Click Video**: Pause/play video
- **Mute Button**: Toggle sound on/off

### Interactions

- **❤️ Like**: Click the heart icon
- **💬 Comment**: Click the comment icon
- **↗️ Share**: Click the share icon

## 🗂️ Project Structure

```
webapp/
├── src/
│   ├── components/
│   │   ├── VideoPlayer.tsx      # Individual video player component
│   │   ├── VideoPlayer.css      # Video player styles
│   │   ├── VideoFeed.tsx        # Video feed container
│   │   └── VideoFeed.css        # Feed styles
│   ├── firebase/
│   │   ├── config.ts            # Firebase configuration
│   │   └── videoService.ts      # Video fetching service
│   ├── types/
│   │   └── video.ts             # TypeScript type definitions
│   ├── App.tsx                  # Main app component
│   ├── App.css                  # Global app styles
│   ├── main.tsx                 # App entry point
│   └── index.css                # Global CSS reset
├── index.html                   # HTML template
├── package.json                 # Dependencies
├── tsconfig.json                # TypeScript config
├── vite.config.ts               # Vite bundler config
└── README.md                    # This file
```

## 🔧 Configuration

### Firebase Firestore Structure

If using Firebase, your videos collection should have documents with this structure:

```javascript
{
  url: "https://example.com/video.mp4",  // Video URL
  caption: "Video description",           // Caption text
  username: "username",                   // User's username
  userAvatar: "https://...",             // Avatar URL
  likes: 123,                            // Number of likes
  comments: 45,                          // Number of comments
  shares: 12,                            // Number of shares
  createdAt: Timestamp                   // Creation timestamp
}
```

### Mock Data

The app includes mock videos that work without Firebase:
- Hosted on Google's test video storage
- Sample user data with avatars
- Perfect for testing and development

## 🏗️ Building for Production

```bash
# Build the app
npm run build

# Preview the production build
npm run preview
```

The built files will be in the `dist/` directory, ready to deploy to any static hosting service (Vercel, Netlify, Firebase Hosting, etc.).

## 📦 Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **Firebase** - Backend services
  - Firestore - Database
  - Storage - File storage
- **CSS3** - Styling with animations

## 🎨 Key Features Explained

### Scroll Snap

CSS scroll-snap creates the TikTok-style one-video-at-a-time experience:

```css
scroll-snap-type: y mandatory;
scroll-snap-align: start;
```

### Auto-play Detection

Intersection Observer API detects when a video is 75% visible and triggers playback:

```typescript
const options = {
  threshold: 0.75  // 75% visibility
};
```

### Video Controls

- **Auto-pause**: Videos pause when scrolled away
- **Loop**: Videos loop continuously
- **Mute toggle**: Sound control with icon feedback

## 🚀 Deployment

### Deploy to Vercel

```bash
npm install -g vercel
vercel
```

### Deploy to Netlify

```bash
npm run build
# Drag and drop the 'dist' folder to Netlify
```

### Deploy to Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```

## 🤝 Contributing

This is a demonstration project converted from the Android TikTok clone. Feel free to fork and enhance!

## 📄 License

MIT License - see the original Android project's LICENSE file.

## 🙏 Acknowledgments

- Original Android app by the TopTop team
- Sample videos from Google Cloud test bucket
- Firebase for backend services
- React and Vite communities

---

**Note**: This web app implements only the core scrolling video feed feature from the original Android app. Authentication, video upload, and other features can be added based on requirements.

