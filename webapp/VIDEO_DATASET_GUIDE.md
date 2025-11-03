# Video Dataset Management Guide

This guide explains how to manage video datasets in the TikTok Clone admin panel.

## Quick Start

### Adding Videos to Your Mock Dataset

The admin panel provides multiple ways to add videos to your mock dataset:

## Method 1: Add Videos via Admin UI (Recommended)

### Using Video URLs
Perfect for adding videos from the internet or a CDN:

1. Navigate to `http://localhost:5173/admin`
2. Click the **"+ Add Video"** button
3. Select the **"🔗 URL"** tab
4. Enter video URL: `https://example.com/video.mp4`
5. Fill in details:
   - Caption: "Amazing video! 🎉"
   - Username: creator_name
   - Set engagement metrics (likes, comments, shares)
6. Click **"Add Video"**

### Using Local Video Files
Perfect for testing with your own video files:

1. Click **"+ Add Video"**
2. Select the **"📁 Upload File"** tab
3. Click **"Choose Video File"**
4. Select a video from your computer
5. Fill in video details
6. Click **"Add Video"**

**Note**: Uploaded files are stored as temporary browser object URLs. They work during the current session but won't persist after refresh.

---

## Method 2: Use Local Video Folder (Persistent)

For videos that persist across sessions:

### Step 1: Create a Videos Folder
```bash
cd webapp
mkdir -p public/videos
```

### Step 2: Add Your Videos
Copy your video files to `webapp/public/videos/`:
```bash
cp /path/to/your/video.mp4 webapp/public/videos/
```

### Step 3: Add via Admin UI
1. Go to admin panel: `http://localhost:5173/admin`
2. Click **"+ Add Video"**
3. Use URL: `/videos/video.mp4`
4. Fill in details and save

✅ **Benefit**: Videos persist across browser sessions!

---

## Method 3: Edit Mock Data Directly

For bulk additions or permanent mock data:

### Edit `webapp/src/firebase/mockDataStore.ts`

```typescript
const initialMockVideos: Video[] = [
  {
    id: '1',
    url: '/videos/my-local-video.mp4',  // Local from public folder
    caption: 'My custom video 🎥',
    likes: 1000,
    comments: 50,
    shares: 20,
    username: 'your_username',
    userAvatar: 'https://i.pravatar.cc/150?img=10',
    createdAt: new Date(),
    isVisible: true,
    feedOrder: 0,
  },
  // Add more videos here...
];
```

---

## Video Management Operations

### Edit a Video
1. Find the video in admin panel
2. Click the **edit icon (✏️)**
3. Modify any field
4. Click **"Update Video"**

### Delete a Video
1. Find the video in admin panel
2. Click the **delete icon (🗑️)**
3. Confirm deletion

### Reorder Videos
1. Drag and drop videos to reorder
2. Changes save automatically

### Hide/Show Videos
1. Click the **eye icon (👁️)** to toggle visibility
2. Hidden videos won't appear in the public feed

---

## Video URL Options

### 1. External URLs (CDN/Internet)
```
https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4
```

### 2. Local Development Server
```
/videos/my-video.mp4
```

### 3. Local File Upload
```
blob:http://localhost:5173/abc123...
```
(Generated automatically via file upload)

---

## Best Practices

### For Development/Testing
- ✅ Use file upload for quick testing
- ✅ Use local folder (`public/videos/`) for persistent mock data
- ✅ Use mock data file for default dataset

### For Production
- ✅ Use CDN URLs (e.g., Firebase Storage, Cloudinary, AWS S3)
- ✅ Implement proper file upload to cloud storage
- ❌ Don't use local files or blob URLs

---

## Common Scenarios

### Scenario 1: Testing with Your Own Videos
```bash
# 1. Copy videos to public folder
cp ~/Downloads/*.mp4 webapp/public/videos/

# 2. Start dev server
npm run dev

# 3. Add via admin UI using URL: /videos/filename.mp4
```

### Scenario 2: Quick Demo with External Videos
```bash
# Use free sample videos:
# - https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4
# - https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4
# - https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4
```

### Scenario 3: Bulk Import Videos
Edit `mockDataStore.ts` and add multiple videos to the `initialMockVideos` array.

---

## Troubleshooting

### Videos Not Playing
- ✅ Check video URL is accessible
- ✅ Verify video format (MP4, WebM work best)
- ✅ Check browser console for CORS errors
- ✅ Ensure local files are in `public/` folder

### Videos Disappear After Refresh
- This happens with uploaded files (blob URLs)
- **Solution**: Use local folder method or edit mock data file

### Video Order Not Saving
- Check browser console for errors
- Ensure admin panel loaded successfully
- Try manual refresh

---

## Example: Complete Workflow

```bash
# 1. Create videos folder
mkdir -p webapp/public/videos

# 2. Add your videos
cp ~/my-videos/*.mp4 webapp/public/videos/

# 3. Start server
cd webapp
npm run dev

# 4. Open admin panel
# http://localhost:5173/admin

# 5. Add videos via UI
# URL: /videos/video1.mp4
# Caption: "My awesome video"
# Username: "creator_name"
# Click "Add Video"

# 6. Reorder, hide/show, edit as needed

# 7. View on main feed
# http://localhost:5173/
```

---

## Need More Help?

See [ADMIN_FEATURE.md](./ADMIN_FEATURE.md) for detailed admin panel documentation.

