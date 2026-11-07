---
name: Lumina Collaborative Workspace
colors:
  surface: '#faf8ff'
  surface-dim: '#d2d9f4'
  surface-bright: '#faf8ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f3ff'
  surface-container: '#eaedff'
  surface-container-high: '#e2e7ff'
  surface-container-highest: '#dae2fd'
  on-surface: '#131b2e'
  on-surface-variant: '#434655'
  inverse-surface: '#283044'
  inverse-on-surface: '#eef0ff'
  outline: '#737686'
  outline-variant: '#c3c6d7'
  surface-tint: '#0053db'
  primary: '#004ac6'
  on-primary: '#ffffff'
  primary-container: '#2563eb'
  on-primary-container: '#eeefff'
  inverse-primary: '#b4c5ff'
  secondary: '#0060ac'
  on-secondary: '#ffffff'
  secondary-container: '#64a8fe'
  on-secondary-container: '#003c70'
  tertiary: '#4e565d'
  on-tertiary: '#ffffff'
  tertiary-container: '#676e76'
  on-tertiary-container: '#eaf1fa'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dbe1ff'
  primary-fixed-dim: '#b4c5ff'
  on-primary-fixed: '#00174b'
  on-primary-fixed-variant: '#003ea8'
  secondary-fixed: '#d4e3ff'
  secondary-fixed-dim: '#a4c9ff'
  on-secondary-fixed: '#001c39'
  on-secondary-fixed-variant: '#004883'
  tertiary-fixed: '#dce3ec'
  tertiary-fixed-dim: '#c0c7d0'
  on-tertiary-fixed: '#151c23'
  on-tertiary-fixed-variant: '#40484f'
  background: '#faf8ff'
  on-background: '#131b2e'
  surface-variant: '#dae2fd'
typography:
  display-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.03em
  display-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-xl:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.025em
  headline-xl-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '600'
    lineHeight: 22px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
    letterSpacing: -0.01em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
    letterSpacing: -0.005em
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
    letterSpacing: 0em
  label-md:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 11px
    fontWeight: '600'
    lineHeight: 14px
    letterSpacing: 0.04em
  code-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.25rem
  gutter-sm: 0.75rem
  gutter-lg: 1.5rem
  margin: 1.5rem
  margin-sm: 1rem
  margin-lg: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1.25rem
  space-xl: 2rem
---

## Brand & Style

This design system embodies the ethos of focused clarity, institutional precision, and fluid synchronous creation. Designed specifically for a high-velocity, real-time collaborative document platform, the interface acts as an invisible, high-craft canvas: unobtrusive when deep in creative flow, yet tactile, responsive, and sharp when interacting with spatial tooling and co-presence features.

### Aesthetic Paradigm: Precision Bento Minimalism
The design system couples Japanese editorial discipline with modern, modular Bento-grid organization. It eliminates visual noise, heavy gradients, and decorative bloat in favor of mathematical alignment, micro-hairlines, pure whitespace, and targeted chromatic highlights. 

- **Clarity over Ornamentation:** Structural content sits on crisp white geometric planes against an ultra-soft cool slate canvas. Visual grouping is achieved via alignment and negative space rather than heavy fills.
- **Micro-Crafted Surfaces:** Depth is quiet and refined. Cards utilize razor-sharp 1px neutral borders alongside faint ambient shadows to separate active working layers from structural backdrops.
- **Electric Presence:** Soft pastel azure tones form ambient contextual indicators (e.g., active focus states, selection highlights, inline comments), while vibrant royal blue commands immediate action and intentional user interaction.

## Colors

The color architecture relies on high tonal restraint. Ninety percent of the viewport is composed of neutral light surfaces, allowing content, user avatars, real-time carets, and actionable controls to hold distinct prominence.

### Surface Hierarchy
- **Canvas Base:** `#F8FAFC` (Slate 50) — The cool, anti-glare foundation supporting all floating modules and bento divisions.
- **Surface Elevation 0 (Pure White):** `#FFFFFF` — Document canvases, module cards, modals, and input fields.
- **Surface Elevation 1 (Muted Container):** `#F1F5F9` (Slate 100) — Sub-panels, toolbars, sidebar trays, and table headers.

