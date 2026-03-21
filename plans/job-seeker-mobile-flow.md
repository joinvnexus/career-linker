# Job Seeker Mobile-First Flow Design Plan

## Overview
Redesign the job seeker dashboard and flow with a mobile-first approach, focusing on usability, quick actions, and intuitive navigation for mobile users.

---

## Current Flow Analysis

### Existing Pages
1. **Public Flow**
   - `/jobs` - Browse jobs listing
   - `/jobs/[slug]` - Job detail page (recently redesigned)

2. **Private Dashboard Flow** (`/dashboard/job-seeker`)
   - `layout.tsx` - Sidebar-based layout (NOT mobile-friendly)
   - `page.tsx` - Overview with stats, quick actions, recent activity
   - `applications/page.tsx` - Applied jobs list
   - `saved/page.tsx` - Saved jobs list
   - `profile/page.tsx` - Profile editor (long form)
   - `profile/view/page.tsx` - Public profile view
   - `settings/page.tsx` - Account settings

### Current Pain Points
1. **Layout**: Fixed sidebar doesn't work on mobile
2. **Navigation**: No mobile bottom navigation
3. **Profile**: Long scrolling form without progress indicator
4. **Applications**: Simple list, no filtering or status tracking
5. **Quick Actions**: Not easily accessible on mobile
6. **Responsiveness**: Desktop-first design doesn't scale well

---

## Proposed Mobile-First Architecture

### Layout Changes

```mermaid
flowchart TB
    subgraph Mobile["Mobile Layout (< 768px)"]
        M1[Bottom Tab Bar<br/>Home|Applications|Saved|Profile]
        M2[Content Area<br/>Scrollable]
        M1 --> M2
    end
    
    subgraph Desktop["Desktop Layout (>= 768px)"]
        D1[Top Header]
        D2[Sidebar<br/>Navigation]
        D3[Main Content]
        D1 --> D2
        D2 --> D3
    end
```

### Bottom Navigation (Mobile)
| Tab | Icon | Label | Route |
|-----|------|-------|-------|
| Home | 🏠 | Home | `/dashboard/job-seeker` |
| Applied | 📋 | Applied | `/dashboard/job-seeker/applications` |
| Saved | 🔖 | Saved | `/dashboard/job-seeker/saved` |
| Profile | 👤 | Profile | `/dashboard/job-seeker/profile` |

---

## Page-by-Page Redesign

### 1. Dashboard Layout (`layout.tsx`)

**Mobile Changes:**
- Replace sidebar with fixed bottom navigation bar
- Add top header with user greeting and notification bell
- Full-width content area with proper padding
- Pull-to-refresh support

**Desktop Changes:**
- Keep sidebar for larger screens
- Add hover states for navigation items
- Show expanded labels

### 2. Overview Page (`page.tsx`)

**Mobile Changes:**
- Compact stats cards (2x2 grid)
- Horizontal scroll for quick actions
- Recent activity as vertical list
- Floating action button for "Browse Jobs"

**Components:**
```
┌─────────────────────────────┐
│  👋 Welcome, John!    🔔    │ <- Header
├─────────────────────────────┤
│  ┌─────┐ ┌─────┐          │
│  │  5  │ │  2  │          │ <- Stats (2x2)
│  │Apply│ │Save │          │
│  └─────┘ └─────┘          │
│  ┌─────┐ ┌─────┐          │
│  │  1  │ │ 75% │          │
│  │Inter│ │Prof │          │
│  └─────┘ └─────┘          │
├─────────────────────────────┤
│  Quick Actions             │
│  ┌────┐ ┌────┐ ┌────┐     │
│  │Jobs│ │Save│ │Edit│     │ <- Horizontal scroll
│  └────┘ └────┘ └────┘     │
├─────────────────────────────┤
│  Recent Activity           │
│  • Applied to Frontend...   │
│  • Interview scheduled...   │
│  • Profile viewed...        │
├─────────────────────────────┤
│ 🏠    📋    🔖    👤       │ <- Bottom nav
└─────────────────────────────┘
```

