# Design System — ML Classification Presentation

## Product Context
- **What this is:** Interactive web presentation for COMP SCI 465 Machine Learning Project 1
- **Who it's for:** Course instructor and classmates during 7-10 minute presentation
- **Space/industry:** Academic / ML education
- **Project type:** Presentation web app (slide-based with animated build steps)

## Aesthetic Direction
- **Direction:** Neon Lab — near-black backgrounds with vibrant neon green and orange accents
- **Decoration level:** Intentional — subtle card borders, chart glow effects, gradient header
- **Mood:** Professional stage presentation with data visualization energy
- **Reference:** UWGB brand colors adapted into a dark presentation theme

## Typography
- **Display/Hero:** System UI (40px titles)
- **Body:** System UI (14-16px)
- **Data/Tables:** Monospace (font-mono) for all numeric values
- **Scale:** 40px title, 16px subtitle, 14px body, 12px labels, 11px chart ticks

## Color
- **Approach:** Expressive — neon accents on near-black for maximum contrast
- **Background:** #0a0a0f (slide bg), #111118 (header), #14141f (cards)
- **Primary (Accent 1):** #54e03d (neon green) — primary data, positive indicators
- **Highlight (Accent 2):** #ea7600 (orange) — optimal values, highlights, warnings
- **Tertiary (Accent 3):** #1ba72e (darker green) — secondary data, SVM indicators
- **Text:** #e8e8f0 (light gray)
- **Card border:** rgba(27, 167, 46, 0.25)
- **Gradient header:** linear-gradient(135deg, #111118, #1ba72e)

## UWGB Color Origin
Colors derived from UW-Green Bay official brand palette:
- Phoenix Green (#0F5640) → adapted to #1ba72e for visibility on dark backgrounds
- Brand 2 Accent (#54e03d) → used as primary neon accent
- Brand 4 (#ea7600) → used as highlight/optimal indicator
- Brand 3 (#234e52) → informed the dark teal card backgrounds

## Spacing
- **Base unit:** 4px (Tailwind default)
- **Density:** Comfortable
- **Slide padding:** 48px (p-12)
- **Card padding:** 20px (p-5)
- **Card gap:** 16-20px (gap-4 to gap-5)

## Layout
- **Approach:** Grid-disciplined
- **Max content width:** max-w-5xl (1024px)
- **Card border radius:** 8px (rounded-lg)
- **Slide structure:** Header (48px) | Content (flex-1) | Footer (40px)

## Motion
- **Approach:** Intentional — animations serve comprehension
- **Slide transitions:** Cross-fade with directional slide (0.4s, custom ease)
- **Build steps:** Fade up (opacity 0→1, y 16→0, 0.5s ease-out)
- **Counter animation:** Count up from 0 (1.2s ease-out)
- **Chart bars:** Recharts built-in animation (1.2s)
- **Confusion matrix cells:** Staggered scale-in (0.1s delay per cell)

## Navigation
- **Arrow Right / Space:** Next build step or next slide
- **Arrow Left:** Previous build step or previous slide
- **F key:** Toggle fullscreen
- **Click:** Advance (same as Arrow Right)
- **Progress bar:** Bottom-right, animated width

## Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-04-09 | Neon Lab theme selected | User chose dark professional feel with neon accents via design explorer playground |
| 2026-04-09 | Hybrid slides with build steps | Best for controlling pacing during live 7-10 min presentation |
| 2026-04-09 | Interactive Recharts | Hover tooltips valuable during Q&A / project interview |
| 2026-04-09 | 14 slides total | Covers rubric requirements: intro, datasets, methodology, results, comparison, conclusion |
