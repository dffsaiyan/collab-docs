---
name: Kinetic Canvas
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#45464d'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#0051d5'
  on-secondary: '#ffffff'
  secondary-container: '#316bf3'
  on-secondary-container: '#fefcff'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#271901'
  on-tertiary-container: '#98805d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#dbe1ff'
  secondary-fixed-dim: '#b4c5ff'
  on-secondary-fixed: '#00174b'
  on-secondary-fixed-variant: '#003ea8'
  tertiary-fixed: '#fcdeb5'
  tertiary-fixed-dim: '#dec29a'
  on-tertiary-fixed: '#271901'
  on-tertiary-fixed-variant: '#574425'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
  canvas-bg: '#F8FAFC'
  paper-surface: '#FFFFFF'
  border-subtle: '#E2E8F0'
  border-strong: '#CBD5E1'
  presence-blue: '#2563EB'
  presence-emerald: '#10B981'
  presence-amber: '#F59E0B'
  presence-purple: '#8B5CF6'
  presence-rose: '#F43F5E'
typography:
  display:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.025em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-lg-mobile:
    fontFamily: Inter
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 34px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.015em
  headline-sm:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Inter
    fontSize: 13px
    fontWeight: '400'
    lineHeight: 18px
  label-md:
    fontFamily: JetBrains Mono
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: JetBrains Mono
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 14px
    letterSpacing: 0.03em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  gutter-mobile: 0.75rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 0.75rem
  space-lg: 1.25rem
  space-xl: 2rem
---

## Brand & Style

This design system embodies high-utility modern minimalism, combining the structure of modern issue trackers with the warm, tactile readability of next-generation document editors. It prioritizes content clarity above all else, maintaining an unobtrusive canvas that gets out of the creator's way while surfacing precise, real-time collaboration signals.

The aesthetic fuses crisp editorial discipline with utilitarian software design. Generous whitespace, refined micro-borders, and tactile interaction surfaces evoke focus, calm, and meticulous craftsmanship. Visual interest is driven not by decorative graphics, but through typography, structured grid rhythm, and luminous presence markers that signify multi-user co-authoring.

## Colors

The palette operates on a layered neutral foundation paired with high-chroma presence indicators:

- **Canvas & Surface Tier:** The underlying application canvas rests on `canvas-bg` (`#F8FAFC`), while active writing documents, sidebars, and contextual floating panels sit on `paper-surface` (`#FFFFFF`).
- **Typography & Monochrome Neutrals:** Text hierarchy relies on zinc and slate nuances. Primary text is set to `primary_color_hex` (`#0F172A`) for absolute contrast, secondary metadata to `neutral_color_hex` (`#64748B`), and subtle UI dividers to `border-subtle` (`#E2E8F0`).
- **Presence & State Accents:** Saturated jewel tones represent real-time co-authoring presence, avatars, cursor lines, and active block selections without compromising the neutral tranquility of the page:
  - `presence-blue` (`#2563EB`) as primary selection and user cursor.
  - `presence-emerald` (`#10B981`), `presence-amber` (`#F59E0B`), `presence-purple` (`#8B5CF6`), and `presence-rose` (`#F43F5E`) dynamically assigned to remote collaborators.

## Typography

Typography prioritizes optical balance, horizontal scanability, and effortless reading endurance during long sessions.

- **Primary Typeface (`Inter`):** Applied uniformly across headers and running document body text. High x-height, neutral letterforms, and precise optical kerning allow headers and paragraphs to flow seamlessly. Headings feature tightened negative tracking (`-0.01em` to `-0.025em`) to maintain editorial cohesion.
- **Monospace Typeface (`JetBrains Mono`):** Applied strictly for metadata, code snippets, status badges, shortcut indicators, and real-time collaboration telemetry tags.

## Layout & Spacing

The layout centers around a fixed-max-width reading column housed within an adaptive fluid workstation:

