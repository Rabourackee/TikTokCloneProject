# Admin Panel Feature

## Overview
The webapp now includes a comprehensive admin panel for managing the video feed. You can view all videos, add new videos (via URL or local upload), edit existing videos, delete videos, reorder them, and control their visibility.

## Features

### 1. **Video Management Dashboard**
- View all videos in the database (including hidden ones)
- See statistics: Total videos, Visible count, Hidden count
- Real-time updates when making changes
- Add new videos with video URLs or local files
- Edit video metadata (caption, username, engagement metrics)
- Delete videos from the feed

### 2. **Add Videos**
- **Via URL**: Add videos by providing a direct link to video files (MP4, WebM, etc.)
- **Via Local Upload**: Upload videos from your computer (great for mockups/testing)
- Set video metadata: caption, username, avatar, likes, comments, shares
- Control initial visibility (show/hide in feed)

### 3. **Edit Videos**
- Update video metadata at any time
- Change video URL or upload a new file
- Modify engagement metrics for demo/testing purposes

### 4. **Delete Videos**
- Remove videos from the system with confirmation
- Automatic reordering of remaining videos

### 5. **Drag-and-Drop Reordering**
- Simply drag videos to reorder them
- The order is saved automatically to Firebase
- Videos appear in the public feed in the order you set

### 6. **Visibility Toggle**
- Click the eye icon to show/hide videos from the public feed
- Hidden videos won't appear on the main feed
- Useful for temporarily removing videos or preparing content

## Usage

### Accessing the Admin Panel
1. Start the dev server: `npm run dev`
2. Navigate to `http://localhost:5173/admin`
3. Or click the "Admin" button in the navigation bar

### Adding New Videos

#### Method 1: Add Video by URL
1. Click the **"+ Add Video"** button
2. Select the **"🔗 URL"** tab (default)
3. Enter a direct video URL (e.g., `https://example.com/video.mp4`)
4. Fill in the video details:
   - **Caption**: Description or title for the video
   - **Username**: Creator username
   - **User Avatar URL**: Profile picture URL (optional)
   - **Engagement Metrics**: Likes, comments, shares (for demo purposes)
5. Check/uncheck "Visible in feed" to control initial visibility
6. Click **"Add Video"**

#### Method 2: Upload Local Video Files
1. Click the **"+ Add Video"** button
2. Select the **"📁 Upload File"** tab
3. Click **"Choose Video File"** and select a video from your computer
4. Preview the video to confirm selection
5. Fill in the video details (same as Method 1)
6. Click **"Add Video"**

**Note**: Local videos are stored as browser object URLs and will only work in the current session. For persistent storage, consider using Firebase Storage or another cloud storage solution.

### Editing Videos
1. Click the **edit icon (✏️)** on any video
2. Modify any field (URL, caption, username, metrics, etc.)
3. Click **"Update Video"** to save changes

### Deleting Videos
1. Click the **delete icon (🗑️)** on any video
2. Confirm the deletion in the dialog
3. The video is permanently removed

### Managing Video Order & Visibility
1. **To reorder videos**: Click and drag any video to a new position
2. **To hide a video**: Click the eye icon (👁️) - it will become crossed out
3. **To show a hidden video**: Click the crossed-out eye icon again

### Navigation
- **📹 Videos**: Manage video content (add, edit, delete, reorder)
- **📊 Analytics**: View video performance metrics
- **👥 User Sessions**: Monitor user interactions and behavior

## Technical Details

### New Files
- `webapp/src/firebase/adminService.ts` - Admin API functions
- `webapp/src/firebase/mockDataStore.ts` - Mock data management with CRUD operations
- `webapp/src/components/AdminPanel.tsx` - Admin UI component
- `webapp/src/components/AdminPanel.css` - Admin panel styles
- `webapp/src/components/VideoUploadModal.tsx` - Modal for adding/editing videos
- `webapp/src/components/VideoUploadModal.css` - Modal styles

### Modified Files
- `webapp/src/types/video.ts` - Added `isVisible` and `feedOrder` fields
- `webapp/src/firebase/videoService.ts` - Filters by visibility and orders by `feedOrder`
- `webapp/src/App.tsx` - Added routing for admin panel
- `webapp/src/App.css` - Added navigation styles

### Database Schema Changes
Videos now have two additional optional fields:
- `isVisible` (boolean): Whether the video appears in the public feed (default: true)
- `feedOrder` (number): Display order in the feed (lower = first, default: 0)

### Dependencies Added
- `react-router-dom` - For routing between Feed and Admin pages
- `react-beautiful-dnd` - For drag-and-drop functionality

## Firebase Setup

For production use, make sure your Firebase Firestore has these indexes:
1. Collection: `videos`
   - Fields: `isVisible` (ASC), `feedOrder` (ASC)

Firebase will prompt you to create this index when you first query with these fields.

## Video Dataset Management

### Using Mock Videos for Development
The admin panel includes a powerful mock data system for development and testing:

1. **Mock Videos**: Default sample videos are provided in `mockDataStore.ts`
2. **CRUD Operations**: Full support for Create, Read, Update, Delete
3. **Persistence**: Mock data persists within the browser session
4. **No Backend Required**: Works perfectly without Firebase configuration

### Adding Your Own Mock Videos
You can add custom mock videos in two ways:

1. **Via Admin UI**: Use the "+ Add Video" button to add videos by URL or upload local files
2. **Via Code**: Edit `webapp/src/firebase/mockDataStore.ts` and add to the `initialMockVideos` array

Example:
```typescript
{
  id: '6',
  url: 'https://yourdomain.com/video.mp4',
  caption: 'My custom video 🎥',
  likes: 100,
  comments: 20,
  shares: 5,
  username: 'your_username',
  userAvatar: 'https://yourdomain.com/avatar.jpg',
  createdAt: new Date(),
  isVisible: true,
  feedOrder: 5,
}
```

### Using Local Video Folders
To use videos from a local folder:

1. **Option 1: Upload via Admin UI**
   - Click "+ Add Video" → "Upload File"
   - Select videos from your local folder
   - Note: These are stored as browser object URLs (temporary)

2. **Option 2: Local Development Server**
   - Place videos in `webapp/public/videos/` folder
   - Add videos via Admin UI using URLs like: `/videos/myvideo.mp4`
   - These will persist across sessions

3. **Option 3: Use a Local File Server**
   - Run a simple HTTP server for your video folder
   - Reference videos using `http://localhost:PORT/video.mp4`

### Best Practices
- For **temporary testing**: Use the file upload feature
- For **persistent mock data**: Add videos to `public/videos/` and reference them
- For **production**: Use Firebase Storage or CDN URLs

## Notes

- The admin panel works with mock data when Firebase is not configured
- Changes are saved immediately (to mock data or Firebase)
- The public feed only shows videos where `isVisible = true`
- Videos are ordered by `feedOrder` in ascending order (0, 1, 2, ...)
- Local file uploads are stored as object URLs (temporary, session-only)
- For production, integrate with Firebase Storage for persistent video uploads





