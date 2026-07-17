# Interactive Blog Posts

This directory contains interactive React components that appear as blog posts alongside regular MDX posts.

## Adding a New Interactive Post

To add a new interactive blog post, follow these steps:

### 1. Create Directory Structure

```bash
mkdir -p content/interactive/[your-slug]
```

### 2. Create `metadata.yaml`

Create `content/interactive/[your-slug]/metadata.yaml` with the following format:

```yaml
title: "Your Post Title"
date: "YYYY-MM-DD"
tags:
  - tag1
  - tag2
description: "Short description of your post"
thumbnail: "/images/your-image.jpg"  # Optional
layout: casual  # Optional: casual (default), academic, or problem
type: interactive  # Required: must be "interactive"
```

### 3. Create `component.tsx`

Create `content/interactive/[your-slug]/component.tsx`:

```tsx
// @ts-nocheck - Use this if you don't want to add TypeScript types
'use client';  // Required if using React hooks or browser APIs

import { useState } from 'react';

export default function YourPost() {
  // Your interactive component code here
  // You have full control over styling (inline, CSS modules, etc.)
  // This component will be wrapped in CasualLayout which provides:
  //   - Header with title, date, and tags
  //   - Thumbnail image (if specified)
  //   - Comments section below

  return (
    <div style={{ padding: '20px' }}>
      <h2>Your Interactive Content</h2>
      {/* Add your interactive elements here */}
    </div>
  );
}
```

**Requirements:**
- Must have a default export of a React component
- Add `'use client'` directive if using:
  - React hooks (useState, useEffect, etc.)
  - Browser APIs (window, document, etc.)
  - Event handlers (onClick, onChange, etc.)
- Add `// @ts-nocheck` at the top to skip TypeScript type checking
- Component should be self-contained (all logic and styles inline or imported)
- No assumptions about parent container (except it will be wrapped in CasualLayout)

### 4. Register Component

Add your component to `content/interactive/index.ts`:

```ts
import YourPost from './your-slug/component';

export const interactiveComponents: Record<string, any> = {
  'boj-32129': MagicOrbBlog,
  'your-slug': YourPost,  // Add this line
  // ...
};
```

### 5. Build and Verify

```bash
npm run build
```

Your interactive post will now:
- Appear in the blog listing at `/blog`
- Be accessible at `/blog/your-slug`
- Appear in search results
- Be statically generated at build time

## Styling Guidelines

Your component controls its own styling. The CasualLayout wrapper only provides:
- Hero image (if thumbnail specified in metadata.yaml)
- Header section with title, date, and tags
- Comments section below your component

Your component's styles will NOT be affected by the layout wrapper. You can:
- Use inline styles (like boj-32129 example)
- Import CSS modules
- Use styled-components or other CSS-in-JS libraries
- Use any color scheme (dark mode, light mode, custom palette)

## Examples

See `boj-32129/` for a complete example of:
- Complex interactive visualizations
- State management with hooks
- Custom color palette and dark theme
- Multiple sub-components
- Self-contained styling

## Automatic Integration

Once created, interactive posts automatically:
- Merge with MDX posts in blog listing (sorted by date)
- Generate static pages at build time
- Support all existing metadata features (tags, thumbnails)
- Include comments section via Giscus

No code changes needed in other parts of the application!