### Boundary Definition
- **Hairline Border:** `#E2E8F0` (Slate 200) — Uniform 1px stroke for cards, dividers, and modular containers.
- **Interactive Stroke:** `#CBD5E1` (Slate 300) — Form boundaries, inactive pill outlines, and hovered element separators.

### Chromatic Accent Palette
- **Primary Electric Blue:** `#2563EB` (Blue 600) — Primary CTAs, active tool state, focused focus-rings, active live indicators.
- **Secondary Sky Tint:** `#60A5FA` (Blue 400) — User cursor trails, secondary data metrics, real-time presence indicators.
- **Tertiary Soft Wash:** `#EFF6FF` (Blue 50) — Selected text ranges, row highlights, active bento card states, notification badges.
- **Interactive Hover Blue:** `#1D4ED8` (Blue 700) — Depressed and hover states for primary buttons.

### Content Hierarchy (Neutrals)
- **Text Strong:** `#0F172A` (Slate 900) — Primary headlines, document titles, data values.
- **Text Default:** `#334155` (Slate 700) — Body copy, primary metadata, input values.
- **Text Muted:** `#64748B` (Slate 500) — Timestamps, secondary metadata, breadcrumbs, placeholder text.

## Typography

The typographical pairing unites **Plus Jakarta Sans** for expressive, geometric, modern display architecture with **Inter** for neutral, hyper-legible analytical body and UI labels.

### Typographic Principles
- **Plus Jakarta Sans for Headlines:** Carries modern character, rounded terminal openness, and structural balance for dashboard card headers, metrics, and document banners.
- **Inter for System Density:** Utilitarian, pixel-grid aligned, and optimized for tabular data, document runs, collaborative chat flows, and dense properties panels.
- **Letter Spacing:** Tightly tracked negative letter-spacing (`-0.03em` to `-0.01em`) on large display elements preserves optical density. Label styles utilize positive letter-spacing (`+0.02em` to `+0.04em`) to ensure legibility when uppercase or reduced to micro scale.
- **Mobile Graceful Degradation:** Headers above 32px automatically compress downward at standard phone breakpoints to preserve strict multi-column margins without wrapping titles unexpectedly.

## Layout & Spacing

The layout model is anchored around an asymmetric **Bento Grid** that optimizes visual scanning and balances heterogeneous widgets (e.g., real-time editor previews, collaborator streams, analytics, permission matrices).

### Layout Rules
- **Desktop (1200px+):** 12-column dynamic CSS grid with fixed `1.25rem` (20px) gutters and `2rem` (32px) margins. Bento modules span 3, 4, 6, 8, or 12 columns according to informational priority.
- **Tablet (768px – 1199px):** 6-column fluid structure. Primary editor spans 4 columns; auxiliary activity trays span 2 columns. Gutters scale to `1rem` (16px).
- **Mobile (Up to 767px):** 1-column unified vertical stack with `1rem` edge margins and `0.75rem` vertical separation between cards. Sticky top-level document status strip.

### Bento Composition
Modules adhere to standard aspect and height anchors:
- Primary document workspace card: Expansive 2-row span (`col-span-8`, `row-span-2`).
- Presence and activity cards: Narrow tall components (`col-span-4`, `row-span-1`).
- Card Internal Spacing: Enforces comfortable breathing room with a minimum of `1.25rem` internal padding (`space-lg`) on desktop and `1rem` on mobile.

## Elevation & Depth

Visual hierarchy uses **micro-hairline containment combined with soft, non-directional ambient occlusion**. There are no heavy dropped cast shadows or harsh black offsets.

### Depth System

1. **Base Flat (Layer 0):** `#F8FAFC` canvas. No elevation, no border.
2. **Modular Bento Card (Layer 1):** Solid `#FFFFFF` fill encapsulated by a crisp 1px stroke of `#E2E8F0`. Features a faint shadow: `0px 1px 2px rgba(15, 23, 42, 0.04), 0px 4px 12px rgba(15, 23, 42, 0.02)`.
3. **Floating Controls & Toolbars (Layer 2):** Inline formatting ribbons, floating collaborative toolbars, and contextual hover chips: `#FFFFFF` fill with `0px 4px 20px -2px rgba(15, 23, 42, 0.08)` and a 1px border of `#E2E8F0`.
4. **Overlays & Drawers (Layer 3):** Modal document histories, comment popovers, and presence dialogs: `0px 12px 32px -4px rgba(15, 23, 42, 0.12)` accompanied by an ethereal backdrop overlay of `rgba(15, 23, 42, 0.25)` with a `backdrop-blur-sm` (4px).

