

# LicensingSimplified — Implementation Plan

## 1. Design System & Theme
- Dark mode by default with deep blacks/greys palette
- Light mode toggle in header
- Custom CSS variables for the dark-first design
- Clean, technical typography

## 2. Layout & Navigation
- **Header**: "LicensingSimplified" branding + light/dark toggle
- **Home page** (`/`): Blog post listing with cards showing title, date, excerpt
- **Post page** (`/post/:id`): Full reading experience with the Multi-Format View system
- **Admin** (`/admin`): Protected dashboard

## 3. Multi-Format View System (Core Feature)
Each blog post stores 5 content formats:
1. Full Post
2. 3-Sentence Summary
3. Single Paragraph
4. Pareto Principle (80/20)
5. Key Bullet Points

- **Desktop**: Sidebar menu on the post page to switch between formats with smooth fade transitions
- **Mobile**: Horizontal scrollable pill/chip bar at the top of the post
- Instant transitions between formats using CSS animations

## 4. Admin Dashboard (`/admin`)
- Simple hardcoded login gate (username: `user`, password: `user`) — session stored in React state
- **Post Management**: Create, Edit, Delete posts in a table/list view
- **Create/Edit Form**: Title, date, and 5 separate textareas — one for each reading format
- Data stored in local state with localStorage persistence (can migrate to Supabase later)

## 5. Data Layer
- localStorage-based persistence for blog posts
- React Context for global post state
- Pre-seeded with 2-3 sample Microsoft licensing posts for demo purposes

## 6. Pages & Routes
| Route | Description |
|---|---|
| `/` | Blog listing homepage |
| `/post/:id` | Post reader with format switcher |
| `/admin` | Login + dashboard |

## 7. Future Enhancements (Phase 2)
- Search bar for Microsoft SKUs
- Copy to Clipboard button on summaries
- Supabase migration for real persistence

