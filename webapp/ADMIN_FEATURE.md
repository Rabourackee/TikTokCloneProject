# Admin Panel Feature

## Overview
The webapp now includes an admin panel for managing the video feed. You can view all videos, reorder them, and control their visibility.

## Features

### 1. **Video Management Dashboard**
- View all videos in the database (including hidden ones)
- See statistics: Total videos, Visible count, Hidden count
- Real-time updates when making changes

### 2. **Drag-and-Drop Reordering**
- Simply drag videos to reorder them
- The order is saved automatically to Firebase
- Videos appear in the public feed in the order you set

### 3. **Visibility Toggle**
- Click the eye icon to show/hide videos from the public feed
- Hidden videos won't appear on the main feed
- Useful for temporarily removing videos or preparing content

## Usage

### Accessing the Admin Panel
1. Start the dev server: `npm run dev`
2. Navigate to `http://localhost:5173/admin`
3. Or click the "Admin" button in the navigation bar

### Managing Videos
1. **To reorder videos**: Click and drag any video to a new position
2. **To hide a video**: Click the eye icon (👁️) - it will become crossed out
3. **To show a hidden video**: Click the crossed-out eye icon again

### Navigation
- **Feed**: View the public-facing video feed (shows only visible videos)
- **Admin**: Access the management dashboard

## Technical Details

### New Files
- `webapp/src/firebase/adminService.ts` - Admin API functions
- `webapp/src/components/AdminPanel.tsx` - Admin UI component
- `webapp/src/components/AdminPanel.css` - Admin panel styles

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

## Notes

- The admin panel works with mock data when Firebase is not configured
- Changes are saved immediately to Firebase
- The public feed only shows videos where `isVisible = true`
- Videos are ordered by `feedOrder` in ascending order (0, 1, 2, ...)


