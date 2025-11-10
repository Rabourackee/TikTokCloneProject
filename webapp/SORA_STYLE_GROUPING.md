# Sora-Style Video Grouping Feature

## Overview

This feature implements **Sora-style video grouping** where videos from the same user with the same caption are grouped together in horizontal "rows". Users can:
- **Swipe left/right** (or use arrow keys) to navigate between videos in the same group
- **Swipe up/down** (or use arrow keys) to navigate between different groups

This creates a more organized viewing experience, similar to the official Sora app.

## How It Works

### Video Grouping Logic

Videos are automatically grouped by:
1. **Username** - Videos from the same user
2. **Caption** - Videos with identical captions

For example, if you have these videos in your JSON file:
```json
[
  { "id": 1, "username": "cosmic-skye", "caption": "BARS", ... },
  { "id": 2, "username": "cosmic-skye", "caption": "BARS", ... },
  { "id": 3, "username": "cosmic-skye", "caption": "BARS", ... },
  { "id": 4, "username": "another-user", "caption": "Cool video", ... }
]
```

The app will create:
- **Group 1**: 3 videos from "cosmic-skye" with caption "BARS" (swipeable horizontally)
- **Group 2**: 1 video from "another-user" with caption "Cool video"

### Navigation

#### On Desktop:
- **Arrow Down**: Next group (vertical)
- **Arrow Up**: Previous group (vertical)
- **Arrow Right**: Next video in current group (horizontal)
- **Arrow Left**: Previous video in current group (horizontal)

#### On Mobile/Touch:
- **Swipe Up/Down**: Navigate between groups (vertical)
- **Swipe Left/Right**: Navigate within a group (horizontal)

### Visual Indicators

When a group has multiple videos, **pagination dots** appear at the top of the screen:
- White pill shape = current video
- Gray circles = other videos in the group
- Click/tap a dot to jump to that video

## Technical Implementation

### New Type Definition

**`VideoGroup` interface** (`src/types/video.ts`):
```typescript
export interface VideoGroup {
  id: string;
  username: string;
  caption: string;
  videos: Video[];
  groupOrder: number;
}
```

### New Functions

#### 1. `groupVideosByUserAndCaption()` - `src/firebase/mockDataStore.ts`
```typescript
export const groupVideosByUserAndCaption = (videos: Video[]): VideoGroup[]
```
Groups an array of videos by username and caption combination.

#### 2. `getGroupedMockVideos()` - `src/firebase/mockDataStore.ts`
```typescript
export const getGroupedMockVideos = (): VideoGroup[]
```
Returns grouped videos from the mock data store (synchronous).

#### 3. `getGroupedMockVideosAsync()` - `src/firebase/mockDataStore.ts`
```typescript
export const getGroupedMockVideosAsync = (): Promise<VideoGroup[]>
```
Returns grouped videos from the mock data store (async, waits for JSON loading).

#### 4. `fetchGroupedVideos()` - `src/firebase/videoService.ts`
```typescript
export const fetchGroupedVideos = (limitCount?: number): Promise<VideoGroup[]>
```
Fetches and groups videos from Firebase or mock data. This is the main function used by the VideoFeed component.

### Updated Components

#### VideoFeed Component (`src/components/VideoFeed.tsx`)

Major changes:
- Now uses `VideoGroup[]` instead of `Video[]`
- Tracks active group index AND active video within each group
- Renders a nested structure:
  - Outer container: vertical scrolling between groups
  - Inner container: horizontal scrolling within each group
- Adds pagination dots for groups with multiple videos

#### CSS Updates (`src/components/VideoFeed.css`)

New classes:
- `.video-group-container` - Vertical scroll snap container
- `.video-row-horizontal` - Horizontal scroll snap container
- `.video-pagination-dots` - Pagination indicator container
- `.pagination-dot` - Individual dot indicator
- `.pagination-dot.active` - Active video indicator

## Data Structure Example