- **Desktop (>= 1024px):** A three-tier layout containing an optional collapsible navigation sidebar (260px), a centered document sheet (constrained between 720px and 860px for optimal reading line length), and an ephemeral contextual inspector/activity rail (300px).
- **Tablet (768px - 1023px):** Sidebars convert into sliding sheets; document sheet occupies full viewport width with a standard horizontal padding of `1.5rem`.
- **Mobile (< 768px):** Single-column stack. Document gutters collapse to `0.75rem` (`gutter-mobile`), controls dock into a sticky bottom toolbar, and typography shifts to mobile-specific scale tokens.

## Elevation & Depth

Visual hierarchy employs low-contrast outlines combined with ambient micro-shadows rather than high-contrast drops:

- **Level 0 (Base Canvas):** Flat `#F8FAFC`, no shadow, no border.
- **Level 1 (Document Sheet & Sidebar Panes):** `#FFFFFF` surface bounded by a continuous `1px solid #E2E8F0` border and an ambient micro-shadow: `0 1px 3px 0 rgba(15, 23, 42, 0.03), 0 1px 2px -1px rgba(15, 23, 42, 0.02)`.
- **Level 2 (Dropdowns, Command Menus, Modals):** `#FFFFFF` surface bounded by `1px solid #CBD5E1` with a soft elevation shadow: `0 10px 15px -3px rgba(15, 23, 42, 0.06), 0 4px 6px -4px rgba(15, 23, 42, 0.04)`.
- **Level 3 (Floating Collaborative Carets & Badges):** High-precision micro-pill overlays anchored with crisp `0 2px 4px rgba(0, 0, 0, 0.08)` shadows to float distinctly above active document content.

## Shapes

The interface adopts a disciplined "Soft" curvature level (roundedness `1`):

- **Micro Controls & Inputs:** Form elements, buttons, and block drag handles employ a consistent `4px` (`0.25rem`) radius, preventing visual distortion and preserving structural precision.
- **Panels & Cards:** Document sheets, floating modals, and contextual menus utilize an `8px` (`0.5rem`, `rounded-lg`) radius.
- **Pill Elements:** User avatar chips, collaborator cursor tags, and status pills retain full circular or pill radii to contrast sharply against geometric document blocks.

## Components

### Buttons
- **Primary:** Solid `#0F172A` background, `#FFFFFF` text, `4px` radius, subtle hover state brightening to `#1E293B`.
- **Ghost/Tertiary:** Transparent background, `#64748B` text, `4px` radius; hover invokes `#F1F5F9` background and `#0F172A` text.
- **Presence Action:** Tinted 10% translucent background corresponding to user accent, filled text with matching solid color.

### Document Blocks & Lists
- **Block Elements:** Zero border by default with an invisible 24px left gutter reserved for reorder drag-handles and action triggers (`+` / `⋮⋮`), revealed exclusively on hover.
- **Selection State:** Active block wrapped in a 1px outline or soft background wash tinted with the current user's or collaborator's presence accent color (e.g., `#2563EB` at 6% opacity).

### Inputs & Slash Commands
- **Text Inputs:** Borderless or subtle `1px solid #E2E8F0` border, focusing smoothly into `1px solid #2563EB` with zero outer ring bloom.
- **Slash Menu:** Popover panel with keyboard-focused list items, `4px` radius item highlights, paired with `JetBrains Mono` label badges indicating keyboard shortcuts.

### Checkboxes & Interactive Toggles
- **To-Do Items:** Custom square checkboxes with a `3px` radius, thin `1.5px` border in `#CBD5E1`. Checked state transitions to `#0F172A` fill with a white checkmark, accompanied by a clean strike-through and reduced opacity (`#94A3B8`) on adjacent text.

### Collaborative Presence Tags
- **Live Caret:** A persistent 2px vertical bar colored with the user's presence hex (`#2563EB`, `#10B981`, etc.).
- **User Flag:** An ephemeral floating pill badge hovering directly atop the caret displaying the collaborator's first name in `label-sm` (`JetBrains Mono`, 11px), solid colored background with white high-contrast text.