### 3. Applications Page (`applications/page.tsx`)

**Mobile Features:**
- Status filter chips (All, Pending, Interview, Offer, Rejected)
- Swipe actions (view, withdraw)
- Pull to refresh
- Empty state with CTA

**Status Badges:**
| Status | Color | Description |
|--------|-------|-------------|
| PENDING | Amber | Under review |
| VIEWED | Blue | Employer viewed |
| INTERVIEW | Purple | Interview scheduled |
| OFFER | Green | Job offer received |
| REJECTED | Red | Not selected |

### 4. Saved Jobs Page (`saved/page.tsx`)

**Mobile Features:**
- Grid/List view toggle
- Quick apply from saved
- Swipe to remove
- Sort by date saved

### 5. Profile Page (`profile/page.tsx`)

**Mobile Features:**
- Step-by-step wizard or accordion sections
- Progress bar at top
- Inline validation
- Auto-save functionality

**Sections (Accordion):**
1. 👤 Basic Info (name, headline, bio)
2. 📧 Contact (email, phone, location)
3. 💼 Experience (work history)
4. 🎓 Education
5. 🛠 Skills (tag input)
6. 📎 Resume & Links

---

## Component Design System

### Bottom Navigation Bar
```tsx
// New component: BottomNav
- Fixed position: bottom-0
- Height: 64px + safe area
- 4 tabs with icons + labels
- Active state: filled icon + color
- Badge for notification count
```

### Stats Card (Mobile)
```tsx
// Compact stats
- Square aspect ratio
- Icon + number + label
- Tap to view details
- Background gradient
```

### Status Chip
```tsx
// Filter chips for applications
- Horizontal scroll
- Selected state: filled
- Count badge
```

### Application Card
```tsx
// Mobile-optimized card
- Company logo (small)
- Job title (bold)
- Company + location
- Status badge
- Swipe actions
```

---

## API Enhancements Needed

### 1. Application Status Updates
```typescript
GET /api/applications/my?status=INTERVIEW
// Add filter by status
```

### 2. Application Stats
```typescript
GET /api/applications/my/stats
// Returns: { total, pending, interview, offer, rejected }
```

### 3. Profile Completion
```typescript
GET /api/profile/seeker/completion
// Returns: { percentage, missingFields[] }
```

---

## Implementation Priority

| Priority | Page/Feature | Complexity | Impact |
|----------|--------------|------------|--------|
| P0 | Bottom Navigation | Medium | High |
| P0 | Mobile Layout Update | High | High |
| P1 | Stats Optimization | Low | Medium |
| P1 | Status Filter Chips | Medium | High |
| P2 | Profile Wizard | High | Medium |
| P2 | Swipe Actions | Medium | Medium |

---

## Acceptance Criteria

1. ✅ All pages render correctly on mobile (320px - 428px)
2. ✅ Bottom navigation works smoothly with route changes
3. ✅ Stats load within 1 second
4. ✅ Applications can be filtered by status
5. ✅ Profile has clear section organization
6. ✅ Pull-to-refresh works on all list pages
7. ✅ Touch targets are minimum 44px
8. ✅ No horizontal overflow on any page

---

## File Structure Changes

```
src/
├── components/
│   ├── bottom-nav.tsx              [NEW]
│   ├── mobile-stats-card.tsx       [NEW]
│   ├── status-chip.tsx             [NEW]
│   ├── application-card.tsx        [NEW]
│   └── jobs/
│       └── ...                     [existing]
├── app/
│   └── dashboard/
│       └── job-seeker/
│           ├── layout.tsx          [MODIFY - add mobile nav]
│           ├── page.tsx            [MODIFY - mobile optimize]
│           ├── applications/
│           │   └── page.tsx       [MODIFY - add filters]
│           ├── saved/
│           │   └── page.tsx       [MODIFY - swipe actions]
│           └── profile/
│               └── page.tsx        [MODIFY - accordion]
```

---

## Next Steps

1. Approve this plan
2. Switch to Code mode
3. Implement bottom navigation component
4. Update layout for mobile responsiveness
5. Optimize each page for mobile