### The Hairline Guarantee
Every floating element must possess a physical border (`1px solid #E2E8F0` or `#E5E7EB`). Shadows serve solely as depth reinforcement—never as the primary separator between adjacent modules.

## Shapes

The design system embraces a **Rounded (Level 2)** geometry balance. Modules express smooth, engineered curves that humanize the analytical grid while maintaining razor-sharp technical alignment.

### Corner Radii Hierarchy
- **Bento Module Containers:** `rounded-xl` (`1.5rem` / 24px) for prominent dashboard cards, creating soft, distinctive windowing frames.
- **Nested Inner Containers & Modals:** `rounded-lg` (`1rem` / 16px) for embedded sub-cards, preview areas, and dropdown popovers.
- **Standard UI Controls:** `rounded` (`0.5rem` / 8px) for buttons, text input fields, tool icons, and document tabs.
- **Presence, Badges, and Chips:** Full Pill (`9999px`) for collaborator avatar rings, status pills, tags, and action notifications.

## Components

### Buttons
- **Primary:** Solid `#2563EB` fill with white `#FFFFFF` label, `8px` radius, `0px 1px 2px rgba(37, 99, 235, 0.2)` shadow. Hover transitions cleanly to `#1D4ED8`. Active state scales subtly down (`scale(0.98)`).
- **Secondary:** Solid `#FFFFFF` fill, `1px solid #E2E8F0`, `#334155` text. Hover yields `#F8FAFC` background with `#CBD5E1` border.
- **Ghost / Tool Action:** Transparent background, `8px` radius. Hover applies `#EFF6FF` background with `#2563EB` icon tint.

### Cards (Bento System)
- Constructed with `#FFFFFF` background, `24px` radius (`rounded-xl`), and `1px solid #E2E8F0`.
- Card headers feature standard flex layout: `headline-sm` or `headline-md` title paired with pill action indicators or collaborator avatar groups.
- Internal padding is strictly `1.25rem` (`20px`) or `1.5rem` (`24px`).

### Badges & Pill Tags
- **Collaborative Status:** Pill shape (`9999px`), `11px` uppercase bold text (`label-sm`), `4px 10px` padding.
- **Active / Synchronized:** `#EFF6FF` background, `#2563EB` text, with a pulsing `6px` live dot (`#3B82F6`).
- **Muted / Draft:** `#F1F5F9` background, `#64748B` text, `1px solid #E2E8F0`.

### Form Inputs & Text Fields
- Clean `#FFFFFF` surface enclosed by a `1px solid #CBD5E1` border, `8px` corner radius, `10px 14px` padding.
- Text uses `body-md` in `#0F172A`. Placeholders in `#94A3B8`.
- Focus state switches border to `#2563EB` with an electric outer glow: `box-shadow: 0 0 0 3px #EFF6FF`.

### Checkboxes & Toggle Controls
- Checkbox: `18px × 18px`, `4px` radius. Unchecked state is `#FFFFFF` with a `1.5px solid #CBD5E1` border. Checked state transitions to `#2563EB` fill displaying a sharp white SVG checkmark.
- Radio: Circular with matching electric blue active dot when selected.

### Lists & Activity Feeds
- Transparent table or card-based rows separated by `1px solid #F1F5F9` dividers.
- Hovering a feed entry applies an effortless smooth transition to `#F8FAFC` fill across the entire row item with a `4px` radius margin offset.

### Real-Time Document Platform Specifics
- **Collaborator Cursors:** Hairline 1.5px vertical caret paired with an attached name tag chip (`rounded-full`, 10px font, pure white text, individual user-assigned colors).
- **Floating Document Format Bar:** Compact floating pill container (`#FFFFFF`, `1px solid #E2E8F0`, `shadow-xl`), housing icon tools divided by faint vertical dividers (`1px solid #E2E8F0`).