### Before (Flat List):
```javascript
[
  { id: "1", username: "user1", caption: "video1", ... },
  { id: "2", username: "user1", caption: "video1", ... },
  { id: "3", username: "user2", caption: "video2", ... }
]
```

### After (Grouped):
```javascript
[
  {
    id: "group_0",
    username: "user1",
    caption: "video1",
    groupOrder: 0,
    videos: [
      { id: "1", username: "user1", caption: "video1", ... },
      { id: "2", username: "user1", caption: "video1", ... }
    ]
  },
  {
    id: "group_1",
    username: "user2",
    caption: "video2",
    groupOrder: 1,
    videos: [
      { id: "3", username: "user2", caption: "video2", ... }
    ]
  }
]
```

## Benefits

### For Users:
1. **Better Organization**: Related videos are grouped together
2. **Easier Discovery**: Swipe through variations from the same creator
3. **Less Redundancy**: Don't need to scroll past many similar videos
4. **Clear Navigation**: Dots show how many videos are in each group

### For Developers:
1. **Flexible Grouping**: Easy to modify grouping logic
2. **Firebase Compatible**: Works with both mock data and Firebase
3. **Type Safe**: Full TypeScript support
4. **Maintainable**: Clean separation of concerns

## Customization

### Change Grouping Criteria

To group by different criteria, modify `groupVideosByUserAndCaption()` in `mockDataStore.ts`:

```typescript
// Example: Group only by username (ignore caption)
export const groupVideosByUser = (videos: Video[]): VideoGroup[] => {
  const groupMap = new Map<string, Video[]>();
  
  videos.forEach(video => {
    const key = video.username; // Only username
    
    if (!groupMap.has(key)) {
      groupMap.set(key, []);
    }
    groupMap.get(key)!.push(video);
  });
  
  // ... rest of the logic
};
```

### Disable Grouping

To go back to the original flat list view, simply replace `fetchGroupedVideos()` with `fetchVideos()` in `VideoFeed.tsx`.

## Browser Compatibility

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

Uses CSS scroll-snap for smooth scrolling, which is supported by all modern browsers.

## Performance Considerations

- **Efficient Grouping**: O(n) time complexity
- **Lazy Loading**: Only active video plays
- **Smooth Scrolling**: Hardware-accelerated CSS transforms
- **Memory Efficient**: Videos outside viewport are paused

## Testing

### Test Scenarios:

1. **Single video per group**: Should work like the old feed
2. **Multiple videos per group**: Should show dots and enable horizontal swiping
3. **Keyboard navigation**: All arrow keys should work correctly
4. **Touch gestures**: Swipe in all directions should work
5. **Edge cases**: Empty groups, groups with 1 video, many videos per group

### How to Test:

1. Load your JSON file with videos
2. Check the browser console for grouping logs
3. Try vertical scrolling between groups
4. Try horizontal scrolling within groups with multiple videos
5. Click pagination dots to jump to specific videos
6. Test on mobile devices

## Future Enhancements

Possible improvements:
1. **Smooth Transitions**: Add animation between video switches
2. **Group Headers**: Show group title/username at the top
3. **Customizable Grouping**: Let users choose grouping criteria
4. **Group Statistics**: Show "X of Y videos" in the group
5. **Auto-advance**: Automatically move to next video after completion

## Troubleshooting

### Videos not grouping correctly
- Check that videos have the same username AND caption
- Verify JSON data is loading correctly
- Check browser console for errors

### Horizontal scrolling not working
- Ensure `.video-row-horizontal` has `overflow-x: scroll`
- Check that multiple videos exist in the group
- Verify scroll-snap is supported in your browser

### Pagination dots not showing
- Dots only show for groups with 2+ videos
- Check CSS is loaded correctly
- Verify the group has multiple videos

## Conclusion

The Sora-style video grouping feature provides a more organized and intuitive video browsing experience. It automatically groups related content while maintaining smooth navigation and playback functionality.

